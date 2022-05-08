import { useState, useContext, useRef } from "react";
import LivecodeContext from "../Context/livecode/LivecodeContext";

function Compiler() {
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("js");
  const livecode = useContext(LivecodeContext);
  const { codeState } = livecode;
  const eventTar = useRef("");

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

  const alertOption = (e) => {
    const element = document.querySelector("#disclaimer");
    element.style.setProperty("opacity", "1");
    element.style.setProperty("pointer-events", "all");
    eventTar.current = e.target.value;
  };

  const closeModal = () => {
    const element = document.querySelector("#disclaimer");
    element.style.setProperty("opacity", "0");
    element.style.setProperty("pointer-events", "none");
  };

  const handleLanguage = (e) => {
    if (e.target.innerText === "OK") {
      setLanguage(eventTar.current);
    }
    const element = document.querySelector("#disclaimer");
    element.style.setProperty("opacity", "0");
    element.style.setProperty("pointer-events", "none");
  };

  return (
    <>
      <div className="margComp">
        <label>Language: </label>
        <select value={language} className="btnSelect" onChange={alertOption}>
          <option value="py">Python</option>
          <option value="js">Node</option>
        </select>
      </div>
      <div className="margComp">
        <button onClick={handleSubmit} className="compilerBtn">
          Compile code
        </button>
      </div>
      <div className="compiledOutput margComp">
        <div>Output: {output}</div>
      </div>
      <div id="disclaimer" className="modal-container">
        <section className="modal">
          <header className="modal-header">
            <h2 className="modal-title">Language selection</h2>
            <a onClick={closeModal} className="modal-close">
              Close
            </a>
          </header>
          <div className="modal-content">
            <p>
              <strong>Disclaimer:</strong> You have selected{" "}
              {language === "py" ? "Node" : "Python"} language for editor. Are
              you sure you want to change language?
            </p>
            <button onClick={handleLanguage} className="btn btnLang">
              OK
            </button>
            <button onClick={handleLanguage} className="btn btnLang">
              Cancel
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
export default Compiler;
