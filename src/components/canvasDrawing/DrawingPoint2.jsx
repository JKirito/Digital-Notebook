import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { action_SaveNotebook, action_WriteDataToNotebook } from '../../Containers/Application/actions';
import { ActionTypes } from '../../Containers/Application/Actiontypes';
import { BrushSizeChanger, ColorSelector, DcontainCanvas, GridCanvas, GridChecker, SdrawCanvas } from './components';

import "./DrawingPoint.css";


function DrawingPoint2() {
    let currentData = useSelector(state => state.NotebookReducer.current_notebook_data);
    // let currentpage = useSelector(state => state.NotebookReducer.current_page);
    useEffect(() => {
        // DrawingData = currentData?.filter(el => el.page === currentpage)[0].data;
        // console.log(DrawingData);
    }, [currentData]);
    return (
        <>
            <CanvasFrame />
        </>
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
const Footer = () => {
    const dispatch = useDispatch();
    let current_page = useSelector(state => state.NotebookReducer.current_page);
    let doc_name = useSelector(state => state.NotebookReducer.current_notebook_name);
    let doc_data = useSelector(state => state.SdrawReducer.drawingData);
    let canvasMaxBoundryHeight = useSelector(state => state.CanvasReducer.maxBoundryHeight);
    let canvasMaxBoundryWidth = useSelector(state => state.CanvasReducer.maxBoundryWidth);
    const ActivateEraser = () => {
        dispatch({
            type: ActionTypes.changeOperationToEraser,
        })
        let eraserButton = document.getElementById("eraserbutton");
        removeAllActiveClassesFromTools();
        eraserButton.classList.add("d_iconActive");
    }
    const ActivateDrawBrush = () => {
        dispatch({
            type: ActionTypes.changeOperationToDraw,
        })
        let drawButton = document.getElementById("drawbutton");
        // console.log(document.getElementById("drawbutton").classList);
        removeAllActiveClassesFromTools();
        drawButton.classList.add("d_iconActive");
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
    const ExportPdf = () => {
        let exportButton = document.getElementById("exportbutton");
        removeAllActiveClassesFromTools();
        exportButton.classList.add("d_iconActive");
        let drawCanvas = document.getElementById("d_dcontaincanvas");
        let dlink = document.createElement("a");
        let ss = drawCanvas.toDataURL("image/png");
        dlink.setAttribute("download", "draw.png");
        dlink.setAttribute("href", ss);
        dlink.click();
        // console.log("Download")
    }
    const SaveDocument = () => {
        let saveButton = document.getElementById("savebutton");
        removeAllActiveClassesFromTools();
        saveButton.classList.add("d_iconActive");
        dispatch(action_SaveNotebook({ current_page: current_page, data: JSON.stringify(doc_data), doc_name: doc_name }));
    }
    const undoCanvas = () => {
        dispatch({
            type: ActionTypes.undoSdrawCanvasDrawingData,
        })
    }

    const clearCanvas = () => {
        let clearButton = document.getElementById("clearbutton");
        removeAllActiveClassesFromTools();
        clearButton.classList.add("d_iconActive");
        let canvas = document.getElementById('d_dcontaincanvas');
        let canvasctx = canvas?.getContext('2d');
        canvasctx.clearRect(0, 0, canvasMaxBoundryWidth, canvasMaxBoundryHeight);
        dispatch({
            type: ActionTypes.setSdrawCanvasDrawingData,
            payload: [{ data: [] }],
        })
    }

    useEffect(() => {
        ActivateDrawBrush();
    }, []);
    return <div className="d_headerfooterbasic d_footer d_iconcolor">
        <div className="d_iconContainer" id="drawbutton" onClick={ActivateDrawBrush}>
            <i className="fas fa-highlighter fa-lg"></i>
        </div>
        <div className="d_iconContainer" id="eraserbutton" onClick={ActivateEraser}>
            <i className="fas fa-eraser fa-lg"></i>
        </div>

        <div className='d_footerplus' id="add" onClick={undoCanvas}>
            <i className="fas fa-undo fa-lg"></i>
        </div>

        <div className="d_iconContainer" id="savebutton" onClick={() => { SaveDocument() }}>
            <i className="fas fa-save fa-lg"></i>
        </div>
        {/* <div className="d_iconContainer" id="exportbutton" onClick={ExportPdf}>
            <i className="fas fa-file-export fa-lg"></i>
        </div> */}
        <div className="d_iconContainer" id="clearbutton" onClick={clearCanvas}>
            <i className="fas fa-trash fa-lg"></i>
        </div>
    </div >;
}




const CanvasFrame = () => {

    // Usable References 
    // let currentpage = useSelector(state => state.NotebookReducer.current_page);
    // let drawingData = useSelector(state => {
    //     return state.NotebookReducer.current_notebook_data?.filter(el => el.page === currentpage)[0].data;
    // });
    // let canvasWidth = useSelector(state => state.CanvasReducer.canvasWidth);
    // let canvasHeight = useSelector(state => state.CanvasReducer.canvasHeight);
    let dispatch = useDispatch();
    let fetchedData = useSelector(state => state.NotebookReducer.current_notebook_data);
    const Resize = () => {
        dispatch({
            type: ActionTypes.updateCanvasDimensions,
            payload: {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
    }
    useEffect(() => {
        if (fetchedData) {
            dispatch({
                type: ActionTypes.setSdrawCanvasDrawingData,
                payload: fetchedData,
            })
        }
    }, [fetchedData]);
    useEffect(() => {
        window.addEventListener('resize', Resize);
        return () => {
            window.removeEventListener('resize', Resize);
        }
    }, []);

    return <div>
        <Header />
        <div>
            <SdrawCanvas />
            <DcontainCanvas />
            <GridCanvas />
            <div className="d_toollist">
                <ColorSelector />
                <BrushSizeChanger />
                <GridChecker />
            </div>
        </div>
        <Footer />
    </div>;
}

//__________________________     COMPONENTS     _____________________________ //

// function Canvas() {
//     const [dimensions, setDimensions] = useState({
//         width: window.innerWidth,
//         height: window.innerHeight,
//     });
//     const sdrawcanvasRef = useRef();
//     const dcontaincanvasRef = useRef();
//     return (
//         <div>
//             <canvas className="d_sdrawcanvas" ref={sdrawcanvasRef} id="d_sdrawcanvas" width={dimensions.width} height={dimensions.height}></canvas>
//             <canvas className="d_dcontaincanvas" ref={dcontaincanvasRef} id="d_dcontaincanvas" width={dimensions.width} height={dimensions.height}></canvas>
//         </div>
//     );
// }


export default DrawingPoint2;
