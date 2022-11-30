/**
 * Implements store
 */

import { configureStore } from '@reduxjs/toolkit'
import chatReducer from "./chatSlice"
import messageReducer from "./chatSlice"
import userReducer from "./userSlice"

// redux store aggregates all reducers into one
export const store = configureStore({
  reducer: {
    chats: chatReducer,
    messages: messageReducer,
    user: userReducer
  }
})