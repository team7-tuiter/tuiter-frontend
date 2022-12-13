/**
 * @file implements the chat data service
 */
import axios from "axios"

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL
const USERS_API = `${REACT_APP_BASE_URL}/users`

/** 
 * Retrieves all chats involving a user
 * @param uid String user id 
 * @returns response with an array of chat objects
*/
export const apiGetAllChatsById = (uid) =>
  axios.get(`${USERS_API}/${uid}/chats`)
    .then(response => response.data)

/**
 * Get all last messages from all chats involving a user
 * @param uid user id
 * @returns response with array of messages
 */
export const apiGetAllMessagesFromAllChats = (uid) =>
  axios.get(`${USERS_API}/${uid}/chats/last`)
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

/**
 * Creates new chat
 * @param chat Chat object with empty messages array
 * @returns chat object 
 */
export const apiCreateChat = (chat) => 
  axios.post(`${REACT_APP_BASE_URL}/chat`, chat)
    .then(response => response.data)