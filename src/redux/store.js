import { configureStore } from '@reduxjs/toolkit'
import chatReducer from "./chatSlice"
import messageReducer from "./chatSlice"


export const store = configureStore({
  reducer: {
    chats: chatReducer,
    messages: messageReducer
  }
})