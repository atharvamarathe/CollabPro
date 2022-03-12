import React, { Component } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Connection from "./Connection";

const Editor = ({ fontsize, theme, oncodeupdate, isguest }) => {
  const [data, setDelta] = React.useState("");
  const [code, setCode] = React.useState("");
  const connection = Connection.get("examples", "richtext");
  connection.fetch();
  // React.useEffect(() => {
  //   console.log("Refreshed !", window.sessionStorage.getItem("code"));
  //   if (window.sessionStorage.getItem("code"))
  //     setCode(JSON.parse(window.sessionStorage.getItem("code")));
  // }, []);

  React.useEffect(() => {
    window.sessionStorage.setItem("code", code);
    console.log("Chnage here !!!");
  }, [code]);
  React.useEffect(() => {
    connection.subscribe(function (error) {
      if (error) {
        console.log("Error:", error);
      }
      // set initial data of the document
      console.log("fuck!", connection);
      // setDelta(connection.data["ops"][0]["insert"]);
      connection.on("op", function (op, source) {
        if (source === true) {
          return;
          // id: "ottext";
        }
        console.log("Received : ", op);
        if (typeof op != "object") setCode(op);
      });
    });
  }, [connection]);
  return (
    <div
      style={{
        fontSize: `${fontsize}`,
        pointerEvents: isguest ? "none" : "auto",
      }}
    >
      <CodeMirror
        value={code}
        height="47vw"
        // width="700px"
        theme={theme}
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
          oncodeupdate(value);
          setCode(value);
          console.log("THIS :", viewUpdate);
          connection.submitOp(value);
        }}
      />
    </div>
  );
};

export default Editor;
