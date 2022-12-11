/**
 * Implements store
 */

import { configureStore } from '@reduxjs/toolkit'
import chatReducer from "./chatSlice"
import messageReducer from "./messageSlice"
import userReducer from "./userSlice"
import roomReducer from "./roomSlice"

// redux store aggregates all reducers into one
export const store = configureStore({
  reducer: {
    chats: chatReducer,
    messages: messageReducer,
    user: userReducer,
    room: roomReducer
  }
})