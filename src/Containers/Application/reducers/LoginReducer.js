import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    isLoading: false,
    error: null,
}
const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.fetchLoginRequest:
            return {
                ...state,
                isLoading: true,
            };
        case ActionTypes.fetchLoginSuccess:
            return {
                ...state,
                isLoading: false,
                    // user: action.payload,
                    error: null,
            };
        case ActionTypes.fetchLoginFailure:
            return {
                ...state,
                isLoading: false,
                    user: null,
                    error: action.payload,
            };
        case ActionTypes.removeLoggedInError:
            return {
                ...state,
                error: null,
            };
        case ActionTypes.setLoggedInError:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}
export default LoginReducer;