/**
 * @file implements messageSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiSendMessage,
  apiDeleteMessage,
  apiGetSingleChat
} from '../services/message-service'


// initial state
const initialState = {
  messages: [],
  status: 'idle',
  error: null
}

/**
 * Async thunk calls the service function apiGetSingleChat
 * @param payload contains the from and to user ids 
 * @returns chat object or a rejectWithValue oject
 */
 export const getSingleChat = createAsyncThunk(
  'chats/getSingleChat', 
  async (payload, { rejectWithValue }) => {
    const { from, to } = payload
    try {
      const response = await apiGetSingleChat(from, to)
      return response.data[0]
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
  'chats/sendMessage', 
  async (payload, { rejectWithValue }) => {
    const { from, to, message } = payload
    try {
      const response = await apiSendMessage(from, to, message)
      return response.data
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
  'chats/deleteMessage', 
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
      state.messages.push(action.payload)
    }
  },
  extraReducers: {
    // getSingleChat
    [getSingleChat.pending] : (state, action) => {
      state.status = 'loading'
    },
    [getSingleChat.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.chats = action.payload
    },
    [getSingleChat.rejected] : (state, action) => {
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
    }
  }
})

// action selector
export const { receiveMessage } = messageSlice.actions

// state selector
export const selectMessages = (state) => state.messages.messages
export const getMessagesStatus = (state) => state.messages.status
export const getMessagesError = (state) => state.messages.error

// reducer
export default messageSlice.reducer


