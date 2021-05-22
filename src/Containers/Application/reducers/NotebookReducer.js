import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    current_notebook_name: null,
    current_page: null,
    total_page: null,
    current_notebook_data: null,
}
const NotebookReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.setNotebookToNotebookReducer:
            return {
                ...state,
                current_notebook_name: action.payload.doc_name,
                    current_page: action.payload.current_page,
                    total_page: action.payload.total_page,
                    current_notebook_data: action.payload.notebook_data,
            };
        case ActionTypes.setNotebookTotalPage:
            return {
                ...state,
                total_page: action.payload,
            };
        default:
            return {
                ...state,
            }
    }
}
export default NotebookReducer;