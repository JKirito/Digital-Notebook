export const ActionTypes = {
    fetchLoginRequest: "FETCH_LOGIN_REQUEST",
    fetchLoginSuccess: "FETCH_LOGIN_SUCCESS",
    fetchLoginFailure: "FETCH_LOGIN_FAILURE",
    fetchSignupRequest: "FETCH_SIGNUP_REQUEST",
    fetchSignupSuccess: "FETCH_SIGNUP_SUCCESS",
    fetchSignupFailure: "FETCH_SIGNUP_FAILURE",
    setSignupError: "SET_SIGNUP_ERROR",
    setLoggedInTrue: "SET_LOGGED_IN_TRUE",
    setLoggedInFalse: "SET_LOGGED_IN_FALSE",
    setLoggedInUser: "SET_LOGGED_IN_USER",
    removeLoggedInError: "REMOVE_LOGGED_IN_ERROR",
    setLoggedInError: "SET_LOGGED_IN_ERROR",
    fetchUserDataRequest: "FETCH_USER_DATA_REQUEST",
    fetchUserDataSuccess: "FETCH_USER_DATA_SUCCESS",
    fetchUserDataFailure: "FETCH_USER_DATA_FAILURE",
    removeUserReducerData: "REMOVE_USERREDUCER_DATA",
    saveCurrentNoteboookData: "SAVE_CURRENT_NOTEBOOK_DATA",
    writeDataToNotebook: "WRITE_DATA_TO_NOTEBOOK",
    insertDataToNotebookReducer: "INSERT_NOTEBOOKDATA_TO_NOTEBOOK_REDUCER",
    deleteLastDataFromNotebookReducer: "DELETE_NOTEBOOKDATA_FROM_NOTEBOOK_REDUCER",
    setNotebookToNotebookReducer: "SET_NOTEBOOK_TO_NOTEBOOK_REDUCER",





    changeCanvasBrushColor: "SET_BRUSH_COLOR",
    changeCanvasBrushSize: "SET_BRUSH_SIZE",
    changeCanvasMaxBoundryHeight: "CHANGE_CANVAS_MAX_BOUNDRY_HEIGHT",
    changeCanvasMaxBoundryWidth: "CHANGE_CANVAS_MAX_BOUNDRY_WIDTH",
    toggleGridVisibility: "TOGGLE_GRID_VISIBILITY",
    updateCanvasDimensions: "UPDATE_CANVAS_DIMENSIONS",
    changeOperationToDraw: "CHANGE_OPERATION_TO_DRAW",
    changeOperationToEraser: "CHANGE_OPERATION_TO_ERASER",


    addSdrawCanvasDrawingData: "ADD_SDRAW_CANVAS_DRAWING_DATA",
    setSdrawCanvasDrawingData: "SET_SDRAW_CANVAS_DRAWING_DATA",
    undoSdrawCanvasDrawingData: "UNDO_SDRAW_CANVAS_DRAWING_DATA",
}

export const FirebaseCollections = {
    users: 'users',
    notebooks: 'notebooks'
}