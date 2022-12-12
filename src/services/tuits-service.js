import axios from "axios";
const BASE_URL = process.env.BASE_URL
const TUITS_API = `${BASE_URL}/tuits`;
const USERS_API = `${BASE_URL}/users`;

export const findAllTuits = () => 
  axios.get(TUITS_API)
  .then(response => response.data);

export const findTuitById = (tid) =>
  axios.get(`${TUITS_API}/${tid}`)
    .then(response => response.data);

export const findTuitByUser = (uid) =>
  axios.get(`${USERS_API}/${uid}/tuits`)
    .then(response => response.data);

export const createTuit = (tuit) =>
  axios.post(TUITS_API, tuit)
    .then(response => response.data);

export const updateTuit = (tid, tuit) =>
  axios.put(`${TUITS_API}/${tid}`, tuit)
    .then(response => response.data);

export const deleteTuit = (tid) =>
  axios.delete(`${TUITS_API}/${tid}`)
    .then(response => response.data);

export const deleteTuitByUserId = (uid) =>
  axios.delete(`${USERS_API}/${uid}/tuits`)
    .then(response => response.data);