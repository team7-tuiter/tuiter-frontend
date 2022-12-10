/**
 * @file implements Messages Component
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, receiveMessage } from "../../redux/messageSlice";
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

  const send = async () => {
    if (!room) return 
    const [userId1, userId2] = room.split(" -- ")
    const to = [userId1, userId2].filter(uid => uid !== user._id);
    const payload = {
      room,
      userId1,
      userId2,
      messages: {
        id: uuid().slice(0,8),
        from: user._id,
        to: to[0],
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
    else if (message) {
      dispatch(sendMessage(payload))
      setMessage("")
    }
  }

  useEffect(() => {
    SocketFactory.getConnection().on("receive_message", (data) => {
      dispatch(receiveMessage(data));
    })
  }, [dispatch])

  console.log("messageList", messageList)
  return (
    <div>
      <h4>Messages {user?.username} </h4>

      <span>
        <label for="fileInput">
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
        return (
          <div>
          <li> {message.message} </li>
        </div>
        )
      })}
    </div>
  )
}

export default Messages
