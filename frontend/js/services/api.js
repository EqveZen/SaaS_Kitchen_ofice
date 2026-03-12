/* =================================
   API SERVICE
   HTTP client for backend requests
================================= */

import {Store} from "../core/store.js"

/* =================================
   CONFIG
================================= */

const API_BASE = "/api"

/* =================================
   MAIN API FUNCTION
================================= */

export async function api(path,method="GET",data=null){

const token = getToken()

const options={

method,

headers:{
"Content-Type":"application/json"
},

}

if(token){

options.headers["Authorization"]="Bearer "+token

}

if(data){

options.body = JSON.stringify(data)

}

try{

const response = await fetch(API_BASE + path , options)

if(!response.ok){

handleHttpError(response)

}

const result = await response.json()

return result

}catch(err){

console.error("API error:",err)

throw err

}

}

/* =================================
   HTTP METHODS
================================= */

export function get(path){

return api(path,"GET")

}

export function post(path,data){

return api(path,"POST",data)

}

export function put(path,data){

return api(path,"PUT",data)

}

export function del(path){

return api(path,"DELETE")

}

/* =================================
   TOKEN MANAGEMENT
================================= */

export function getToken(){

return localStorage.getItem("pos_token")

}

export function setToken(token){

localStorage.setItem("pos_token",token)

}

export function clearToken(){

localStorage.removeItem("pos_token")

}

/* =================================
   ERROR HANDLING
================================= */

function handleHttpError(response){

if(response.status===401){

logoutRedirect()

}

if(response.status===403){

alert("Access denied")

}

if(response.status===500){

alert("Server error")

}

}

/* =================================
   LOGOUT REDIRECT
================================= */

function logoutRedirect(){

clearToken()

window.location.href="/login.html"

}

/* =================================
   FILE UPLOAD
================================= */

export async function upload(path,file){

const formData = new FormData()

formData.append("file",file)

const token = getToken()

const res = await fetch(API_BASE+path,{

method:"POST",

headers:{
Authorization:"Bearer "+token
},

body:formData

})

return res.json()

}
