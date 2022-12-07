import React, { useEffect } from "react";
import './styles.css';
import Tuiter from "./components/tuiter";
import { useDispatch } from "react-redux";
import { getFirbaseUser } from "./services/auth-service";
import SocketFactory from "./socket";
import { signin } from "./redux/userSlice";
import { getAuth } from "firebase/auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    //Check if user is logged in, if it is then save the user data in the store.
    getAuth().onAuthStateChanged(fUser => {
      if (fUser) {
        dispatch(signin(fUser.uid));
        SocketFactory.init();
      }
    });
  }, []);

  return (
    <Tuiter />
  );
}

export default App;
