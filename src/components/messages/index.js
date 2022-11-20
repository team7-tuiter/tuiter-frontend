import io from "socket.io-client"
import { useState } from "react"
import React from 'react'
import ChatApp from "./ChatApp.js"

const socket = io.connect("http://localhost:4000")

const Messages = () => {
  
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (from !== "" && to !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }

  return (
    <div className="main-thing">
      { showChat ?? <ChatApp socket={socket} from={from} room={room} /> }
    </div>
  )
}

export default Messages;