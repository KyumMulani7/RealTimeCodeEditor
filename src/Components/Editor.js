import { useEffect, useRef, useState, useContext } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";
import Compiler from "./Compiler";
import LivecodeContext from "../Context/livecode/LivecodeContext";

const Editor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);
  const livecode = useContext(LivecodeContext);
  const { setCodeChange } = livecode;

  const [theme, setTheme] = useState("dracula");
  const options = [
    {
      label: "Dracula",
      value: "dracula",
    },
    {
      label: "Ayu-dark",
      value: "ayu-dark",
    },
    {
      label: "Material-ocean",
      value: "material-ocean",
    },
    {
      label: "Duotone-light",
      value: "duotone-light",
    },
  ];
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: theme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        setCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  useEffect(() => {
    async function loadMyModule() {
      await import(`codemirror/theme/${theme}.css`);
      editorRef.current.toTextArea();
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: theme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        setCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    loadMyModule();
  }, [theme]);

  return (
    <>
      <textarea id="realtimeEditor"></textarea>
      <div className="gap"></div>
      <div className="compilerWrap">
        <div className="selectWrap">
          <label>Please select theme for the editor: </label>
          <select
            value={theme}
            className="btnSelect"
            onChange={(e) => setTheme(e.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Compiler editorRef={editorRef} />
      </div>
    </>
  );
};

export default Editor;
