import React from "react";
import Editor from "./editor";
import HomePage from "./components/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import UserHome from "./components/userhome";
import Session from "./components/session";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <div style={{ display: "flex" }}>
              <div style={{ width: "75%" }}>
                <HomePage />
              </div>
              <div>
                <Login />
              </div>
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
            render={(props) => <UserHome {...props} />}
          />
          {/* <div> */}
          {/* <UserHome /> */}
          {/* </div> */}
          {/* </Route> */}
          <Route exact path="/session">
            <div>
              <Session />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
