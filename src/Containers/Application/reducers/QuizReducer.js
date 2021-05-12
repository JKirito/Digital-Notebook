import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    quizAvailable: [],
    currentQuiz: {},
    isLoading: false,
    error: null,
    success: false,
};

const QuizReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.fetchRequestBeginAllAvailableQuiz:
            return {
                ...state,
                error: null,
                    success: false,
                    isLoading: true,
            };
        case ActionTypes.fetchErrorRequestAllAvailableQuiz:
            return {
                ...state,
                error: action.payload,
                    success: false,
                    isLoading: false,
            };
        case ActionTypes.fetchRequestSuccessAllAvailableQuiz:
            return {
                ...state,
                success: true,
                    error: null,
                    isLoading: false,
            };
        case ActionTypes.fetchRequestAllAvailableQuiz:
            return {
                ...state,
                quizAvailable: [...action.payload],
            };
        default: {
            return {
                ...state,
            };
        }
    }
}

export default QuizReducer;