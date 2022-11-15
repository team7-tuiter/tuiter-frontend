import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiSendMessage,
  apiDeleteMessage,
} from '../services/message-service'


// initial state
const initialState = {
  messages: [],
  status: 'idle',
  error: null
}

// sendMessage
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

// deleteMessage
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


// messageSlicer
export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  extraReducers: {
    // sendMessage
    [sendMessage.pending] : (state, action) => {
      state.status = 'loading'
    },
    [sendMessage.fulfilled] : (state, action) => {
      state.status = 'succeded'
      if (action.payload !== undefined) state.messages.push(action.payload)
    },
    [sendMessage.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [deleteMessage.pending] : (state, action) => {
      state.status = 'loading'
    },
    [deleteMessage.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.messages = state.messages.filter((message) => message._id !== action.payload._id)
    },
    [deleteMessage.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

// state selector
export const selectMessages = (state) => state.messages.messages
export const getMessagesStatus = (state) => state.messages.status
export const getMessagesError = (state) => state.messages.error


export default messageSlice.reducer


