import io from "socket.io-client"
import { useState } from "react"
import React from 'react'
import Messages from "../messages/index.js"
import { useSelector, useDispatch } from 'react-redux'


const socket = io.connect("http://localhost:4000")


const Chats = () => {
  
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)
  const chatList = useSelector((state) => state.chats.chats)

  const joinRoom = () => {
    if (from !== "" && to !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }

  return (
    <div className="main-thing">
      { showChat ?? <Messages socket={socket} from={from} room={room} /> }
    </div>
  )
}

export default Chats;