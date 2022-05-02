import { useReducer } from "react";
import LivecodeContext from "./LivecodeContext";
import LivecodeReducer from "./LivecodeReducer";
import { SET_CODE, REMOVE_CODE } from "../types";

const LivecodeState = (props) => {
  const initialState = {
    code: "",
  };

  const [state, dispatch] = useReducer(LivecodeReducer, initialState);
  console.log("state in stateFile", state);

  // Set code change value
  const setCodeChange = (text) => {
    console.log("inside dispatch", text);
    dispatch({
      type: SET_CODE,
      payload: text,
    });
  };
  // Remove code value
  const removeCode = () => {
    dispatch({
      type: REMOVE_CODE,
    });
  };

  return (
    <LivecodeContext.Provider
      value={{
        codeState: state.code,
        setCodeChange,
        removeCode,
      }}>
      {props.children}
    </LivecodeContext.Provider>
  );
};

export default LivecodeState;
