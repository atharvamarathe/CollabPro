import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import ToggleButton from "@mui/material/ToggleButton";
import queryString from "query-string";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ChatApp from "./ChatApp";
import Slider from "@mui/material/Slider";
import Editor from "../editor";
import LightModeIcon from "@mui/icons-material/LightMode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShareIcon from "@mui/icons-material/Share";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DownloadIcon from "@mui/icons-material/Download";
import TodoList from "./Todolist/TodoList";
import "./Todolist/index.css";
class Session extends Component {
  constructor() {
    super();
    this.fontsize = 15;
  }
  state = {
    fontsize: 15,
    theme: "dark",
    editordata: "",
    name: "",
    isGuest: false,
    sessionId: 0,
    sessionlink: "",
  };
  componentDidMount() {
    let { name, sessionid } = queryString.parse(window.location.search);
    if (!name) {
      this.setState({ name: "Guest" });
      this.setState({ isGuest: true });
    } else this.setState({ name: name });
    this.setState({ sessionId: sessionid });
    this.setState({
      sessionlink: `localhost:5000/joinsession/${sessionid}`,
    });
  }
  updateCode = (newVal) => {
    this.setState({ editordata: newVal });
    console.log("NEW CODE : ", this.state.editordata);
  };
  downloadCode = () => {
    var text = this.state.editordata;

    var fileBlob = new Blob([text], { type: "application/octet-binary" });

    var link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(fileBlob));
    link.setAttribute("download", "code.js");
    link.click();
  };

  render() {
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
                Session Name
              </Typography>
              <a href="/">
                <Button color="inherit">Logout</Button>
              </a>
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{ display: "flex" }}>
          <div style={{ width: "20%" }}>
            <div style={{ height: "50%", backgroundColor: "#66CCFF" }}>
              <TodoList />
            </div>
            <div id="editor-controls">
              <div style={{ margin: "15px" }}>
                <h2>Editor Controls</h2>
              </div>
              <div style={{ margin: "10px" }}>
                <div style={{ margin: "10px", fontSize: "20px" }}>
                  Font-size
                </div>
                <Box width={200}>
                  <Slider
                    defaultValue={50}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={7}
                    max={35}
                    onChange={(e, val) => {
                      this.setState({ fontsize: val });
                    }}
                  />
                </Box>
              </div>
              <div style={{ margin: "10px" }}>
                <div style={{ margin: "10px", fontSize: "20px" }}>Theme</div>
                <ToggleButtonGroup
                  value={this.state.theme}
                  exclusive
                  onChange={(e, val) => {
                    this.setState({ theme: val });
                  }}
                  aria-label="text alignment"
                >
                  <ToggleButton value="light" aria-label="left aligned">
                    <LightModeIcon />
                  </ToggleButton>
                  <ToggleButton value="dark" aria-label="right aligned">
                    <DarkModeIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div style={{ display: "flex", marginTop: "30px" }}>
                <div onClick={this.downloadCode}>
                  <div style={{ margin: "5px", fontSize: "20px" }}>
                    Download
                  </div>
                  <Button style={{ margin: "5px" }}>
                    <DownloadIcon fontSize="large" />
                  </Button>
                </div>
                <div>
                  <div style={{ margin: "5px", fontSize: "20px" }}>Share</div>
                  <CopyToClipboard text={this.state.sessionlink}>
                    <Button style={{ margin: "5px" }}>
                      <ShareIcon fontSize="large" />
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "60%" }}>
            <Editor
              fontsize={`${this.state.fontsize}px`}
              theme={this.state.theme}
              oncodeupdate={this.updateCode}
              isguest={this.state.isGuest}
            />
          </div>
          <div style={{ width: "20%" }}>
            <ChatApp />
          </div>
        </div>
      </div>
    );
  }
}

export default Session;
