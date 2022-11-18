/**
 * @file implements the message data service
 */
import axios from "axios"
import io from "socket.io-client"

const socket = io.connect("http://localhost:4000")
const BASE_URL = "http://localhost:4000"
const USERS_API = `${BASE_URL}/api/users`

/** 
 * Sends message from one user to another 
 * @param uid1 String user id 1
 * @param uid2 String user id 2
 * @param message Object with message data inside
 * @returns response with the message object 
*/
export const apiSendMessage = (message) => 
  socket.emit('sendMessage', message)
    .then(response => response.data)

/** 
 * Deletes a message in a conversation between two users
 * @param uid1 String user id 1
 * @param uid2 String user id 2
 * @returns status of delete request
*/
export const apiDeleteMessage = (uid1, uid2) =>
  axios.delete(`${USERS_API}/${uid1}/users/${uid2}/messages`)
    .then(response => response.status)