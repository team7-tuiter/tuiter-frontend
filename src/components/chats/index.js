/**
 * @file implements Chat component
 */

import { useEffect, useState } from "react"
import React from 'react'
import { getAllChatsById } from "../../redux/chatSlice"
import { getSingleChat } from "../../redux/messageSlice.js"
import { createChat } from "../../redux/chatSlice"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SocketFactory from '../../socket'
import { joinRoom } from "../../redux/roomSlice"

const Chats = () => {

  const chats = useSelector((state) => state.chats.chats)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const [showInput, setShowInput] = useState(false)
  const [inputUser, setInputUser] = useState("")

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllChatsById(user._id))
    }
  }, [dispatch, user])


  const goToNewConversation = (loggedUsername, otherUsername) => {
    if (loggedUsername !== "" && otherUsername !== "") {
      // userId order is made by string comparison 
      const { userId1, userId2 } = loggedUsername > otherUsername ? { userId1: loggedUsername, userId2: otherUsername } : { userId1: otherUsername, userId2: loggedUsername }
      const chatObj = {
        userId1,
        userId2,
        messages: []
      }
      dispatch(createChat(chatObj))
      const room = `${userId1} -- ${userId2}`
      SocketFactory.getConnection().emit("join_room", room)
      dispatch(joinRoom(room))
      navigate("/messages")
    }
  }

  return (
    <div>
      <h1>Chats</h1>
      <h5>Logged in as user: {user?.username}</h5>

      <button onClick={() => setShowInput(true)}> New Message </button>

      {chats?.messages}

      {showInput && (
        <>
          <input
            type="text"
            placeholder="type user..."
            onChange={(e) =>
              setInputUser(e.target.value)}
          />

          <button onClick={() => goToNewConversation(user.username, inputUser)} > Go to conversation </button>
        </>
      )}
    </div>
  )
}

export default Chats