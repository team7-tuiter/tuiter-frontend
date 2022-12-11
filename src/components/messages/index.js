/**
 * @file implements Messages Component
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, receiveMessage } from "../../redux/messageSlice";
import { getLastMessagesFromAllChats } from "../../redux/chatSlice"
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SocketFactory from "../../socket";
import uuid from 'react-uuid';


const Messages = () => {
  const messageList = useSelector((state) => state.messages.messages)
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const room = useSelector((state) => state.room.room)
  const [file, setFile] = useState(null)
  const user = useSelector((state) => state.user.user)
  const chats = useSelector((state) => state.chats.chats)

  const send = async () => {
    if (!room) return 
    const [userId1, userId2] = room.split(" -- ")
    const to = [userId1, userId2].filter(uid => uid !== user._id)[0]
    const payload = {
      room,
      userId1,
      userId2,
      messages: {
        id: uuid().slice(0,8),
        from: user._id,
        to: to,
        type : "STRING",
        message,
        sentOn: Date.now()
      }
    }
    if (file) {
      const fileref = ref(storage, `static/${Date.now()}`)
      uploadBytes(fileref, file).then((res) => {
        getDownloadURL(res.ref).then((url) => {
          payload.messages.message = url
          payload.messages.type = "IMAGE"
          dispatch(sendMessage(payload));
          setFile(null);
        })
      })
    }
    if (message) {
      dispatch(sendMessage(payload))
      setMessage("")
    }
    if (messageList.length === 1) {
      dispatch(getLastMessagesFromAllChats(user._id))
    }
  }

  useEffect(() => {
    SocketFactory.getConnection().on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    })
  }, [dispatch])

  return (
    <div>
      <h4>Messages {user?.username} </h4>

      <span>
        <label htmlFor="fileInput">
          <i className="fa-solid fa-upload"></i>
        </label>
        <input
          type="file"
          onChange={(event) => {
            setFile(event.target.files[0]);
          }}
        />
      </span>

      <input
        type="text"
        value={message}
        placeholder="type..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && send();
        }}
      />
      <button onClick={send}> Send Message </button>

      {messageList.map((message, i) => {
        if (i === 0) return
        const isMe = message.from === user._id
        if (isMe) {
          return (
            <div key={i.toString()} className="text-primary float-right">
            <p> {message.message} {message.sentOn} </p>
          </div>
          )
        }
        return (
          <div key={i.toString()} className="text-secondary float-left">
            <p> {message.message} {message.sentOn} </p>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
