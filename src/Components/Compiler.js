import { useState, useContext } from "react";
import LivecodeContext from "../Context/livecode/LivecodeContext";

function Compiler() {
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("js");
  const livecode = useContext(LivecodeContext);
  const { codeState } = livecode;

  const handleSubmit = async () => {
    const payload = {
      language,
      code: `${codeState}`,
    };

    try {
      setOutput("");
      const res = await fetch(
        "https://mk7-realtimecodeeditor.herokuapp.com/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      setOutput(data.output);
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  return (
    <>
      <div>
        <label>Language: </label>
        <select
          value={language}
          className="btnSelect"
          onChange={(e) => {
            const shouldSwitch = window.confirm(
              "Are you sure you want to change language?"
            );
            if (shouldSwitch) {
              setLanguage(e.target.value);
            }
          }}>
          <option value="py">Python</option>
          <option value="js">Node</option>
        </select>
      </div>
      <div>
        <label>Click to Compile your code: </label>
        <button onClick={handleSubmit} className="compilerBtn">
          Submit
        </button>
      </div>
      <div className="compiledOutput">
        <div>Output: {output}</div>
      </div>
    </>
  );
}
export default Compiler;
