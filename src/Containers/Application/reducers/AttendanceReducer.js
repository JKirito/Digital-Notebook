import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    isLoading: false,
    attendanceList: [],
    availableAttendanceList: [],
    error: null,
};

const AttendanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.updateAttendanceList:
            let temp = action.payload;
            let filtered = temp.filter(x => x.data.isActive === true && new Date(x.data.endTime) > new Date());
            console.log(filtered)
            return {
                ...state,
                attendanceList: [...action.payload],
                    availableAttendanceList: [...filtered],
            };
        default:
            return {
                ...state,
            };
    }
}

export default AttendanceReducer;