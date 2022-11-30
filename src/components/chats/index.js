import { useEffect, useState } from "react"
import React from 'react'
import { getAllChatsById } from "../../redux/chatSlice"
import { getSingleChat } from "../../redux/messageSlice.js"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../socket'

const Chats = () => {

  const chatList = useSelector((state) => state.chats.chats)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const [input, setInput] = useState(false)

  useEffect(() => {
    if (user && user._id) {
      dispatch( getAllChatsById(user._id) )
    }
  }, [dispatch, user])

  // const joinChat = (chat) => {
  //   if (chat.from !== "" && chat.to !== "") {
  //     const room = `${chat.from} -- ${chat.to}`
  //     socket.emit("join_room", room)
  //     dispatch( getSingleChat(chat.from, chat.to) )
  //     navigate("/messages")
  //   }
  // }
  
  // const chats = chatList.map((chat) => {
  //   return (
  //     <div onClick={joinChat(chat)}> 
  //       <p> {chat.to} </p>
  //       <p> {chat.sentOn} </p>
  //       <p> {chat.lastMessage} </p>
  //     </div>
  //   )
  // })
  
  return (
    <div>
      <h1>Chats</h1>
      <button onClick={() => setInput(true)}> New Message </button>
      {/* <i 
        class="fa-solid fa-plus"
        onClick={() => setInput(true)}/> */}
      {/* { chats } */}
      
      {input && <input type="text" placeholder="type user..."/>}
    </div>
  )
}

export default Chats