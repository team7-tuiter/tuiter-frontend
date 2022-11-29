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

  const send = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: `${from} -- ${to}`,
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

  const messages = messageList.map( (message) => {
    return (
      <div>
        <p> {message.from} </p>
        <p> {message.to} </p>
        <p> {message.sentOn} </p>
        <p> {message.message} </p>
      </div>
    )
  })

  return (
    <div>
      { messages }
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
      <button onClick={send}></button>
    </div>
  )
}

export default Messages;