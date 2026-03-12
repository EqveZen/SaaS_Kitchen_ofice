/* =================================
   UID GENERATOR
   Unique IDs for POS entities
================================= */

/* =================================
   SIMPLE UID
================================= */

export function uid(prefix="id"){

const random = Math.random()
.toString(36)
.substring(2,10)

const time = Date.now().toString(36)

return `${prefix}_${time}_${random}`

}

/* =================================
   SHORT UID
================================= */

export function shortId(prefix="id"){

const random = Math.random()
.toString(36)
.substring(2,6)

return `${prefix}_${random}`

}

/* =================================
   ORDER NUMBER
================================= */

export function orderNumber(){

const date = new Date()

const day = date.getDate()
.toString()
.padStart(2,"0")

const month = (date.getMonth()+1)
.toString()
.padStart(2,"0")

const random = Math.floor(
Math.random()*900+100
)

return `ORD-${day}${month}-${random}`

}

/* =================================
   TABLE NUMBER
================================= */

export function tableCode(num){

return `T-${num}`

}

/* =================================
   PAYMENT ID
================================= */

export function paymentId(){

const random = Math.random()
.toString(36)
.substring(2,8)

return `PAY-${random}`

}

/* =================================
   USER ID
================================= */

export function userId(){

return uid("usr")

}

/* =================================
   MENU ITEM ID
================================= */

export function menuItemId(){

return uid("menu")

}

/* =================================
   INVENTORY ITEM ID
================================= */

export function inventoryId(){

return uid("inv")

}

/* =================================
   RECEIPT NUMBER
================================= */

export function receiptNumber(){

const timestamp = Date.now()

const rand = Math.floor(Math.random()*1000)

return `RCPT-${timestamp}-${rand}`

}
