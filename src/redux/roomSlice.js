/**
 * @file implements roomSlice for socket connection
 */
 import { createSlice } from '@reduxjs/toolkit'
 
 // initial state
 const initialState = {
   room: ""
 }
 
 /**
  * Room slice with reducer. 
  */
 export const roomSlice = createSlice({
   name: 'room',
   initialState,
   reducers: {
     joinRoom: (state, action) => {
       state.room = action.payload
     }
   }
 })
 
 // action selector
 export const { joinRoom } = roomSlice.actions
 
 // state selector
 export const selectRoom = (state) => state.room.room
 
 // reducer
 export default roomSlice.reducer
 
 
 