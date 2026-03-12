/* =================================
   POS SAAS BACKEND SERVER
================================= */

import express from "express"
import cors from "cors"
import {WebSocketServer} from "ws"
import pkg from "pg"

const {Pool} = pkg

/* =================================
   CONFIG
================================= */

const PORT = process.env.PORT || 8080
const WS_PORT = 8081

/* =================================
   EXPRESS APP
================================= */

const app = express()

app.use(cors())
app.use(express.json())

/* =================================
   DATABASE
================================= */

const db = new Pool({

connectionString:
process.env.DATABASE_URL ||
"postgresql://postgres:postgres@localhost:5432/pos"

})

db.connect()
.then(()=>console.log("PostgreSQL connected"))
.catch(err=>console.error(err))

/* =================================
   ROOT
================================= */

app.get("/",(req,res)=>{

res.json({
name:"POS SaaS API",
status:"running"
})

})

/* =================================
   AUTH
================================= */

app.post("/api/auth/login",(req,res)=>{

const {email,password}=req.body

/* demo auth */

if(email==="admin@demo.com"){

return res.json({

token:"demo_token",

user:{
id:"u1",
name:"Admin",
role:"admin"
}

})

}

res.status(401).json({
error:"invalid login"
})

})

app.get("/api/auth/me",(req,res)=>{

res.json({

id:"u1",
name:"Admin",
role:"admin"

})

})

/* =================================
   TABLES
================================= */

app.get("/api/tables",async(req,res)=>{

try{

const result =
await db.query("SELECT * FROM tables")

res.json(result.rows)

}catch{

/* fallback demo */

const tables=[]

for(let i=1;i<=12;i++){

tables.push({

id:"t"+i,
name:"Table "+i,
status:"free"

})

}

res.json(tables)

}

})

/* =================================
   MENU
================================= */

app.get("/api/menu",async(req,res)=>{

try{

const result =
await db.query("SELECT * FROM menu")

res.json(result.rows)

}catch{

res.json([

{
id:"m1",
name:"Margherita",
price:8.5,
category:"Pizza"
},

{
id:"m2",
name:"Pepperoni",
price:9.5,
category:"Pizza"
},

{
id:"m3",
name:"Carbonara",
price:7,
category:"Pasta"
},

{
id:"m4",
name:"Cola",
price:2,
category:"Drinks"
}

])

}

})

/* =================================
   ORDERS
================================= */

app.get("/api/orders",async(req,res)=>{

try{

const result =
await db.query("SELECT * FROM orders")

res.json(result.rows)

}catch{

res.json([])

}

})

app.post("/api/orders",async(req,res)=>{

const order=req.body

try{

await db.query(

`INSERT INTO orders
(id,number,status,total)
VALUES($1,$2,$3,$4)`,

[
order.id,
order.number,
order.status,
order.total
]

)

res.json({ok:true})

}catch(err){

console.error(err)

res.status(500).json({
error:"db error"
})

}

})

/* =================================
   PAYMENTS
================================= */

app.get("/api/payments",async(req,res)=>{

try{

const result =
await db.query("SELECT * FROM payments")

res.json(result.rows)

}catch{

res.json([])

}

})

/* =================================
   START SERVER
================================= */

app.listen(PORT,()=>{

console.log("API running on port",PORT)

})

/* =================================
   WEBSOCKET SERVER
================================= */

const wss = new WebSocketServer({
port:WS_PORT
})

wss.on("connection",ws=>{

console.log("Socket client connected")

ws.on("message",msg=>{

try{

const data = JSON.parse(msg)

broadcast(data)

}catch(e){

console.error(e)

}

})

})

function broadcast(data){

wss.clients.forEach(client=>{

if(client.readyState===1){

client.send(JSON.stringify(data))

}

})

}

console.log("WebSocket running on",WS_PORT)
