import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionTypes } from '../../../Containers/Application/Actiontypes';
import "./componentsStyles.css";

export const ColorSelector = () => {
    let dispatch = useDispatch();
    let brushColor = useSelector(state => state.CanvasReducer.brushColor);
    const changeBrushColor = (e) => {
        dispatch({
            type: ActionTypes.changeCanvasBrushColor,
            payload: e.target.value,
        })
    }
    return (
        <>
            <input type="color" className="d_cpick" onChange={changeBrushColor} value={brushColor} />
        </>
    )
}

export const BrushSizeChanger = () => {
    let dispatch = useDispatch();
    let brushSize = useSelector(state => state.CanvasReducer.brushRadius);
    const changeBrushSize = (e) => {
        dispatch({
            type: ActionTypes.changeCanvasBrushSize,
            payload: e.target.value,
        })
    };
    return (
        <>
            <input type="range" className="d_spick" id="" min={5} max={90} orient="vertical" value={brushSize} onChange={changeBrushSize} />
        </>
    );
}

export const GridChecker = () => {
    let dispatch = useDispatch();
    let showGrid = useSelector(state => state.CanvasReducer.showGrid);
    const toggleGridVisibility = () => {
        dispatch({
            type: ActionTypes.toggleGridVisibility,
        })
    }
    return (
        <>
            <input type="checkbox" onChange={toggleGridVisibility} checked={showGrid} />
        </>
    );
}


// Working OK But can be Improved by handling useEffect Better. LATER :/
export const GridCanvas = () => {
    // let dispatch = useDispatch();
    let showGrid = useSelector(state => state.CanvasReducer.showGrid);
    let canvasWidth = useSelector(state => state.CanvasReducer.canvasWidth);
    let canvasHeight = useSelector(state => state.CanvasReducer.canvasHeight);
    let gridColor = useSelector(state => state.CanvasReducer.gridColor);
    let gridThickness = useSelector(state => state.CanvasReducer.gridThickness);
    let gridMargin = useSelector(state => state.CanvasReducer.gridMargin);
    let gridRowHeight = useSelector(state => state.CanvasReducer.gridRowHeight);

    let gridcanvasRef = useRef();

    const drawGrid = () => {
        let ctx = gridcanvasRef.current?.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasWidth);
            ctx.beginPath();
            ctx.lineCap = "round";
            if (gridColor) ctx.strokeStyle = gridColor;
            if (gridThickness) ctx.lineWidth = gridThickness;
            for (let i = gridRowHeight; i <= canvasHeight; i += gridRowHeight) {
                ctx.moveTo(gridMargin, i + 0.5);
                ctx.lineTo(canvasWidth - gridMargin, i + 0.5);
                ctx.stroke();
            }
            ctx.closePath();
        }
    };
    useEffect(() => {
        drawGrid();
    });
    return (
        <>
            { showGrid && <canvas className="d_gridcanvas" ref={gridcanvasRef} id="d_gridcanvas" width={canvasWidth} height={canvasHeight} />}
        </>
    );
}

export const SdrawCanvas = () => {
    let dispatch = useDispatch();
    let canvasWidth = useSelector(state => state.CanvasReducer.canvasWidth);
    let canvasHeight = useSelector(state => state.CanvasReducer.canvasHeight);
    let brushSize = useSelector(state => state.CanvasReducer.brushRadius);
    let brushColor = useSelector(state => state.CanvasReducer.brushColor);
    let eraserColor = useSelector(state => state.CanvasReducer.eraserColor);
    let operation = useSelector(state => state.CanvasReducer.operation);
    let maxBoundryHeight = useSelector(state => state.CanvasReducer.maxBoundryHeight);
    let maxBoundryWidth = useSelector(state => state.CanvasReducer.maxBoundryWidth);
    let canvasCompositeOperations = useSelector(state => state.CanvasReducer.canvasCompositeOperations);
    let canvasOperation = useSelector(state => state.CanvasReducer.canvasOperations);
    let sdrawcanvasRef = useRef();

    // Local Variables....
    let pointData = [];
    let isDrawing = false;
    let isMobile = false;


    // Listeners .........
    const MouseDownListener = (e) => {
        let canvas = sdrawcanvasRef.current;
        if (!canvas) return;
        let canvasctx = canvas.getContext("2d");
        canvasctx.lineWidth = brushSize;
        canvasctx.lineJoin = "round";
        canvasctx.lineCap = "round";
        canvasctx.strokeStyle = brushColor;
        if (e.button === 0) {
            isDrawing = true;
            canvasctx.beginPath();
            pointData.push({
                x: e.clientX,
                y: e.clientY,
            });
            if (operation === canvasOperation.draw) {
                canvasctx.globalCompositeOperation = canvasCompositeOperations.draw;
                canvasctx.strokeStyle = brushColor;
            } else if (operation === canvasOperation.erase) {
                canvasctx.strokeStyle = eraserColor;
            }
            canvasctx.lineWidth = brushSize;
            canvas.addEventListener("mousemove", MouseMoveListener);
            canvas.addEventListener("mouseup", MouseUpListener);
        }
    }

    const MouseMoveListener = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        let canvas = sdrawcanvasRef.current;
        let canvasctx = canvas.getContext("2d");
        if (!isMobile) {
            pointData.push({
                x: e.clientX,
                y: e.clientY,
            });
        } else {
            pointData.push({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            });
        }
        canvasctx.clearRect(0, 0, canvasWidth, canvasHeight);
        let p1 = pointData[0];
        let p2 = pointData[1];
        canvasctx.beginPath();
        canvasctx.moveTo(p1.x, p1.y);
        for (let i = 1, len = pointData.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            let midPoint = midPointBtw(p1, p2);
            if (p1.x > maxBoundryWidth) {
                // Dispatch Action For setting new MaxBoundryWidth
                // canvasConfigurations.maxWidth = p1.x;
            }
            if (p1.y > maxBoundryHeight) {
                // Dispatch Action For setting new MaxBoundryWidth
                // canvasConfigurations.maxHeight = p1.y;
            }
            canvasctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = pointData[i];
            p2 = pointData[i + 1];
        }
        canvasctx.lineTo(p1.x, p1.y);
        canvasctx.stroke();
    }
    const MouseUpListener = (e) => {
        let canvas = sdrawcanvasRef.current;
        let canvasctx = canvas.getContext("2d");
        isDrawing = false;
        // Save Point Data in the Drawing Data Before Remving it
        // Important to Convert point Data to valid JS Object
        // DrawingData.push(JSON.parse(JSON.stringify(pointData)))
        let dataToPush = {
            pointData: JSON.parse(JSON.stringify(pointData)),
            brushColor: brushColor,
            brushRadius: brushSize,
            canvasOperation: operation,
        }
        // DrawingData.push(dataToPush);
        dispatch({
            type: ActionTypes.addSdrawCanvasDrawingData,
            payload: dataToPush,
        })
        pointData.length = 0;
        canvasctx.closePath();
        canvasctx.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.removeEventListener("mousemove", MouseMoveListener);
        canvas.removeEventListener("mouseup", MouseUpListener);
    }
    const TouchStartListener = (e) => {
        let canvas = sdrawcanvasRef.current;
        let canvasctx = canvas.getContext("2d");
        isDrawing = true;
        isMobile = true;
        pointData.push({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        });
        canvasctx.lineWidth = brushSize;
        canvasctx.lineJoin = "round";
        canvasctx.lineCap = "round";
        canvasctx.strokeStyle = brushColor;
        canvasctx.beginPath();
        if (operation === canvasOperation.draw) {
            canvasctx.globalCompositeOperation = canvasCompositeOperations.draw;
            canvasctx.strokeStyle = brushColor;
        } else if (operation === canvasOperation.erase) {
            canvasctx.strokeStyle = eraserColor;
        }
        canvasctx.lineWidth = brushSize;
        canvas.addEventListener("touchmove", MouseMoveListener);
        canvas.addEventListener("touchend", MouseUpListener);
    }

    const AddListeners = () => {
        let canvas = sdrawcanvasRef.current;
        if (!canvas) return;
        canvas.addEventListener("mousedown", MouseDownListener);
        canvas.addEventListener("touchstart", TouchStartListener);
    }
    const RemoveListeners = () => {
        let canvas = sdrawcanvasRef.current;
        if (!canvas) return;
        canvas.removeEventListener("mousedown", MouseDownListener);
        canvas.removeEventListener("touchstart", TouchStartListener);
    }
    useEffect(() => {
        AddListeners();
        return () => {
            RemoveListeners();
        };
    })
    return (
        <>
            <canvas className="d_sdrawcanvas" ref={sdrawcanvasRef} id="d_sdrawcanvas" width={canvasWidth} height={canvasHeight} />
        </>
    );
}

export const DcontainCanvas = () => {
    let canvasWidth = useSelector(state => state.CanvasReducer.canvasWidth);
    let canvasHeight = useSelector(state => state.CanvasReducer.canvasHeight);
    let drawingData = useSelector(state => state.SdrawReducer.drawingData);
    let canvasCompositeOperation = useSelector(state => state.CanvasReducer.canvasCompositeOperations);
    let canvasOperation = useSelector(state => state.CanvasReducer.canvasOperations);
    let dcontaincanvasRef = useRef();

    const DrawDataToCanvas = () => {
        let drawCanvas = dcontaincanvasRef.current;
        let drawCanvasctx = drawCanvas.getContext("2d")

        // console.log(drawingData);
        drawCanvasctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (drawingData?.length > 0) {
            drawingData.forEach((ele) => {
                // console.log(ele);
                let pointData = ele.pointData;
                drawCanvasctx.lineWidth = ele.brushRadius;
                drawCanvasctx.strokeStyle = ele.brushColor;
                // console.log(ele.canvasOperation);
                if (ele.canvasOperation === canvasOperation.draw) {
                    // console.log("Converting to Drawing", ele.canvasOperation, canvasOperation.draw)
                    drawCanvasctx.globalCompositeOperation = canvasCompositeOperation.draw;
                } else if (ele.canvasOperation === canvasOperation.erase) {
                    // console.log("Converting to Eraser", ele.canvasOperation, canvasOperation.draw)
                    drawCanvasctx.globalCompositeOperation = canvasCompositeOperation.eraser;
                }
                // console.log(canvasCompositeOperation.draw, ele.canvasOperation);
                // console.log(drawCanvasctx.globalCompositeOperation);
                drawCanvasctx.lineJoin = "round";
                drawCanvasctx.lineCap = "round";
                drawCanvasctx.beginPath();
                let p1 = pointData[0];
                let p2 = pointData[1];
                // console.log(DrawingData)
                if (p1) {
                    drawCanvasctx.beginPath();
                    drawCanvasctx.moveTo(p1.x, p1.y);
                    for (let i = 1, len = pointData.length; i < len; i++) {
                        // we pick the point between pi+1 & pi+2 as the
                        // end point and p1 as our control point
                        let midPoint = midPointBtw(p1, p2);
                        drawCanvasctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                        p1 = pointData[i];
                        p2 = pointData[i + 1];
                    }
                    drawCanvasctx.lineTo(p1.x, p1.y);
                    drawCanvasctx.stroke();
                }
                drawCanvasctx.closePath();
            })
        }
    }

    useEffect(() => {
        DrawDataToCanvas();
        // console.dir(canvasCompositeOperation)
    }, [drawingData, canvasHeight, canvasWidth]);

    return (
        <>
            <canvas className="d_dcontaincanvas" ref={dcontaincanvasRef} id="d_dcontaincanvas" width={canvasWidth} height={canvasHeight} />
        </>
    );
}

// UTIL FUNCTIONS
function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}