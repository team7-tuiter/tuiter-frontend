import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUsingUsername, signInUsingUsername } from '../../services/auth-service';
import React from "react";
import { useDispatch } from 'react-redux'
import { signup, signin } from "../../redux/userSlice"
import SocketFactory from "../../socket";

export const Login = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const dispatch = useDispatch()

  /**
   * Registers the user in the firebase.
   */
  const register = async () => {
    try {
      let userCredential = await registerUsingUsername(newUser.username, newUser.password);
      const user = {
        _id: userCredential.uid,
        username: newUser.username
      }
      dispatch(signup(user));
      await SocketFactory.init();
      navigate("/messages");
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
      const userCredential = await signInUsingUsername(loginUser.username, loginUser.password);
      dispatch(signin(userCredential.uid));
      await SocketFactory.init();
      navigate("/messages");
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

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
    </div>
  );
};