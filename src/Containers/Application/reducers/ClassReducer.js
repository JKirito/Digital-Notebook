import {
    ActionTypes
} from "../Actiontypes"

const initialState = {
    loading: false,
    error: null,
    success: false,
    classdata: null,
    myclasses: null,
    enrolledclasses: null,
}

const ClassReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.createClassFetchRequest:
            return {
                ...state,
                loading: true,
                    error: null,
                    success: false,
            };
        case ActionTypes.createClassFetchSuccess:
            return {
                ...state,
                loading: false,
                    error: null,
                    success: true,
            };
        case ActionTypes.createClassFetchError:
            return {
                ...state,
                loading: false,
                    error: action.payload,
                    success: false,
            };
        case ActionTypes.createClassResetDefaultState:
            return {
                ...state,
                loading: false,
                    error: null,
                    success: false,
            };
        case ActionTypes.setClassData:
            return {
                ...state,
                classdata: [...action.payload],
            };
        case ActionTypes.setMyClasses:
            return {
                ...state,
                myclasses: [...action.payload],
            };
        case ActionTypes.setEnrolledClasses:
            return {
                ...state,
                enrolledclasses: [...action.payload],
            }
            default:
                return {
                    ...state
                };
    }
}

export default ClassReducer;