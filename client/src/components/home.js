import React, { Component } from "react";
import "./home.css";
import BackGroundImg from "../background.png";
import EditorImg from "./editor.png";
import collab_img from "./image.png";
import GoogleIcon from "@mui/icons-material/Google";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
class HomePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <div
          style={{
            float: "right",
            margin: "20px",
            fontSize: "30px",
            display: "flex",
          }}
        >
          <div
            style={{ fontSize: "20px", color: "white", marginRight: "10px" }}
          >
            Sign in
          </div>
          <a href="http://localhost:5000/auth/google">
            <GoogleIcon color="primary" fontSize="inherit" />
          </a>
        </div>
        <div id="heading">
          <center>Collab-Pro</center>
        </div>
        <div id="sub-title">
          <center>
            <div style={{ margin: "30px" }}>
              <i>Collaborate, Code, Create</i>
            </div>
          </center>
        </div>
        <center>
          <div style={{ margin: "30px" }}>
            <img src={collab_img} />
          </div>
        </center>

        <div
          style={{
            marginTop: "40px",
            color: "white",
            margin: "30px",
            borderRadius: "20px",
          }}
        >
          <center>
            The All-in-one Code Editor you need for Collaborative Projects !
          </center>
          <div style={{ marginTop: "10px" }}>
            <center>
              <Button
                color="error"
                style={{ fontSize: "20px" }}
                variant="contained"
                href="http://localhost:5000/auth/google"
              >
                Get Started
              </Button>
            </center>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
