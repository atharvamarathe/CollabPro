import React, { Component } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
// import "codemirror/keymap/sublime";
// import "codemirror/theme/monokai.css";

class Editor extends Component {
  state = {
    code: "// Welcome to CollabPro ! \n// start to write code from here",
  };
  render() {
    return (
      <div id="codemirror-editor">
        <CodeMirror
          value={this.state.code}
          theme={oneDark}
          height="900px"
          width="1300px"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            this.setState({ code: value });
            console.log(this.state.code);
            console.log(viewUpdate);
          }}
        />
      </div>
    );
  }
}

export default Editor;
