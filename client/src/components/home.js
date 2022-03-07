import React, { Component } from "react";
import "./home.css";
import BackGroundImg from "../background.png";
import EditorImg from "./editor.png";
import collab_img from "./image.png";
class HomePage extends Component {
  state = {};
  render() {
    return (
      <div
        style={{ backgroundImage: `url(${BackGroundImg})`, height: "100vh" }}
      >
        <div id="heading">
          <center>Collab-Pro</center>
        </div>
        <div id="sub-title">
          <center>
            <i>Collaborate, Code, Create</i>
          </center>
        </div>
        <center>
          <div
            style={{
              backgroundImage: `url(${collab_img})`,
              height: "400px",
              width: "700px",
              marginTop: "30px",
            }}
          ></div>
        </center>

        <div style={{ marginTop: "40px" }}>
          <center>
            <a href="/editor">
              <button style={{ fontSize: "20px" }}>New Editor </button>
            </a>
          </center>
        </div>
      </div>
    );
  }
}

export default HomePage;
