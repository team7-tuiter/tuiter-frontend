import axios from "axios"

const BASE_URL = "http://localhost:4000"
const TUITS_API = `${BASE_URL}/api/tuits`
const USERS_API = `${BASE_URL}/api/users`

export const apiGetSingleChat = () => 
  axios.get("http://localhost:4000/api/tuits")
  .then(response => response.data)

export const apiGetChatsById = (tid) =>
  axios.get(`${TUITS_API}/${tid}`)
    .then(response => response.data)

export const apiDeleteSingleChat = (uid) =>
  axios.get(`${USERS_API}/${uid}/tuits`)
    .then(response => response.data)
    