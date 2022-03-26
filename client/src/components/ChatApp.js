import React from "react";

import Chat from "./Chat/Chat";
// import Join from "./Join/Join";

import { BrowserRouter as Router, Route } from "react-router-dom";

const ChatApp = () => {
  return (
    <Router>
      {/* <Route path="/session" exact component={Join} /> */}
      <Route path="/session" component={Chat} />
    </Router>
  );
};

export default ChatApp;
