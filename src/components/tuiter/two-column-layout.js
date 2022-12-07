import React from "react";
import WhatsHappening from "../whats-happening";
import { Routes, Route } from "react-router-dom";
import Home from "../home";
import Bookmarks from "../bookmarks";
import Profile from "../profile";
import './tuiter.css'
import EditProfile from "../profile/edit-profile";
import Explore from "../explore";
import Notifications from "../notifications";
import Lists from "../lists";
import More from "../more";
import { Login } from "../profile/login";
import Movies from "../movies";
import MovieDetails from "../movies/details";

const TwoColumnLayout = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/tuiter" element={<Home />} />
            <Route exact path="/tuiter/:uid" element={<Home />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/explore" element={<Explore />} />
            <Route exact path="/notifications" element={<Notifications />} />
            <Route exact path="/bookmarks" element={<Bookmarks />} />
            <Route exact path="/lists" element={<Lists />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/edit" element={<EditProfile />} />
            <Route exact path="/movies" element={<Movies />} />
            <Route exact path="/movies/:imdbID" element={<MovieDetails />} />
            <Route exact path="/more" element={<More />} />
          </Routes>
        </div>
        <div className="col-lg-4">
          <WhatsHappening />
        </div>
      </div>
    </div>
  );
}

export default TwoColumnLayout;