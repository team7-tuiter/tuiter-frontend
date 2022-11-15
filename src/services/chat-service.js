import axios from "axios"

const BASE_URL = "http://localhost:4000"
const TUITS_API = `${BASE_URL}/api/tuits`
const USERS_API = `${BASE_URL}/api/users`

export const apiGetSingleChat = (uid1, uid2) => 
  axios.get(`${USERS_API}/${uid1}/users/${uid2}/chat`)
  .then(response => response.data[0])

export const apiGetAllChatsById = (uid) =>
  axios.get(`${USERS_API}/${uid}/chats`)
    .then(response => response.data)

export const apiDeleteSingleChat = (uid1, uid2) =>
  axios.delete(`${USERS_API}/${uid1}/users/${uid2}/chat`)
    .then(response => response.data)