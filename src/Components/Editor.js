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
      label: "Material-ocean",
      value: "material-ocean",
    },
    {
      label: "Duotone-light",
      value: "duotone-light",
    },
    {
      label: "Midnight",
      value: "midnight",
    },
    {
      label: "Vibrant-Ink",
      value: "vibrant-ink",
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
        code && setCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      try {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null && code !== "") {
            editorRef.current.setValue(code);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        code && setCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    loadMyModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <>
      <textarea id="realtimeEditor"></textarea>
      <div className="gap"></div>
      <div className="compilerWrap">
        <div className="selectWrap margComp">
          <label>Please select theme: </label>
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
