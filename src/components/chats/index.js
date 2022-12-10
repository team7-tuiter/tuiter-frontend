/**
 * @file implements Chat component
 */
import { useEffect, useRef, useState } from "react"
import React from 'react'
import { getAllMessagesInSingleChat } from "../../redux/messageSlice"
import { getLastMessagesFromAllChats } from "../../redux/chatSlice"
import { createChat } from "../../redux/chatSlice"
import { useSelector, useDispatch } from 'react-redux'
import SocketFactory from '../../socket'
import { joinRoom } from "../../redux/roomSlice"
import { AsyncTypeahead } from "react-bootstrap-typeahead"
import { searchUser } from "../../services/users-service"
import Messages from "../messages"
import uuid from 'react-uuid';

const getDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

const Chats = () => {

  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chats.chats)
  const user = useSelector((state) => state.user.user)
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [userList, setUserList] = useState([])
  const [dimen, setDimen] = useState(getDimensions());
  const inputwrap = useRef();

  const updateDimens = () => {
    let dimensions = getDimensions();
    if (inputwrap.current) {
      const height = inputwrap.current.offsetHeight;
      dimensions = {
        height: dimensions.height - height - 25, //-25 is buffer
        width: dimensions.width,
      }
    }
    setDimen(dimensions);
  }

  useEffect(() => {
    if (user && user._id) {
      dispatch(getLastMessagesFromAllChats(user._id))
    }
    updateDimens();
    window.addEventListener('resize', updateDimens);
    return () => window.removeEventListener('resize', updateDimens);
  }, [dispatch, user])


  useEffect(() => {
    if (!user || !selectedUser) return
    const loggedUserId = user._id
    const selectedUserId = selectedUser._id
    // userId order is made by string comparison 
    const { userId1, userId2 } = loggedUserId > selectedUserId ? 
      { userId1: loggedUserId, userId2: selectedUserId } : 
      { userId1: selectedUserId, userId2: loggedUserId }

    // if the user already has an existing conversation with the selected user
    if (hasExistingChat()) {
      // populate the chat with messages
      dispatch(getAllMessagesInSingleChat(userId1, userId2))
      // create a new chat 
    } else {
      const chatObj = {
        userId1,
        userId2,
        messages: {
          id: uuid().slice(0,8),
          from: loggedUserId,
          to: selectedUserId,
          type : "STRING",
          message: "",
          sentOn: Date.now()
        }
      }
      dispatch(createChat(chatObj))
    }
    const room = `${userId1} -- ${userId2}`
    SocketFactory.getConnection().emit("join_room", room)
    dispatch(joinRoom(room))
  }, [selectedUser])

  // sets the selected user in state 
  const goToConversation = (selectedUser) => {
    console.log("selectedUser", selectedUser)
    if (!Array.isArray(selectedUser)) return
    setSelectedUser(selectedUser[0])
  }

  /**
   * Find if the user already has an existing conversation with selectedUser
   * @param user selectedUser
   */
  const hasExistingChat = () => {
    chats.map((chat) => {
      if (chat?.from?._id === selectedUser?._id) return true
    })
    return false
  }


  const makeInputVisible = () => {
    setShowInput(true);
    setTimeout(() => {
      updateDimens();
    }, 1);
  }

  /**
   * Searches for the user in the backend.
   * @param {*} inputValue The input value from typeahead 
   */
  const lookForUser = (inputValue) => {
    if (inputValue) {
      setLoading(true)
      searchUser(inputValue).then(results => {
        const users = results.filter((u) => u._id !== user._id)
        setUserList(users)
        setLoading(false)
      })
    }
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
                <div ref={inputwrap}>
                  <div className="mb-3">
                    <div className="d-flex flex-row">
                      <div className="flex-fill">
                        <h4 className="m-0">Chats (Hello, {user.username})</h4>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-primary rounded-pill" onClick={makeInputVisible}><i className="fa-solid fa-message-plus"></i> New Message </button>
                      </div>
                    </div>
                    {showInput && (
                      <div className="input-group mt-3">
                        <AsyncTypeahead
                          id="search-user-typeahead"
                          onChange={goToConversation}
                          isLoading={loading}
                          onSearch={lookForUser}
                          placeholder="Search user ..."
                          options={userList}
                          labelKey={option => `${option.username}`}
                          minLength={1}
                        />
                        <button className="btn btn-primary" type="button" id="button-addon1" onClick={() => goToConversation(selectedUser)} >
                          <i className="fa fa-arrow-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ maxHeight: dimen.height, height: dimen.height, overflowY: "scroll" }}>
                  <ul className="list-group">
                    {!!chats.length && chats.map((chat, index) => {
                      const otherUsername = [chat?.userId1?.username, chat?.userId2?.username].filter(uname => uname !== user.username)
                      return (
                        <li className="list-group-item chat-hover" key={`chatid-${index}`} onClick={() => goToConversation(chat?.messages[0]?.from?._id)}>
                          <p className="m-0"><b>{otherUsername}</b><small className="text-muted"> - {formatDate(chat?.messages[0]?.sentOn)}</small></p>
                          <p>{chat?.messages[0]?.message}</p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className="col-7">
                {selectedUser && (
                  <Messages />
                )}
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