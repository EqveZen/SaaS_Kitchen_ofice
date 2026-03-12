/* =================================
   AUTH SERVICE
   Login / Logout / Session control
================================= */

import {api, setToken, clearToken, getToken} from "./api.js"
import {Store} from "../core/store.js"

/* =================================
   LOGIN
================================= */

export async function login(email,password){

try{

const res = await api("/auth/login","POST",{
email,
password
})

if(res.token){

setToken(res.token)

Store.set("user",res.user)

return res.user

}

}catch(err){

console.error("Login error",err)

throw err

}

}

/* =================================
   LOGOUT
================================= */

export function logout(){

clearToken()

Store.reset()

window.location.href="/login.html"

}

/* =================================
   RESTORE SESSION
================================= */

export async function restoreSession(){

const token = getToken()

if(!token) return null

try{

const user = await api("/auth/me")

Store.set("user",user)

return user

}catch{

clearToken()

return null

}

}

/* =================================
   ROLE CHECK
================================= */

export function hasRole(role){

const user = Store.get("user")

if(!user) return false

return user.role === role

}

/* =================================
   PERMISSION CHECK
================================= */

export function can(permission){

const user = Store.get("user")

if(!user) return false

const role = user.role

const permissions = rolePermissions(role)

return permissions.includes(permission)

}

/* =================================
   ROLE PERMISSIONS
================================= */

function rolePermissions(role){

const map={

admin:[
"menu.edit",
"menu.delete",
"reports.view",
"users.manage",
"inventory.manage"
],

manager:[
"menu.edit",
"reports.view",
"inventory.manage"
],

cashier:[
"orders.create",
"orders.pay"
],

waiter:[
"orders.create"
],

kitchen:[
"kitchen.view"
]

}

return map[role] || []

}

/* =================================
   REQUIRE AUTH
================================= */

export function requireAuth(){

const token = getToken()

if(!token){

window.location.href="/login.html"

}

}

/* =================================
   REQUIRE ROLE
================================= */

export function requireRole(role){

const user = Store.get("user")

if(!user || user.role!==role){

alert("Access denied")

window.location.href="/"

}

}
