import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    assignmentList: [],
    availableAssignmentList: [],
    isLoading: false,
    error: null,
}

const formatDate = (temp, index) => {
    let assignmentDate;
    if (temp) {
        let split = temp[index].data.dueDate.split("-");
        let year = parseInt(split[0]);
        let month = parseInt(split[1]) - 1;
        let day = parseInt(split[2]);
        assignmentDate = new Date(year, month, day);
        // console.log(assignmentDate)
        return assignmentDate;
    }
    return assignmentDate;
}
const AssignmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.updateAssignmentList:
            let temp = action.payload;
            let filtered = temp.filter((x, index) => new Date() < formatDate(temp, index));
            // console.log(filtered)
            return {
                ...state,
                assignmentList: [...action.payload],
                    availableAssignmentList: [...filtered],
            };
        case ActionTypes.setAssignmentLoading:
            return {
                ...state,
                isLoading: action.payload,
            };
        case ActionTypes.setAssignmentError:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return {
                ...state,
            }
    }
}

export default AssignmentReducer;