/**
 * An auth service that can be used to sign in,
 * register and sign out users from firebase.
 */
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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
 * @return {FirebaseUser} on successful login else throws an error. 
 */
export const signInUsingUsername = async (username, password) => {
  if (!isValid(username)) {
    throw Error("Invalid username");
  }
  if (!isValid(password)) {
    throw Error("Invalid password");
  }
  try {
    // Try to login using firebase, and get user credential upon success
    const userCredential = await signInWithEmailAndPassword(getAuth(),
      `${username}@tuiter.com`, password);
    return userCredential.user;
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
 * @return {FirebaseUser} on successful login else throws an error. 
 */
export const registerUsingUsername = async (username, password) => {
  if (!isValid(username)) {
    throw Error("Invalid username");
  }
  if (!isValid(password)) {
    throw Error("Invalid password");
  }
  try {
    // Try to login using firebase, and get user credential upon success
    const userCredential = await createUserWithEmailAndPassword(getAuth(),
      `${username}@tuiter.com`, password);
    return userCredential.user;
  } catch (e) {
    throw e;
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
  if (!data || data.trim().length == 0) {
    return false;
  }
  return true;
}