import axios from "axios"

const BASE_URL = "http://localhost:4000"
const USERS_API = `${BASE_URL}/api/users`

export const apiSendMessage = (uid1, uid2, message) => 
  axios.post(`${USERS_API}/${uid1}/users/${uid2}/messages`, message)
    .then(response => response.data)

export const apiDeleteMessage = (uid1, uid2) =>
  axios.delete(`${USERS_API}/${uid1}/users/${uid2}/messages`)
    .then(response => response.status)