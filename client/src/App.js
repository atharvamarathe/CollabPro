import React from "react";
import Editor from "./editor";
import HomePage from "./components/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import UserHome from "./components/userhome";
import collab_img from "./components/image.png";
import BackGroundImg from "./background.png";

import Session from "./components/session";
function App() {
  let sessionName = "Coding Session";
  let filename = "code.js";
  function setSessionName(name) {
    sessionName = name;
  }
  function setFileName(fname) {
    filename = fname;
  }
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <div
              style={{
                backgroundImage: `url(${BackGroundImg})`,
                height: "100vh",
              }}
            >
              <HomePage />
            </div>
          </Route>
          <Route exact path="/editor">
            <div style={{ width: "100%", fontSize: "15px" }}>
              <div style={{ paddingLeft: "30px" }}>
                <Editor />
              </div>
            </div>
          </Route>
          <Route
            exact
            path="/userhome/:userid/:username"
            render={(props) => (
              <UserHome
                {...props}
                setsname={setSessionName}
                setfname={setFileName}
              />
            )}
          />
          <Route exact path="/session">
            <div>
              <Session sname={sessionName} fname={filename} />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
