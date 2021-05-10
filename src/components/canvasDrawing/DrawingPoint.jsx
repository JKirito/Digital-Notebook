import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { action_SaveNotebook, action_WriteDataToNotebook } from '../../Containers/Application/actions';
import './DrawingPoint.css';
import GridCanvas from './GridCanvas';


// Configurations 
var canvasCompositeOperations = {
    draw: "source-over",
    eraser: "destination-out",
};
var canvasOperations = {
    draw: "draw",
    erase: "erase"
}
var canvasConfigurations = {
    brushColor: "black",
    brushRadius: 15,
    operation: canvasOperations.draw,
    eraserColor: "white",
    maxHeight: window.innerHeight,
    maxWidth: window.innerWidth,
}
var DrawingData = [];
var canvasPersitantData = [];

function DrawingPoint() {
    const dispatch = useDispatch();
    return (
        <div>
            <CanvasFrame />
        </div>
    )
}

const Header = () => {
    let current_page = useSelector(state => state.NotebookReducer.current_page)
    let total_page = useSelector(state => state.NotebookReducer.total_page)
    return <React.Fragment>
        <div className="d_headerfooterbasic">
            <div className="d_pagenav">
                {current_page}/{total_page}
            </div>
        </div>
    </React.Fragment>;
}
const Footer = ({ props, dispatch, redraw }) => {
    useEffect(() => {
        ActivateDrawBrush();
    }, []);
    return <div className="d_headerfooterbasic d_footer d_iconcolor">
            <a href="#" class="previous round" onclick="history.go(-1)">&#8249;</a>
        <div className="d_iconContainer" id="drawbutton" onClick={ActivateDrawBrush}>
            <i className=" fas fa-highlighter fa-lg"></i>
        </div>
        <div className="d_iconContainer" id="eraserbutton" onClick={ActivateEraser}>
            <i className="fas fa-eraser fa-lg"></i>
        </div>

        <div className='d_footerplus' id="add" onClick={() => { undoCanvas(redraw) }}>
            <i className="fas fa-undo fa-lg"></i>
        </div>

        <div className="d_iconContainer" id="savebutton" onClick={() => { SaveDocument({ props, dispatch }) }}>
            <i className="fas fa-save fa-lg"></i>
        </div>
        {/* <div className="d_iconContainer" id="exportbutton" onClick={ExportPdf}>
            <i className="fas fa-file-export fa-lg"></i>
        </div> */}
        <div className="d_iconContainer" id="clearbutton" onClick={ClearCanvas}>
            <i className="fas fa-trash fa-lg"></i>
        </div>
    </div >;
}

const removeAllActiveClassesFromTools = () => {
    let drawButton = document.getElementById("drawbutton");
    let eraserButton = document.getElementById("eraserbutton");
    // let exportButton = document.getElementById("exportbutton");
    let clearButton = document.getElementById("clearbutton");
    let saveButton = document.getElementById("savebutton");
    drawButton.classList.remove("d_iconActive");
    eraserButton.classList.remove("d_iconActive");
    // exportButton.classList.remove("d_iconActive");
    saveButton.classList.remove("d_iconActive");
    clearButton.classList.remove("d_iconActive");
}


// Canavas Functionalities..

const ActivateDrawBrush = () => {
    let drawButton = document.getElementById("drawbutton");
    // console.log(document.getElementById("drawbutton").classList);
    removeAllActiveClassesFromTools();
    drawButton.classList.add("d_iconActive");
    changeOperationToDraw();
}
const ActivateEraser = () => {
    let eraserButton = document.getElementById("eraserbutton");
    removeAllActiveClassesFromTools();
    eraserButton.classList.add("d_iconActive");
    changeOperationToErase();
}
const ExportPdf = () => {
    let exportButton = document.getElementById("exportbutton");
    removeAllActiveClassesFromTools();
    exportButton.classList.add("d_iconActive");
    let drawCanvas = document.getElementById("d_dcontaincanvas");
    let drawCanvasctx = drawCanvas.getContext("2d")
    let dlink = document.createElement("a");
    let ss = drawCanvas.toDataURL("image/png");
    dlink.setAttribute("download", "draw.png");
    dlink.setAttribute("href", ss);
    dlink.click();
    // console.log("Download")
}
const SaveDocument = ({ props, dispatch }) => {
    let saveButton = document.getElementById("savebutton");
    removeAllActiveClassesFromTools();
    saveButton.classList.add("d_iconActive");
    // console.dir(dispatch)
    dispatch(action_SaveNotebook({ data: DrawingData, current_page: props.current_page, doc_name: props.doc_name }));
}
const ClearCanvas = () => {
    let clearButton = document.getElementById("clearbutton");
    removeAllActiveClassesFromTools();
    clearButton.classList.add("d_iconActive");
    let drawCanvas = document.getElementById("d_dcontaincanvas");
    let drawCanvasctx = drawCanvas.getContext("2d")
    drawCanvasctx.clearRect(0, 0, canvasConfigurations.maxWidth, canvasConfigurations.maxHeight);
    DrawingData.length = 0;
}
const undoCanvas = (redraw) => {
    DrawingData.pop();
    console.dir(DrawingData);
    redraw();
}

const saveCanvasPersistantData = () => {
    canvasPersitantData = DrawingData;
}

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}
const changeOperationToDraw = () => {
    canvasConfigurations.operation = canvasCompositeOperations.draw;
    // console.log(`Changed Operation To Draw, ${canvasCompositeOperations.draw}, ${canvasConfigurations.operation}`)
}
const changeOperationToErase = () => {
    canvasConfigurations.operation = canvasCompositeOperations.eraser;
    // console.log(`Changed Operation To Erase, ${canvasCompositeOperations.eraser}, ${canvasConfigurations.operation}`)
    // console.dir(canvasConfigurations.operation)
}


const CanvasFrame = () => {

    // Usable References 

    let sdrawcanvasRef = useRef(undefined);
    let dcontaincanvasRef = useRef(undefined);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [showGrid, setShowGrid] = useState(true);
    let pointData = [];
    // let drawnData = useSelector(state => {
    //     let data = state.UserReducer?.userdata?.filter(el => el.doc_name === props.doc_name);
    //     return data;
    // });
    // useEffect(() => {
    //     console.log(drawnData);
    //     redraw();
    // }, []);

    var isDrawing = false;
    var isMobile = false;

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        // console.log("Mouse Move")
        let tcanvas = sdrawcanvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");
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
        tcanvasctx.clearRect(0, 0, dimensions.width, dimensions.height);
        var p1 = pointData[0];
        var p2 = pointData[1];
        tcanvasctx.beginPath();
        tcanvasctx.moveTo(p1.x, p1.y);
        for (var i = 1, len = pointData.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            var midPoint = midPointBtw(p1, p2);
            if (p1.x > canvasConfigurations.maxWidth) {
                canvasConfigurations.maxWidth = p1.x;
            }
            if (p1.y > canvasConfigurations.maxHeight) {
                canvasConfigurations.maxHeight = p1.y;
            }
            tcanvasctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = pointData[i];
            p2 = pointData[i + 1];
        }
        tcanvasctx.lineTo(p1.x, p1.y);
        tcanvasctx.stroke();

        // pointData.push({ x: e.clientX, y: e.clientY, brushSize: canvasConfigurations.brushRadius, brushColor: canvasConfigurations.brushColor });
    }
    const DrawDataToHoldingCanvas = () => {
        // console.log(canvasConfigurations.brushRadius)
        let drawCanvas = dcontaincanvasRef.current;
        let drawCanvasctx = drawCanvas.getContext("2d")
        drawCanvasctx.lineWidth = canvasConfigurations.brushRadius;
        drawCanvasctx.strokeStyle = canvasConfigurations.brushColor;
        drawCanvasctx.globalCompositeOperation = canvasConfigurations.operation;
        drawCanvasctx.lineJoin = "round";
        drawCanvasctx.lineCap = "round";
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
    }

    const redraw = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        let drawCanvas = dcontaincanvasRef.current;
        let tcanvas = sdrawcanvasRef.current;
        if (tcanvas && drawCanvas) {
            let drawCanvasctx = drawCanvas.getContext("2d")
            let tcanvasctx = tcanvas.getContext("2d");
            tcanvasctx.lineWidth = canvasConfigurations.brushRadius;
            tcanvasctx.lineJoin = "round";
            tcanvasctx.lineCap = "round";

            drawCanvasctx.lineWidth = canvasConfigurations.brushRadius;
            drawCanvasctx.lineJoin = "round";
            drawCanvasctx.lineCap = "round";
            drawCanvasctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            // console.log(drawnData[0].doc_data.notebook_data[0].data);
            // let drawing = drawnData[0].doc_data.notebook_data[0].data;
            if (DrawingData) {
                // console.log(DrawingData)
                for (let x in DrawingData) {
                    // if (DrawingData[x].operation)
                    // console.log(DrawingData[x]);
                    // if (DrawingData[x].canvasOperation !== canvasConfigurations.operation) {
                    //     console.log("Changing operation While Redrawing")
                    //     drawCanvasctx.globalCompositeOperation = DrawingData[x].canvasOperation;
                    // }
                    drawCanvasctx.globalCompositeOperation = DrawingData[x].canvasOperation;
                    drawCanvasctx.lineWidth = DrawingData[x].brushRadius;
                    let temppointData = DrawingData[x].pointData;
                    // console.dir(temppointData);
                    let p1 = temppointData[0];
                    let p2 = temppointData[1];
                    drawCanvasctx.strokeStyle = DrawingData[x].brushColor;
                    drawCanvasctx.beginPath();
                    drawCanvasctx.moveTo(p1.x, p1.y);
                    for (var i = 1, len = temppointData.length; i < len; i++) {
                        // we pick the point between pi+1 & pi+2 as the
                        // end point and p1 as our control point
                        var midPoint = midPointBtw(p1, p2);
                        drawCanvasctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                        p1 = temppointData[i];
                        p2 = temppointData[i + 1];
                    }
                    drawCanvasctx.lineTo(p1.x, p1.y);
                    drawCanvasctx.stroke();
                }
            }
        }
    }

    const setDimensionsAgain = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        redraw();
    }

    const AddListeners = () => {
        window.addEventListener("resize", setDimensionsAgain);

        // Addling Listeners for Shortcuts.
        document.addEventListener("keydown", function (e) {
            // CTRL + S
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
                e.preventDefault();
                // ExportPdf();
                saveCanvasPersistantData();
            }
            // CTRL + Z
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 90) {
                e.preventDefault();
                undoCanvas(redraw);
            }
            // CTRL + plus
            // if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 107) {
            //     e.preventDefault();
            //     changeGridSize();
            // }
        }, false);

        let tcanvas = sdrawcanvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");
        tcanvasctx.lineWidth = canvasConfigurations.brushRadius;
        tcanvasctx.lineJoin = "round";
        tcanvasctx.lineCap = "round";

        // Adding Canvas Listeners
        tcanvas.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                isDrawing = true;
                pointData.push({
                    x: e.clientX,
                    y: e.clientY,
                });
                tcanvasctx.lineJoin = "round";
                tcanvasctx.lineCap = "round";
                if (canvasConfigurations.operation === canvasCompositeOperations.draw) {
                    tcanvasctx.globalCompositeOperation = canvasCompositeOperations.draw;
                    tcanvasctx.strokeStyle = canvasConfigurations.brushColor;
                    // console.log("Drawing");
                } else if (canvasConfigurations.operation === canvasCompositeOperations.eraser) {
                    // tcanvasctx.globalCompositeOperation = canvasCompositeOperations.eraser;
                    tcanvasctx.strokeStyle = canvasConfigurations.eraserColor;
                    // console.log("Erasing");
                }
                tcanvasctx.lineWidth = canvasConfigurations.brushRadius;
                tcanvas.addEventListener("mousemove", draw);
            }
        })
        tcanvas.addEventListener("mouseup", (e) => {
            isDrawing = false;
            // Save Point Data in the Drawing Data Before Remving it
            // Important to Convert point Data to valid JS Object
            // DrawingData.push(JSON.parse(JSON.stringify(pointData)))
            DrawingData.push({
                pointData: JSON.parse(JSON.stringify(pointData)),
                brushColor: canvasConfigurations.brushColor,
                brushRadius: canvasConfigurations.brushRadius,
                canvasOperation: canvasConfigurations.operation,
            });
            // dispatch(action_WriteDataToNotebook({ page: props.current_page, doc_name: props.doc_name }));
            console.log("Mouse Up Trigger")
            // console.log(DrawingData);
            DrawDataToHoldingCanvas();
            // console.dir(JSON.parse(JSON.stringify(pointData)))
            pointData.length = 0;
            tcanvasctx.clearRect(0, 0, dimensions.width, dimensions.height);
            tcanvas.removeEventListener("mousemove", draw);
        }
        )
        tcanvas.addEventListener("touchstart", (e) => {
            isDrawing = true;
            isMobile = true;
            pointData.push({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            });
            if (canvasConfigurations.operation === canvasCompositeOperations.draw) {
                tcanvasctx.globalCompositeOperation = canvasCompositeOperations.draw;
                tcanvasctx.strokeStyle = canvasConfigurations.brushColor;
            } else if (canvasConfigurations.operation === canvasCompositeOperations.eraser) {
                console.dir(canvasConfigurations.operation);
                tcanvasctx.strokeStyle = canvasConfigurations.eraserColor;
            }
            tcanvasctx.lineWidth = canvasConfigurations.brushRadius;
            tcanvas.addEventListener("touchmove", draw);
        })
        tcanvas.addEventListener("touchend", (e) => {
            isDrawing = false;
            isMobile = false;
            DrawingData.push({
                pointData: JSON.parse(JSON.stringify(pointData)),
                brushColor: canvasConfigurations.brushColor,
                brushRadius: canvasConfigurations.brushRadius,
                canvasOperation: canvasConfigurations.operation,
            })
            DrawDataToHoldingCanvas();
            pointData.length = 0;
            tcanvasctx.clearRect(0, 0, dimensions.width, dimensions.height);
            tcanvas.removeEventListener("touchmove", draw);
        })
    }

    const LoadDefaultConfiguration = () => {
    };
    useEffect(() => {
        AddListeners();
        LoadDefaultConfiguration();
        // console.dir(props.doc_data);

        return () => {
            // window.removeEventListener('resize', setDimensionsAgain);
        }
        // Setting a Default Color
        // changeBrushColor(undefined, "gray");
    }, [canvasConfigurations, AddListeners]);
    // useEffect(() => {
    //     redraw();
    // });

    const changeBrushColor = (e, brushcolor) => {
        if (e !== undefined) {
            canvasConfigurations.brushColor = e.target.value;
        }
        if (brushcolor) {
            canvasConfigurations.brushColor = brushcolor;
        }
    }
    const changeBrushSize = (e) => {
        canvasConfigurations.brushRadius = e.target.value;
    }
    const toggleGridVisibility = (e) => {
        setShowGrid(e.target.checked)
    }

    return <div>
        <Header />
        <div>
            <canvas className="d_sdrawcanvas" ref={sdrawcanvasRef} id="d_sdrawcanvas" width={dimensions.width} height={dimensions.height}></canvas>
            <canvas className="d_dcontaincanvas" ref={dcontaincanvasRef} id="d_dcontaincanvas" width={dimensions.width} height={dimensions.height}></canvas>
            {/* <canvas className="d_gridcanvas" ref={dgridcanvasRef} id="d_gridcanvas" width={dimensions.width} height={dimensions.height}></canvas> */}
            {showGrid && <GridCanvas width={dimensions.width} height={dimensions.height} color={"rgba(90,90,90,0.5)"} linewidth={1} gridMargin={10} rowHeight={30} />}
            <div className="d_toollist">
                <input type="color" className="d_cpick" onInput={changeBrushColor} onChange={changeBrushColor} />
                <input type="range" className="d_spick" id="" min={5} max={90} orient="vertical" onChange={changeBrushSize} />
                <input type="checkbox" onChange={toggleGridVisibility} checked={showGrid} />
            </div>
        </div>
        <Footer redraw={redraw} />
    </div>;
}

export default DrawingPoint
