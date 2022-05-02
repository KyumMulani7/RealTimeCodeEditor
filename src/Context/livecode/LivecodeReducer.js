import { SET_CODE, REMOVE_CODE } from "../types";

const LivecodeReducer = (state, action) => {
  switch (action.type) {
    case SET_CODE:
      return {
        ...state,
        code: action.payload,
      };
    case REMOVE_CODE:
      return {
        ...state,
        code: "",
      };
    default:
      return state;
  }
};

export default LivecodeReducer;
