import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    isLoggedIn: false,
    user: null,
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.setLoggedInTrue:
            return {
                ...state,
                isLoggedIn: true,
            };
        case ActionTypes.setLoggedInFalse:
            return {
                ...state,
                isLoggedIn: false,
            };
        case ActionTypes.setLoggedInUser:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}

export default AuthReducer;