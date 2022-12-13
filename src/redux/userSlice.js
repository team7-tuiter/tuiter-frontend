/**
 * @file implements userSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createUser, findUserById } from '../services/users-service'


// initial state
const initialState = {
  user: null,
  status: 'idle',
  error: null
}

/**
 * Async thunk calls the service function createUser
 * @param payload contains the user object with _id and username
 * @returns user object or a rejectWithValue oject
 */
export const signup = createAsyncThunk(
  'user/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createUser(payload);
      return response;
    } catch (e) {
      if (!e.response) throw e
      return rejectWithValue(e.response)
    }
  })

/**
 * Async thunk calls the service function findUserById
 * @param payload contains the user id
 * @returns user object or a rejectWithValue oject
 */
export const signin = createAsyncThunk(
  'user/signin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await findUserById(payload);
      return response;
    } catch (e) {
      if (!e.response) throw e;
      return rejectWithValue(e.response);
    }
  })

/**
 * User slice with reducers. 
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    // signup
    [signup.pending]: (state, action) => {
      state.status = 'loading'
    },
    [signup.fulfilled]: (state, action) => {
      state.status = 'succeded'
      state.user = action.payload
    },
    [signup.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // signin
    [signin.pending]: (state, action) => {
      state.status = 'loading'
    },
    [signin.fulfilled]: (state, action) => {
      state.status = 'succeded'
      state.user = action.payload
    },
    [signin.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})


// state selector
export const selectUser = (state) => state.user.user
export const getUserStatus = (state) => state.user.status
export const getUserError = (state) => state.user.error

// reducer
export default userSlice.reducer