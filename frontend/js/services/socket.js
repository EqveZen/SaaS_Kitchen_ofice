/* =================================
   SOCKET SERVICE
   Realtime communication layer
   POS ↔ Kitchen ↔ Admin
================================= */

import {Store} from "../core/store.js"

let socket = null

const SOCKET_URL = "ws://localhost:8081"

/* =================================
   CONNECT
================================= */

export function connectSocket(){

try{

socket = new WebSocket(SOCKET_URL)

socket.onopen = () => {

console.log("WebSocket connected")

}

socket.onmessage = handleMessage

socket.onerror = err => {

console.error("WebSocket error",err)

}

socket.onclose = () => {

console.warn("WebSocket disconnected")

reconnect()

}

}catch(err){

console.error("Socket init error",err)

}

}

/* =================================
   RECONNECT
================================= */

function reconnect(){

setTimeout(()=>{

console.log("Reconnecting socket...")

connectSocket()

},3000)

}

/* =================================
   MESSAGE HANDLER
================================= */

function handleMessage(event){

try{

const data = JSON.parse(event.data)

switch(data.type){

case "order_created":

handleOrderCreated(data.payload)

break

case "order_updated":

handleOrderUpdated(data.payload)

break

case "order_ready":

handleOrderReady(data.payload)

break

case "order_served":

handleOrderServed(data.payload)

break

case "inventory_update":

handleInventoryUpdate(data.payload)

break

default:

console.log("Unknown socket event",data)

}

}catch(err){

console.error("Socket parse error",err)

}

}

/* =================================
   SEND MESSAGE
================================= */

export function send(type,payload){

if(!socket || socket.readyState !== WebSocket.OPEN){

console.warn("Socket not ready")

return

}

socket.send(JSON.stringify({
type,
payload
}))

}

/* =================================
   ORDER EVENTS
================================= */

function handleOrderCreated(order){

const orders = Store.get("orders")

orders.push(order)

Store.set("orders",orders)

}

function handleOrderUpdated(order){

const orders = Store.get("orders")

const index = orders.findIndex(o=>o.id===order.id)

if(index!==-1){

orders[index]=order

Store.set("orders",orders)

}

}

function handleOrderReady(order){

const orders = Store.get("orders")

const o = orders.find(x=>x.id===order.id)

if(o){

o.status="ready"

Store.emit()

}

}

function handleOrderServed(order){

const orders = Store.get("orders")

const o = orders.find(x=>x.id===order.id)

if(o){

o.status="served"

Store.emit()

}

}

/* =================================
   INVENTORY EVENT
================================= */

function handleInventoryUpdate(update){

const inventory = Store.get("inventory")

const item = inventory.find(i=>i.id===update.id)

if(item){

item.qty = update.qty

Store.emit()

}

}

/* =================================
   CREATE ORDER EVENT
================================= */

export function notifyNewOrder(order){

send("order_created",order)

}

/* =================================
   UPDATE ORDER STATUS
================================= */

export function notifyOrderStatus(order){

send("order_updated",order)

}
