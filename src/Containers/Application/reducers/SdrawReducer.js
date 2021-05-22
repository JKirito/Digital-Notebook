import {
    ActionTypes
} from "../Actiontypes";

const initialState = {
    isDrawing: false,
    drawingData: [],
};

const SdrawReducer = (state = initialState, action) => {
    let newData;
    switch (action.type) {
        case ActionTypes.addSdrawCanvasDrawingData:
            return {
                ...state,
                drawingData: state.drawingData.concat(action.payload),
            };
        case ActionTypes.setSdrawCanvasDrawingData:
            let t = action?.payload?.fetchedData?.filter(x => x.page === action.payload.current_page)
            // console.log(t);
            try {
                newData = JSON.parse(t[0] ?.data);
            } catch (e) {
                // console.log("Error")
                // newData = t[0].data;
                newData = [];
            }
            return {
                ...state,
                drawingData: newData,
            };
        case ActionTypes.undoSdrawCanvasDrawingData:
            let prevData = state.drawingData;
            newData = prevData.slice(0, prevData.length - 1);
            // console.dir(prevData)
            // console.dir(newData)
            return {
                ...state,
                drawingData: newData,
            };
        default:
            return {
                ...state,
            };
    }
}

export default SdrawReducer;