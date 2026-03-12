/* =================================
   GLOBAL APPLICATION STORE
   Central state manager
================================= */

export const Store = {

state:{

/* current user */
user:null,

/* restaurant info */
restaurant:null,

/* tables */
tables:[],

/* menu */
menu:[],

/* categories */
categories:[],

/* orders */
orders:[],

/* payments */
payments:[],

/* inventory */
inventory:[],

/* UI state */
ui:{
currentOrder:null,
currentTable:null,
loading:false
}

},

/* listeners */
listeners:[],

/* ================================
   GET STATE
================================ */

get(key){

return this.state[key]

},

/* ================================
   SET STATE
================================ */

set(key,value){

this.state[key]=value

this.emit()

},

/* ================================
   UPDATE OBJECT
================================ */

update(key,patch){

this.state[key]={

...this.state[key],
...patch

}

this.emit()

},

/* ================================
   PUSH INTO ARRAY
================================ */

push(key,item){

if(!Array.isArray(this.state[key])) return

this.state[key].push(item)

this.emit()

},

/* ================================
   REMOVE FROM ARRAY
================================ */

remove(key,id){

if(!Array.isArray(this.state[key])) return

this.state[key]=this.state[key].filter(
i=>i.id!==id
)

this.emit()

},

/* ================================
   FIND
================================ */

find(key,id){

if(!Array.isArray(this.state[key])) return null

return this.state[key].find(
i=>i.id===id
)

},

/* ================================
   SUBSCRIBE
================================ */

subscribe(fn){

this.listeners.push(fn)

},

/* ================================
   UNSUBSCRIBE
================================ */

unsubscribe(fn){

this.listeners=this.listeners.filter(
l=>l!==fn
)

},

/* ================================
   EMIT CHANGES
================================ */

emit(){

this.listeners.forEach(
fn=>fn(this.state)
)

},

/* ================================
   RESET STORE
================================ */

reset(){

this.state={

user:null,
restaurant:null,

tables:[],
menu:[],
categories:[],

orders:[],
payments:[],
inventory:[],

ui:{
currentOrder:null,
currentTable:null,
loading:false
}

}

this.emit()

}

}
