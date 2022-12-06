/**
 * An auth service that can be used to sign in,
 * register and sign out users from firebase.
 */
import axios from "axios";
import { getAuth, signInWithCredential, signInWithCustomToken } from "firebase/auth";

const BASE_URL = "http://localhost:4000";
const SIGNUP_API = `${BASE_URL}/auth/signup`;
const LOGIN_API = `${BASE_URL}/auth/login`;
const LOGINAS_API = `${BASE_URL}/auth/loginas`;

/**
 * Signs the user in with their username and password.
 * 
 * username and password are validated before the operation for
 * null and empty values. Respective errors will be thrown
 * if validation fails or login fails.
 * 
 * @type {Function}
 * @param {String} username: The username of the user.
 * @param {String} password: The password of the user.
 * @return {DBUser} User object on successful login else throws an error. 
 */
export const signInUsingUsername = async (username, password) => {
  if (!isValid(username)) {
    throw Error("Invalid username");
  }
  if (!isValid(password)) {
    throw Error("Invalid password");
  }
  try {
    await getAuth().signOut()
    const response = await axios.post(LOGIN_API, { username, password });
    const { credential, user } = response.data;
    await signInWithCredential(credential);
    return user;
  } catch (e) {
    throw e;
  }
}

/**
 * Registers the user with their username and password.
 * 
 * username and password are validated before the operation for
 * null and empty values. Respective errors will be thrown
 * if validation fails or login fails.
 * 
 * @type {Function}
 * @param {String} username: The username of the user.
 * @param {String} password: The password of the user.
 * @return {DBUser} User object on successful login else throws an error. 
 */
export const registerUsingUsername = async (username, password) => {
  if (!isValid(username)) {
    throw Error("Invalid username");
  }
  if (!isValid(password)) {
    throw Error("Invalid password");
  }
  try {
    const response = await axios.post(SIGNUP_API, { username, password });
    const { token, user } = response.data;
    await signInWithCustomToken(token);
    return user;
  } catch (e) {
    throw e;
  }
}


/**
 * Login based on the username only.
 * @param {*} username username of the user to login.
 * @returns The user object.
 */
export const loginAsUsername = async (username) => {
  if (!isValid(username)) {
    throw Error("Invalid username");
  }
  try {
    const response = await axios.post(LOGINAS_API, { username });
    const { credential, user } = response.data;
    await signInWithCredential(credential);
    return user;
  } catch (e) {
    throw e;
  }
}

/**
 * Gets the auth token for the currently logged in user.
 * 
 * @returns Promise that resolves to user auth token, null if user is not logged in.
 */
export const getIdToken = () => {
  if (getAuth().currentUser != null) {
    return getAuth().currentUser.getIdToken(true);
  } else {
    return null;
  }
}

/**
 * Validates whether the supplied argument is not null
 * and non empty. For checking non-empty it
 * trims the space at start or traling.
 * 
 * @type {Function}
 * @param {String} data: The data that needs to be validated.
 * @return {Boolean} True means valid else False
 */
export const isValid = (data) => {
  if (!data || data.trim().length === 0) {
    return false;
  }
  return true;
}