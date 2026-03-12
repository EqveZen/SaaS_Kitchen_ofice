/* =================================
   APPLICATION CORE
   Bootstraps the POS system
================================= */

import {Store} from "./store.js"
import {api} from "../services/api.js"
import {connectSocket} from "../services/socket.js"

/* =================================
   INIT APPLICATION
================================= */

export async function initApp(){

console.log("Starting POS...")

try{

setLoading(true)

await loadUser()

await loadRestaurant()

await loadTables()

await loadMenu()

await loadOrders()

connectSocket()

setLoading(false)

console.log("POS Ready")

}catch(err){

console.error("App init error",err)

setLoading(false)

}

}

/* =================================
   LOAD USER
================================= */

async function loadUser(){

try{

const user = await api("/auth/me")

Store.set("user",user)

}catch{

Store.set("user",{
id:"demo",
name:"Demo User",
role:"admin"
})

}

}

/* =================================
   LOAD RESTAURANT
================================= */

async function loadRestaurant(){

try{

const restaurant = await api("/restaurant")

Store.set("restaurant",restaurant)

}catch{

Store.set("restaurant",{
id:"demo_restaurant",
name:"Demo Cafe",
currency:"€"
})

}

}

/* =================================
   LOAD TABLES
================================= */

async function loadTables(){

try{

const tables = await api("/tables")

Store.set("tables",tables)

}catch{

Store.set("tables",generateDemoTables())

}

}

/* =================================
   LOAD MENU
================================= */

async function loadMenu(){

try{

const menu = await api("/menu")

Store.set("menu",menu)

}catch{

Store.set("menu",generateDemoMenu())

}

}

/* =================================
   LOAD ORDERS
================================= */

async function loadOrders(){

try{

const orders = await api("/orders")

Store.set("orders",orders)

}catch{

Store.set("orders",[])

}

}

/* =================================
   LOADING STATE
================================= */

function setLoading(v){

Store.update("ui",{loading:v})

}

/* =================================
   DEMO DATA
================================= */

function generateDemoTables(){

const tables=[]

for(let i=1;i<=12;i++){

tables.push({
id:"t"+i,
name:"Table "+i,
capacity:4,
status:"free"
})

}

return tables

}

function generateDemoMenu(){

return [

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

]

}
