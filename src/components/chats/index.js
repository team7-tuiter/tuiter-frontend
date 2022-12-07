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

  const navigate = useNavigate()
  const dispatch = useDispatch()
  //const chats = useSelector((state) => state.chats.chats)
  const user = useSelector((state) => state.user.user)
  const [showInput, setShowInput] = useState(false)
  const [inputUser, setInputUser] = useState("")

  const chats = [

    {

      from: { username: "javier" },

      sentOn: Date.now(),

      lastMessage: "Hello from Javier"

    },

    {

      from: { username: "Saket" },

      sentOn: Date.now(),

      lastMessage: "Hello from Saket"

    },

    {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    },
    {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    }, {

      from: { username: "Ignacio" },

      sentOn: Date.now(),

      lastMessage: "Hello from Ignacio"

    },

    {

      from: { username: "Kaushik" },

      sentOn: Date.now(),

      lastMessage: "Hello from Kaushik"

    },
  ]

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllChatsById(user._id))
    }
  }, [dispatch, user])


  const goToNewConversation = (otherUsername) => {
    const loggedUsername = user.username;
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

  const goToExistingConversation = (otherUserId) => {

  }

  const formatDate = (sentOn) => {
    const postedOn = new Date(sentOn);
    const formattedDate = `${postedOn.getFullYear()}/${postedOn.getMonth()}/${postedOn.getDay()}`;
    return formattedDate;
  }

  return (
    <div>
      {
        !!user && (
          <div className="container p-0">
            <div className="row">
              <div className="col-5">
                <div className="d-flex flex-row">
                  <div className="flex-fill">
                    <h4>Chats (Hello, {user.username})</h4>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-primary rounded-pill" onClick={() => setShowInput(true)}><i class="fa-solid fa-message-plus"></i> New Message </button>
                  </div>
                </div>
                {showInput && (
                  <div class="input-group mt-3">
                    <input type="text" class="form-control" placeholder="Search user ..." onChange={(e) =>
                      setInputUser(e.target.value)} />
                    <button class="btn btn-primary" type="button" id="button-addon1" onClick={() => goToNewConversation(inputUser)} >
                      <i className="fa fa-arrow-right"></i>
                    </button>
                  </div>
                )}
                <ul class="list-group mt-3">
                  {chats.map((chat, index) => {
                    return (
                      <li class="list-group-item chat-hover" key={`chatid-${index}`} onClick={() => goToExistingConversation(chat.from._id)}>
                        <p className="m-0"><b>{chat.from.username}</b><small className="text-muted"> - {formatDate(chat.sentOn)}</small></p>
                        <p>{chat.lastMessage}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="col-7">
                here will go the message component
              </div>
            </div>
          </div>
        )
      }
      {
        !user && (
          <>
            <h3>You need to login first.</h3>
          </>
        )
      }
    </div>
  )
}

export default Chats