/**
 * @file implements userSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signInUsingUsername, registerUsingUsername, loginAsUsername } from '../services/auth-service'
import SocketFactory from "../socket";


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
      const { username, password } = payload;
      const userObj = await registerUsingUsername(username, password);
      SocketFactory.init();
      return userObj;
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
      const { username, password } = payload;
      const userObj = await signInUsingUsername(username, password);
      SocketFactory.init();
      return userObj;
    } catch (e) {
      if (!e.response) throw e
      return rejectWithValue(e.response)
    }
  });


/**
* Aysn calls for logging user as some one else.
* @param payload contains the target username 
* @returns user object or a rejectWithValue oject
*/
export const loginAs = createAsyncThunk(
  'user/loginAs',
  async (payload, { rejectWithValue }) => {
    try {
      const { username } = payload;
      const userObj = await loginAsUsername(username);
      SocketFactory.init();
      console.log(userObj);
      return userObj;
    } catch (e) {
      if (!e.response) throw e
      return rejectWithValue(e.response)
    }
  });

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


