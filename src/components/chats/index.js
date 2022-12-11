/**
 * @file implements Chat component
 */
import { useEffect, useRef, useState, useCallback } from "react"
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

const orderUserIds = (uid1, uid2) => {
  // userId order is made by string comparison 
  const { userId1, userId2 } = uid1 > uid2 ?
    { userId1: uid1, userId2: uid2 } :
    { userId1: uid2, userId2: uid1 }
  return { userId1, userId2 }
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
  const messages = useSelector((state) => state.messages.messages)
  const [isClicked, setIsClicked] = useState(false)
  const [time, setTime] = useState(Date.now());


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

  /**
  * Find if the user already has an existing conversation with selectedUser
  * @param user selectedUser
  */
  const hasExistingChat = useCallback((selectedUser) => {
    return chats.some(chat => chat?.userId1?.username === selectedUser?.username || chat?.userId2?.username === selectedUser?.username)
  }, [chats])

  /**
   * Called when user changes (usually when page first renders)
   */
  useEffect(() => {
    if (user && user._id) {
      dispatch(getLastMessagesFromAllChats(user._id))
    }
    updateDimens();
    window.addEventListener('resize', updateDimens);
    return () => window.removeEventListener('resize', updateDimens);
  }, [dispatch, user])


  /**
   * Called when selectedUser, user or isClicked change
   */
  useEffect(() => {
    if (!user || !selectedUser || !user._id || !selectedUser._id) return
    const loggedUserId = user._id
    const selectedUserId = selectedUser._id
    // order user ids
    const { userId1, userId2 } = orderUserIds(loggedUserId, selectedUserId)
    // if the user already has an existing conversation with the selected user
    if (hasExistingChat(selectedUser)) {
      // populate the chat with messages
      dispatch(getAllMessagesInSingleChat({ userId1, userId2 }))
      // create a new chat 
    } else {
      // create an empty chat
      const chatObj = {
        userId1,
        userId2,
        messages: {
          id: uuid().slice(0, 8),
          from: loggedUserId,
          to: selectedUserId,
          type: "STRING",
          message: "",
          sentOn: Date.now()
        }
      }
      dispatch(createChat(chatObj))
    }
    const room = `${userId1} -- ${userId2}`
    SocketFactory.getConnection().emit("join_room", room)
    dispatch(joinRoom(room))
  }, [selectedUser, dispatch, hasExistingChat, user, isClicked])

  // sets the selected user in state 
  const handleChange = (selectedUser) => {
    setSelectedUser(selectedUser)
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

  // console.log("chats", chats)
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
                          onChange={(value) => handleChange(value[0])}
                          isLoading={loading}
                          onSearch={lookForUser}
                          placeholder="Search user ..."
                          options={userList}
                          labelKey={option => `${option.username}`}
                          minLength={1}
                        />
                        <button className="btn btn-primary" type="button" id="button-addon1" onClick={() => handleChange(selectedUser)} >
                          <i className="fa fa-arrow-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ maxHeight: dimen.height, height: dimen.height, overflowY: "scroll" }}>
                  <ul className="list-group">
                    {!!chats.length && chats.map((chat, index) => {
                      const otherUser = [chat?.userId1, chat?.userId2].filter(userObj => userObj.username !== user.username)[0]
                      const lastChat = chat?.messages[chat?.messages.length - 1];
                      return (
                        <li className="list-group-item chat-hover" key={`chatid-${index}`} onClick={() => { handleChange(otherUser); setIsClicked(!isClicked) }}>
                          <p className="mb-2"><b>{otherUser.username}</b><small className="text-muted"> - {formatDate(lastChat?.sentOn)}</small></p>
                          {lastChat?.type === 'IMAGE' && (
                            <img src={lastChat.message} height="50" alt="sent image" />
                          )}
                          {lastChat?.type === 'VIDEO' && (
                            <video
                              src={lastChat?.message}
                              width="100"
                              height="70"
                              controls
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {lastChat?.type === 'STRING' && (
                            <p>{lastChat?.message}</p>
                          )}
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