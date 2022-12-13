import axios from "axios";
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL

const LOGIN_API = `${REACT_APP_BASE_URL}/login`;
const USERS_API = `${REACT_APP_BASE_URL}/users`;

export const createUser = (user) =>
  axios.post(`${USERS_API}`, user)
    .then(response => response.data);

export const findAllUsers = async () => {
  const users = await axios.get(USERS_API)
  return users.data
}

export const findUserById = (uid) =>
  axios.get(`${USERS_API}/${uid}`)
    .then(response => response.data);

export const deleteUser = (uid) =>
  axios.delete(`${USERS_API}/${uid}`)
    .then(response => response.data);

export const deleteUsersByUsername = (username) =>
  axios.delete(`${USERS_API}/username/${username}/delete`)
    .then(response => response.data);

export const findUserByCredentials = (credentials) =>
  axios.post(`${LOGIN_API}`, credentials)
    .then(response => response.data);

export const searchUser = (query) =>
  axios.get(`${USERS_API}/search/${query}`)
    .then(response => response.data);

const service = {
  findAllUsers
}

export default service;