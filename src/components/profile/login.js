import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as service from "../../services/users-service";
import React from "react";
import { UserList } from "./user-list";
import { useDispatch } from 'react-redux'
import { signup, signin } from "../../redux/userSlice"

export const Login = () => {
  const [existingUsers, setExistingUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const deleteUser = (uid) =>
    service.deleteUser(uid)
      .then(findAllUsers)
  const findAllUsers = () =>
    service.findAllUsers()
      .then(users => {
        setExistingUsers(users)
      })

  /**
   * Registers the user in the firebase.
   */
  const register = async () => {
    try {
      dispatch(signup(newUser));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  /**
   * Logs in the user in the firebase.
   */
  const signIn = async () => {
    try {
      dispatch(signin(loginUser));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  useEffect(findAllUsers, []);

  return (
    <div>
      <h1>Register</h1>
      <input className="mb-2 form-control"
        onChange={(e) =>
          setNewUser({ ...newUser, username: e.target.value })}
        placeholder="username" />
      <input className="mb-2 form-control"
        onChange={(e) =>
          setNewUser({ ...newUser, password: e.target.value })}
        placeholder="password" type="password" />
      <button onClick={register} className="btn btn-primary mb-5">Register
      </button>

      <h1>Login</h1>
      <input className="mb-2 form-control"
        onChange={(e) =>
          setLoginUser({ ...loginUser, username: e.target.value })}
        placeholder="username" />
      <input className="mb-2 form-control"
        onChange={(e) =>
          setLoginUser({ ...loginUser, password: e.target.value })}
        placeholder="password" type="password" />
      <button onClick={signIn} className="btn btn-primary mb-5">Login</button>

      <h1>Login As</h1>

      <UserList users={existingUsers} deleteUser={deleteUser} />

    </div>
  );
};