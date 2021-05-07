import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    isLoading: false,
    // user: null,
    success: false,
    error: null,
};

const SignupReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.fetchSignupRequest:
            return {
                ...state,
                isLoading: true,
                    error: null,
            };
        case ActionTypes.fetchSignupSuccess:
            return {
                ...state,
                isLoading: false,
                    success: action.payload.success,
                    error: null,
            };
        case ActionTypes.fetchSignupFailure:
            return {
                ...state,
                isLoading: false,
                    error: action.payload.error,
                    success: action.payload.success,
            };
        case ActionTypes.setSignupError:
            return {
                ...state,
                error: null,
            };
        default:
            return {
                ...state,
            };
    }
}

export default SignupReducer;