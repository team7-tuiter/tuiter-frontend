import React from "react";
import Navigation from "../navigation";
import WhatsHappening from "../whats-happening";
import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "../home";
import Bookmarks from "../bookmarks";
import Profile from "../profile";
import './tuiter.css'
import EditProfile from "../profile/edit-profile";
import Explore from "../explore";
import Notifications from "../notifications";
import Lists from "../lists";
import More from "../more";
import {Login} from "../profile/login";
import Movies from "../movies";
import MovieDetails from "../movies/details";
import Messages from "../messages";
import Chats from "../chats"

function Tuiter () {
  return(
    <HashRouter>
      <div className="container">
        <div className="ttr-tuiter">
          <div className="ttr-left-column">
            <Navigation/>
          </div>
          <div className="ttr-center-column">
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route exact path="/login" element={<Login/>}/>
              <Route exact path="/tuiter" element={<Home/>}/>
              <Route exact path="/tuiter/:uid" element={<Home/>}/>
              <Route exact path="/home" element={<Home/>}/>
              <Route exact path="/home/:uid" element={<Home/>}/>
              <Route exact path="/explore" element={<Explore/>}/>
              <Route exact path="/notifications" element={<Notifications/>}/>
              <Route exact path="/messages" element={<Messages/>}/>
              <Route exact path="/bookmarks" element={<Bookmarks/>}/>
              <Route exact path="/lists" element={<Lists/>}/>
              <Route exact path="/profile" element={<Profile/>}/>
              <Route exact path="/profile/edit" element={<EditProfile/>}/>
              <Route exact path="/movies" element={<Movies/>}/>
              <Route exact path="/movies/:imdbID" element={<MovieDetails/>}/>
              <Route exact path="/more" element={<More/>}/>
              <Route exact path="/chats" element={<Chats/>}/>
            </Routes> 
          </div>
          <div className="ttr-right-column">
            <WhatsHappening/>
          </div>
        </div>
      </div>
    </HashRouter>
  );
}
export default Tuiter;