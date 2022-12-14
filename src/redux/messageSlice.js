/**
 * @file implements messageSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiSendMessage,
  apiDeleteMessage
} from '../services/message-service'

import { apiGetAllMessagesInSingleChat } from '../services/message-service'

// initial state
const initialState = {
  messages: [],
  status: 'idle',
  error: null
}

/**
 * Async thunk calls the service function apiGetAllMessagesInSingleChat
 * @param payload contains the from and to user ids 
 * @returns chat object or a rejectWithValue oject
 */
 export const getAllMessagesInSingleChat = createAsyncThunk(
  'messages/getAllMessagesInSingleChat', 
  async (payload, { rejectWithValue }) => {
    const { userId1, userId2 } = payload
    try {
      const response = await apiGetAllMessagesInSingleChat(userId1, userId2)
      return response[0].messages
    } catch(e) {
      if (!e.response) throw e
      return rejectWithValue(e.response.data)
    }
})

/**
 * Async thunk calls the service function apiSendMessage
 * @param payload contains the from and to user ids, as well as the message object
 * @returns message object or a rejectWithValue oject
 */
export const sendMessage = createAsyncThunk(
  'messages/sendMessage', 
  async (payload, { rejectWithValue }) => {
    try {
      await apiSendMessage(payload)
      return payload.messages
    } catch(e) {
      if (!e.response) throw e
      return rejectWithValue(e.response.data)
    }
})

/**
 * Async thunk calls the service function apiDeleteMessage
 * @param payload contains the from and to user ids 
 * @returns delete status or rejectWithValue object
 */
export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage', 
  async (payload, { rejectWithValue }) => {
    const { from, to } = payload
    try {
      const response = await apiDeleteMessage(from, to)
      return response
    } catch(e) {
      if (!e.response) throw e
      return rejectWithValue(e.response.data)
    }
})



/**
 * Message slice with reducers. 
 */
export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    receiveMessage: (state, action) => {
      state.messages.push(action.payload?.messages)
    }
  },
  extraReducers: {
    // getAllMessagesInSingleChat
    [getAllMessagesInSingleChat.pending] : (state, action) => {
      state.status = 'loading'
    },
    [getAllMessagesInSingleChat.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.messages = action.payload
    },
    [getAllMessagesInSingleChat.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // sendMessage
    [sendMessage.pending] : (state, action) => {
      state.status = 'loading'
    },
    [sendMessage.fulfilled] : (state, action) => {
      state.status = 'succeded'
      if (action.payload) state.messages.push(action.payload)
    },
    [sendMessage.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // deleteMessage
    [deleteMessage.pending] : (state, action) => {
      state.status = 'loading'
    },
    [deleteMessage.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.messages = state.messages.filter((message) => message._id !== action.payload)
    },
    [deleteMessage.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
})

//action selector
export const { receiveMessage } = messageSlice.actions

// state selector
export const selectMessages = (state) => state.messages.messages
export const getMessagesStatus = (state) => state.messages.status
export const getMessagesError = (state) => state.messages.error

// reducer
export default messageSlice.reducer


