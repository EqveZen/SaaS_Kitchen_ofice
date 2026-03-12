/* =================================
   FORMAT UTILITIES
   Formatting helpers for POS
================================= */

/* =================================
   CURRENCY FORMAT
================================= */

export function currency(value, symbol="₽"){

const number = Number(value || 0)

return symbol + number.toFixed(2)

}

/* =================================
   NUMBER FORMAT
================================= */

export function number(value){

return new Intl.NumberFormat().format(value)

}

/* =================================
   DATE FORMAT
================================= */

export function date(timestamp){

const d = new Date(timestamp)

return d.toLocaleDateString()

}

/* =================================
   TIME FORMAT
================================= */

export function time(timestamp){

const d = new Date(timestamp)

return d.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})

}

/* =================================
   DATETIME FORMAT
================================= */

export function datetime(timestamp){

const d = new Date(timestamp)

return d.toLocaleString()

}

/* =================================
   ORDER TIME
================================= */

export function orderTime(timestamp){

const diff = Date.now() - timestamp

const minutes = Math.floor(diff/60000)

if(minutes < 1){
return "now"
}

if(minutes < 60){
return minutes + " мин."
}

const hours = Math.floor(minutes/60)

return hours + " ч."

}

/* =================================
   PERCENT
================================= */

export function percent(value){

return (value*100).toFixed(1) + "%"

}

/* =================================
   PHONE FORMAT
================================= */

export function phone(num){

if(!num) return ""

const clean = num.replace(/\D/g,"")

return clean
.replace(/(\d{3})(\d{3})(\d{4})/,"($1) $2-$3")

}

/* =================================
   RECEIPT TOTAL
================================= */

export function receiptTotal(order){

if(!order || !order.items) return "0.00"

const total = order.items.reduce((s,i)=>{

return s + i.price * i.qty

},0)

return currency(total)

}

/* =================================
   SHORT TEXT
================================= */

export function short(text,length=30){

if(!text) return ""

if(text.length <= length) return text

return text.substring(0,length) + "..."

}

/* =================================
   CAPITALIZE
================================= */

export function capitalize(text){

if(!text) return ""

return text.charAt(0).toUpperCase() + text.slice(1)

}

/* =================================
   ORDER STATUS LABEL
================================= */

export function orderStatus(status){

const map={

open:"Open",
cooking:"Cooking",
ready:"Ready",
served:"Served",
paid:"Paid"

}

return map[status] || status

}
