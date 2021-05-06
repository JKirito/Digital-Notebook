import {
    ActionTypes
} from "../Actiontypes";
const initialState = {
    isLoading: false,
    userdata: null,
    success: false,
    error: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.fetchUserDataRequest:
            return {
                ...state,
                isLoading: true,
            };
        case ActionTypes.fetchUserDataSuccess:
            return {
                ...state,
                isLoading: false,
                    userdata: action.payload,
                    error: null,
            };
        case ActionTypes.fetchUserDataFailure:
            return {
                ...state,
                isLoading: false,
                    userdata: null,
                    error: action.payload,
            };
        case ActionTypes.removeUserReducerData:
            return {
                ...state,
                userdata: null,
            };
            // case ActionTypes.writeDataToNotebook:
            //     let dataToEdit = state.userdata?.filter(el => el.doc_name === action.payload.doc_name);
            //     let newdata = {
            //         ...state,
            //         userdata: state.userdata
            //     };
            //     console.log(dataToEdit[0]);
            //     return {
            //         ...state,
            //     };
        default:
            return {
                ...state,
            };
    }
}
export default UserReducer;