import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import "./userhome.css";
import { withRouter } from "react-router";
import SourceIcon from "@mui/icons-material/Source";
import SessionImg from "../icons/session.png";
import axios from "axios";

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.setState({ userId: this.props.match.params.userid });
    this.createSession = this.createSession.bind(this);
  }
  state = {
    existingSessions: [],
    displaysession: [],
  };
  componentDidMount() {
    this.getSessions();
    // this.DisplaySession();
  }
  DisplaySession = () => {
    console.log("SESSIONSSSS :", this.state.existingSessions);
    this.state.existingSessions.forEach((items, index) => {
      this.state.displaysession.push(
        <div>
          <img src={SessionImg} />
        </div>
      );
    });
  };
  randomString = (length, chars) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };
  createSession = () => {
    console.log("create session react", this);
    // !name || !sessionid ? e.preventDefault() : null;
    let obj = {
      user_id: this.props.match.params.userid,
      session_id: this.randomString(12, "0123456789"),
      role: "admin",
    };
    const sessionId = obj.session_id;
    console.log(obj);
    axios
      .post("http://localhost:5000/create_session", obj)
      .then((res) => {
        console.log("SUCCESS : ", res);
        window.location.href = `/session?name=${this.props.match.params.username}&sessionid=${sessionId}`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getSessions = () => {
    axios
      .post("http://localhost:5000/get_sessions", {
        user_id: this.props.match.params.userid,
      })
      .then((res) => {
        console.log("CURRENT SESSIONS", res.data);
        // let arr = [];
        for (let i = 0; i < res.data.length; i++) {
          let url = `/session?name=${this.props.match.params.username}&sessionid=${res.data[i].session_id}`;
          this.state.displaysession.push(
            <div style={{ fontSize: "130px" }}>
              <a href={url}>
                <SourceIcon fontSize="inherit" />
              </a>
              <h6 style={{ fontSize: "10px" }}>
                Session ID: {res.data[i].session_id}
              </h6>
            </div>
          );
        }
        // console.log(arr);
        this.setState({ existingSessions: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    let joinurl;
    const name = this.randomString(
      10,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    // const sessionid = 1251;
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <IntegrationInstructionsIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CollabPro
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Welcome {this.props.match.params.username}
              </Typography>
              <a href="/">
                <Button color="inherit">Logout</Button>
              </a>
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{ display: "flex" }}>
          <div style={{ width: "60%" }}>
            <div id="session-form">
              <div id="session-form-heading">
                <h1 style={{ marginLeft: "130px" }}>Create New Session</h1>
              </div>
              <div id="session-form-name">
                <TextField
                  id="outlined-basic"
                  label="Session Name"
                  variant="outlined"
                  style={{ width: "80%" }}
                  required
                />
              </div>
              <div id="session-form-filename">
                <TextField
                  id="outlined-basic"
                  label="File name"
                  variant="outlined"
                  style={{ width: "80%" }}
                />
              </div>

              <div id="session-form-createbtn">
                {/* <Link
                onClick={(e) =>
                  !name || !sessionid ? e.preventDefault() : null
                }
                to={`/session?name=${name}&sessionid=${sessionid}`}
              >
                <Button
                  variant="contained"
                  endIcon={<NoteAddIcon />}
                  // href="/session"
                >
                  Create Session
                </Button>
              </Link> */}

                <Button
                  onClick={this.createSession}
                  variant="contained"
                  endIcon={<NoteAddIcon />}
                  // href="/session"
                >
                  Create Session
                </Button>
              </div>
            </div>
            <div id="session-join-form">
              <h1 style={{ marginLeft: "130px" }}>Join Session</h1>
              <div id="session-join-form-link">
                <TextField
                  id="outlined-basic"
                  label="Session Link"
                  variant="outlined"
                  style={{ width: "80%" }}
                  onChange={(e) => {
                    console.log(e.target.value);
                    joinurl = e.target.value;
                  }}
                />
              </div>
              <div id="session-join-form-joinbtn">
                <Button
                  variant="contained"
                  endIcon={<IntegrationInstructionsIcon />}
                  href={joinurl}
                >
                  Join Session
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h1>Current Active Sessions</h1>
            <div style={{ display: "flex", margin: "10px" }}>
              {this.state.displaysession}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserHome);
