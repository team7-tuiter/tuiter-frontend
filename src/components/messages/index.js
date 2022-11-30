import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { sendMessage, receiveMessage } from '../../redux/messageSlice'
import { socket } from '../../socket'

const Messages = () => {

  const messageList = useSelector((state) => state.messages.messages)
  const dispatch = useDispatch()
  const [currentMessage, setCurrentMessage] = useState("")
  const from = useState("")
  const to = useState("")
  const room = useSelector((state) => state.room.room)

  const send = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room,
        message: currentMessage,
        sentOn:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      }
      dispatch( sendMessage(messageData) )
      setCurrentMessage("")
    }
  }

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      dispatch( receiveMessage(data) )
    })
  }, [dispatch]) 

  return (
    <div>
      <h1>
        Messages
      </h1>
      
      { messageList?.message }

      <i className="fa-solid fa-upload"></i>
      <input 
        type="text"
        value={currentMessage}
        placeholder="type..."
        onChange={(event) => {
          setCurrentMessage(event.target.value)
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && send()
        }}/> 
      <button onClick={send}> Send Message </button>
    </div>
  )
}

export default Messages;