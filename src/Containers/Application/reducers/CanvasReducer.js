import {
    ActionTypes
} from "../Actiontypes";

const canvasCompositeOperations = {
    draw: "source-over",
    eraser: "destination-out",
};
const canvasOperations = {
    draw: "draw",
    erase: "erase"
}

// Boundry Height and Width are values for detecting datapoint drawn at max x and y coordinates for better exporting functionality

const initialCanvasConfiguration = {
    brushColor: "#000000", // black
    brushRadius: 15,
    eraserColor: "#ffffff",
    maxBoundryHeight: window.innerHeight,
    maxBoundryWidth: window.innerWidth,
    showGrid: true,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,

    // Operations Related Configs
    operation: canvasOperations.draw,
    canvasOperations: canvasOperations,
    canvasCompositeOperations: canvasCompositeOperations,

    // Grid Related Configs
    gridColor: "rgba(90,90,90,0.5)", // Lightest Gray
    gridThickness: 1,
    gridMargin: 10,
    gridRowHeight: 30,
}

const CanvasReducer = (state = initialCanvasConfiguration, action) => {
    switch (action.type) {
        case ActionTypes.changeCanvasBrushColor:
            return {
                ...state,
                brushColor: action.payload,
            };
        case ActionTypes.changeCanvasBrushSize:
            return {
                ...state,
                brushRadius: action.payload,
            };
        case ActionTypes.toggleGridVisibility:
            return {
                ...state,
                showGrid: !state.showGrid,
            };
        case ActionTypes.updateCanvasDimensions:
            return {
                ...state,
                canvasHeight: action.payload.height,
                    canvasWidth: action.payload.width,
            };
        case ActionTypes.changeOperationToDraw:
            return {
                ...state,
                operation: canvasOperations.draw,
            };
        case ActionTypes.changeOperationToEraser:
            return {
                ...state,
                operation: canvasOperations.erase,
            };
        default:
            return state;
    }
}

export default CanvasReducer;