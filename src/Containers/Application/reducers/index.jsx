import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import LoginReducer from "./LoginReducer";
import NotebookReducer from "./NotebookReducer";
import SignupReducer from "./SignupReducer";
import UserReducer from "./UserReducer";
import CanvasReducer from "./CanvasReducer";
import SdrawReducer from "./SdrawReducer";


// Exporting All The Reducers
const allReducers = combineReducers({
    AuthReducer,
    LoginReducer,
    SignupReducer,
    UserReducer,
    NotebookReducer,
    CanvasReducer,
    SdrawReducer,
})

export default allReducers;