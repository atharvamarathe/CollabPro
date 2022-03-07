import React from "react";
import Editor from "./editor";
import HomePage from "./components/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/editor">
            <div style={{ width: "100%", fontSize: "15px" }}>
              <div style={{ paddingLeft: "30px" }}>
                <Editor />
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
