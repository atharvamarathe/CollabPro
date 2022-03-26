import React, { Component } from "react";
import "./login.css";
import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "./google.jpg";
import Button from "@mui/material/Button";
class Login extends Component {
  state = {};
  render() {
    return (
      <div id="login-window">
        <center>
          <h1>Login</h1>
        </center>
        <div id="email-id">
          <TextField
            id="outlined-basic"
            label="Email ID"
            variant="outlined"
            style={{ width: "100%" }}
          />
        </div>
        <div id="password">
          <TextField
            id="outlined-basic"
            label="Password"
            type="password"
            style={{ width: "100%" }}
          />
        </div>
        <div id="login">
          <a href="/userhome">
            <Button variant="contained" endIcon={<LoginIcon />}>
              Login
            </Button>
          </a>
          <form action="http://localhost:5000/auth/google">
            <button
              type="submit"
              className="google-button"
              style={{ borderRadius: "20px" }}
            >
              <img
                src={GoogleIcon}
                style={{ height: "60px", borderRadius: "20px" }}
              />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
