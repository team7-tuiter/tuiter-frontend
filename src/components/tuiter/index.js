import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './tuiter.css'
import TwoColumnLayout from "./two-column-layout";
import Messages from "../messages";
import Chats from "../chats"
import Navigation from "../navigation";

function Tuiter() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-md-1">
            <Navigation />
          </div>
          <div className="col-xl-9 col-md-11">
            <Routes>
              <Route path="/*" element={<TwoColumnLayout />} />
              <Route exact path="/messages" element={<Messages />} />
              <Route exact path="/chats" element={<Chats />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default Tuiter;