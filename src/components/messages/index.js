import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { sendMessage, receiveMessage } from '../../redux/messageSlice'

const Messages = ({ socket, from, to }) => {

  const messageList = useSelector((state) => state.messages.messages)
  const dispatch = useDispatch()
  const [currentMessage, setCurrentMessage] = useState("")

  const send = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: `${from} -- ${to}`,
        message: currentMessage,
        time:
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
  }, []) 

  return (
    <div className="main">

    </div>
  )
}

export default Messages;