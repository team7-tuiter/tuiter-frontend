import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as service from "../../services/users-service";
import { registerUsingUsername, signInUsingUsername } from '../../services/auth-service';
import React from "react";
import { UserList } from "./user-list";
import { useSelector, useDispatch } from 'react-redux'
import { signup, signin } from "../../redux/userSlice"



export const Login = () => {
  const [existingUsers, setExistingUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

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
      let userCredential = await registerUsingUsername(newUser._username, newUser._password);
      const user = {
        _id: userCredential.uid, 
        username: newUser._username
      }
      dispatch( signup(user) )
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
      let userCredential = await signInUsingUsername(loginUser._username, loginUser._password);
      dispatch( signin(userCredential.uid) )
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
          setNewUser({ ...newUser, _username: e.target.value })}
        placeholder="username" />
      <input className="mb-2 form-control"
        onChange={(e) =>
          setNewUser({ ...newUser, _password: e.target.value })}
        placeholder="password" type="password" />
      <button onClick={register} className="btn btn-primary mb-5">Register
      </button>

      <h1>Login</h1>
      <input className="mb-2 form-control"
        onChange={(e) =>
          setLoginUser({ ...loginUser, _username: e.target.value })}
        placeholder="username" />
      <input className="mb-2 form-control"
        onChange={(e) =>
          setLoginUser({ ...loginUser, _password: e.target.value })}
        placeholder="password" type="password" />
      <button onClick={signIn} className="btn btn-primary mb-5">Login</button>

      <h1>Login As</h1>

      <UserList users={existingUsers} deleteUser={deleteUser} />

    </div>
  );
};