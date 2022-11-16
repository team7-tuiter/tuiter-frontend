import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetSingleChat,
  apiGetAllChatsById,
  apiDeleteSingleChat
} from '../services/chat-service'


// initial state
const initialState = {
  chats: [],
  status: 'idle',
  error: null
}

// getSingleChat
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

// getAllChatsById
export const getAllChatsById = createAsyncThunk(
  'chats/getAllChatsById', 
  async (payload, { rejectWithValue }) => {
    const { id } = payload
    try {
      const response = await apiGetAllChatsById(id)
      return response.data
    } catch(e) {
      if (!e.response) throw e
      return rejectWithValue(e.response.data)
    }
})

// deleteSingleChat
export const deleteSingleChat = createAsyncThunk(
  'chats/deleteSingleChat', 
  async (payload, { rejectWithValue }) => {
    const { from, to } = payload
    try {
      const response = await apiDeleteSingleChat(from, to)
      return response
    } catch(e) {
      if (!e.response) throw e
      return rejectWithValue(e.response.data)
    }
})


// chatSlicer
export const chatSlice = createSlice({
  name: 'chats',
  initialState,
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
    // getChatsById
    [getAllChatsById.pending] : (state, action) => {
      state.status = 'loading'
    },
    [getAllChatsById.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.chats = action.payload
    },
    [getAllChatsById.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [deleteSingleChat.pending] : (state, action) => {
      state.status = 'loading'
    },
    [deleteSingleChat.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.chats = state.chats.filter(
        (chat) => {
          return chat.from !== action.payload.from && chat.to !== action.payload.to
        })
    },
    [deleteSingleChat.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

// state selector
export const selectChat = (state) => state.chats.chats
export const getChatStatus = (state) => state.chats.status
export const getChatError = (state) => state.chats.error


export default chatSlice.reducer


