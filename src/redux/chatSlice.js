/**
 * @file implements chatSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetAllChatsById,
  apiDeleteSingleChat,
  apiCreateChat,
  apiGetAllMessagesFromAllChats
} from '../services/chat-service'


// initial state
const initialState = {
  chats: [],
  status: 'idle',
  error: null
}

/**
 * Async thunk calls the service function apiGetAllChatsById
 * @param payload contains the id of the user
 * @returns list of chat objects or a rejectWithValue oject
 */
export const getAllChatsById = createAsyncThunk(
  'chats/getAllChatsById', 
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiGetAllChatsById(payload)
      return response
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
 * Async thunc calls the service function apiCreateChat 
 * @param payload contains the chat object 
 * @returns chat object 
 */
export const createChat = createAsyncThunk(
'chats/createChat', 
async (payload, { rejectWithValue }) => {
  try {
    const response = await apiCreateChat(payload)
    return response
  } catch(e) {
    if (!e.response) throw e
    return rejectWithValue(e.response.data)
  }
})

/**
 * Async thunc calls the service function apiGetAllMessagesFromAllChats 
 * @param payload contains the user id  
 * @returns array of message objects
 */
export const getLastMessagesFromAllChats = createAsyncThunk(
  'chats/getLastMessagesFromAllChats', 
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiGetAllMessagesFromAllChats(payload)
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
    // getAllChatsById
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
    // deleteSingleChat
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
    },
    // createChat 
    [createChat.pending] : (state, action) => {
      state.status = 'loading'
    },
    [createChat.fulfilled] : (state, action) => {
      state.status = 'succeded'
      if (action.payload) state.chats.push(action.payload)
    },
    [createChat.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // getLastMessagesFromAllChats
    [getLastMessagesFromAllChats.pending] : (state, action) => {
      state.status = 'loading'
    },
    [getLastMessagesFromAllChats.fulfilled] : (state, action) => {
      state.status = 'succeded'
      state.chats = action.payload
    },
    [getLastMessagesFromAllChats.rejected] : (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
})

// state selector
export const selectChat = (state) => state.chats.chats
export const getChatStatus = (state) => state.chats.status
export const getChatError = (state) => state.chats.error

// reducer
export default chatSlice.reducer


