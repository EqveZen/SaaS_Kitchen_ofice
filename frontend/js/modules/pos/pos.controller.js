/* =================================
   POS CONTROLLER
   Business logic of POS terminal
================================= */

import {Store} from "../../core/store.js"
import {uid, orderNumber, paymentId} from "../../utils/uid.js"
import {notifyNewOrder, notifyOrderStatus} from "../../services/socket.js"

/* =================================
   OPEN TABLE
================================= */

export function openTable(tableId){

const tables = Store.get("tables")
const orders = Store.get("orders")

const table = tables.find(t=>t.id===tableId)

if(!table) return null

let order = orders.find(
o=>o.tableId===tableId && o.status==="open"
)

if(!order){

order = createOrder(tableId)

orders.push(order)

Store.set("orders",orders)

notifyNewOrder(order)

}

Store.update("ui",{
currentOrder:order.id,
currentTable:tableId
})

return order

}

/* =================================
   CREATE ORDER
================================= */

export function createOrder(tableId){

return {

id:uid("ord"),

number:orderNumber(),

tableId,

items:[],

status:"open",

created:Date.now(),

subtotal:0,

tax:0,

tips:0,

total:0

}

}

/* =================================
   ADD ITEM
================================= */

export function addItem(menuItem){

const orderId = Store.get("ui").currentOrder

if(!orderId) return

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

if(!order) return

let existing = order.items.find(
i=>i.menuId===menuItem.id
)

if(existing){

existing.qty++

}else{

order.items.push({

id:uid("item"),

menuId:menuItem.id,

name:menuItem.name,

price:menuItem.price,

qty:1

})

}

recalcOrder(order)

Store.emit()

}

/* =================================
   REMOVE ITEM
================================= */

export function removeItem(itemId){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

order.items = order.items.filter(
i=>i.id!==itemId
)

recalcOrder(order)

Store.emit()

}

/* =================================
   CHANGE QTY
================================= */

export function updateQty(itemId,qty){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

const item = order.items.find(i=>i.id===itemId)

if(!item) return

item.qty = Math.max(1,qty)

recalcOrder(order)

Store.emit()

}

/* =================================
   CLEAR ORDER
================================= */

export function clearOrder(){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

order.items=[]

recalcOrder(order)

Store.emit()

}

/* =================================
   CALCULATE TOTALS
================================= */

function recalcOrder(order){

order.subtotal = order.items.reduce(
(sum,i)=>sum + i.price * i.qty ,0
)

order.tax = order.subtotal * 0.1

order.total = order.subtotal + order.tax + order.tips

}

/* =================================
   ADD TIPS
================================= */

export function addTips(amount){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

order.tips = amount

recalcOrder(order)

Store.emit()

}

/* =================================
   SPLIT BILL
================================= */

export function splitBill(parts){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

if(!order) return []

const each = order.total / parts

const splits=[]

for(let i=0;i<parts;i++){

splits.push({
part:i+1,
amount:each
})

}

return splits

}

/* =================================
   PAYMENT
================================= */

export function pay(method="cash"){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

if(!order) return

const payments = Store.get("payments")

const payment={

id:paymentId(),

orderId:order.id,

method,

amount:order.total,

created:Date.now()

}

payments.push(payment)

order.status="paid"

Store.set("payments",payments)

notifyOrderStatus(order)

freeTable(order.tableId)

Store.update("ui",{
currentOrder:null,
currentTable:null
})

}

/* =================================
   FREE TABLE
================================= */

function freeTable(tableId){

const tables = Store.get("tables")

const table = tables.find(t=>t.id===tableId)

if(table){

table.status="free"

Store.emit()

}

}

/* =================================
   SEND TO KITCHEN
================================= */

export function sendToKitchen(){

const orderId = Store.get("ui").currentOrder

const orders = Store.get("orders")

const order = orders.find(o=>o.id===orderId)

order.status="cooking"

notifyOrderStatus(order)

Store.emit()

}

/* =================================
   GET CURRENT ORDER
================================= */

export function getCurrentOrder(){

const id = Store.get("ui").currentOrder

const orders = Store.get("orders")

return orders.find(o=>o.id===id)

}
