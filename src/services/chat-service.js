/**
 * @file implements the chat data service
 */
import axios from "axios"

const BASE_URL = "http://localhost:4000"
const TUITS_API = `${BASE_URL}/api/tuits`
const USERS_API = `${BASE_URL}/api/users`

/** 
 * Retrieves a chat between two users
 * @param uid1 String user id 1
 * @param uid2 String user id 2
 * @returns response with the chat object
*/
export const apiGetSingleChat = (uid1, uid2) => 
  axios.get(`${USERS_API}/${uid1}/users/${uid2}/chat`)
    .then(response => response.data[0])

/** 
 * Retrieves all chats involving a user
 * @param uid1 String user id 1
 * @returns response with an array of chat objects
*/
export const apiGetAllChatsById = (uid) =>
  axios.get(`${USERS_API}/${uid}/chats`)
    .then(response => response.data)

/** 
 * Deletes a chat between two users
 * @param uid1 String user id 1
 * @param uid1 String user id 2
 * @returns response with delete status
*/
export const apiDeleteSingleChat = (uid1, uid2) =>
  axios.delete(`${USERS_API}/${uid1}/users/${uid2}/chat`)
    .then(response => response.status)