/**
 * @file implements chatSlice
 */
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
 * Async thunk calls the service function apiGetAllChatsById
 * @param payload contains the id of the user
 * @returns list of chat objects or a rejectWithValue oject
 */
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

/**
 * Async thunk calls the service function apiDeleteSingleChat
 * @param payload contains the from and to user ids 
 * @returns delete status or rejectWithValue object
 */
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


/**
 * Chat slice with reducers. 
 */
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

// reducer
export default chatSlice.reducer


