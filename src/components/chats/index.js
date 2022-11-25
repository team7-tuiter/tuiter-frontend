import io from "socket.io-client"
import { useEffect, useState } from "react"
import React from 'react'
import { getAllChatsById } from "../../redux/chatSlice"
import { getSingleChat } from "../../redux/messageSlice.js"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const socket = io.connect("http://localhost:4000")

const Chats = () => {

  const chatList = useSelector((state) => state.chats.chats)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useState("")

  useEffect(() => {
    if (user._id) {
      dispatch( getAllChatsById(user._id) )
    }
  }, [dispatch, user._id])

  const joinChat = (chat) => {
    if (chat.from !== "" && chat.to !== "") {
      const room = `${chat.from} -- ${chat.to}`
      socket.emit("join_room", room)
      dispatch( getSingleChat(chat.from, chat.to) )
      navigate("/messages")
    }
  }
  
  const chats = chatList.map((chat) => {
    return (
      <div onClick={joinChat(chat)}> 
        <p> {chat.to} </p>
        <p> {chat.sentOn} </p>
        <p> {chat.lastMessage} </p>
      </div>
    )
  })

  return (
    <div>
      { chats }
    </div>
  )
}

export default Chats