import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { Add, ArrowBack, ArrowForward } from '@material-ui/icons';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { action_AddPage, action_SaveNotebook, action_SetCurrentNotebookPage, action_WriteDataToNotebook } from '../../Containers/Application/actions';
import { ActionTypes } from '../../Containers/Application/Actiontypes';
import { BrushSizeChanger, ColorSelector, DcontainCanvas, GridCanvas, GridChecker, SdrawCanvas } from './components';

import "./DrawingPoint.css";

function DrawingPoint2() {
    let currentData = useSelector(state => state.NotebookReducer.current_notebook_data);
    // let currentpage = useSelector(state => state.NotebookReducer.current_page);
    // useEffect(() => {
    // DrawingData = currentData?.filter(el => el.page === currentpage)[0].data;
    // console.log(DrawingData);
    // }, [currentData]);
    return (
        <>
            <CanvasFrame />
        </>
    )
}

const Header = () => {
    let current_page = useSelector(state => state.NotebookReducer.current_page)
    let total_page = useSelector(state => state.NotebookReducer.total_page)
    let doc_data = useSelector(state => state.SdrawReducer.drawingData);
    let current_notebook_name = useSelector(state => state.NotebookReducer.current_notebook_name)
    let doc_name = useSelector(state => state.NotebookReducer.current_notebook_name);
    let current_notebook_data = useSelector(state => state.NotebookReducer.current_notebook_data)
    let dispatch = useDispatch();
    const AddPage = () => {
        dispatch(action_AddPage({ total_page: total_page, current_notebook_data: current_notebook_data, doc_name: doc_name }))
        // dispatch({
        //     type: ActionTypes.setNotebookTotalPage,
        //     payload: total_page + 1,
        // })
    }
    const BackPage = () => {
        // let x = current_notebook_data;
        // let index;
        // console.dir(x);
        // index = x.findIndex(t => t.page === current_page);
        // console.dir(index);
        // x[index].data = JSON.stringify(doc_data);
        // console.dir(x);

        dispatch(action_SaveNotebook({
            current_page: current_page,
            total_page: total_page,
            data: current_notebook_data,
            doc_name: doc_name,
            doc_data: doc_data,
        }));
        let page = current_page - 1;
        if (page <= 0) {
            return;
        }
        dispatch(action_SetCurrentNotebookPage({
            current_notebook_name: current_notebook_name,
            page: page,
        }));

    }
    const ForwardPage = () => {
        dispatch(action_SaveNotebook({
            current_page: current_page,
            total_page: total_page,
            data: current_notebook_data,
            doc_name: doc_name,
            doc_data: doc_data,
        }));
        let page = current_page + 1;
        if (page > total_page) {
            return;
        }
        dispatch(action_SetCurrentNotebookPage({
            current_notebook_name: current_notebook_name,
            page: page,
        }));

    }
    return <React.Fragment>
        <Grid container className="d_headeronly" alignContent='center' justify='space-between' style={{ color: "white", padding: "0 20px" }}>
            <Grid item>
                <Grid container alignItems='center' style={{ height: "100%" }}>
                    <Grid item>
                        <Typography variant='subtitle1'>{current_notebook_name}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item >
                <Grid container alignItems='center' justify='center' direction='row'>
                    <Grid item>
                        {/* <Button>Left</Button> */}
                        <IconButton onClick={BackPage} style={{ color: "white" }}>
                            <ArrowBack />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ margin: "0 6px" }}>
                        <Grid container alignItems='center' direction='row' style={{ height: "100%" }}>
                            <Grid item>
                                <Typography variant='subtitle1'>{current_page} / {total_page}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {/* <Button>Right</Button> */}
                        <IconButton onClick={ForwardPage} style={{ color: "white" }}>
                            <ArrowForward />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <IconButton onClick={AddPage} style={{ color: "white" }}>
                    <Add />
                </IconButton>
            </Grid>
        </Grid>
    </React.Fragment>;
}
const Footer = () => {
    const dispatch = useDispatch();
    let current_page = useSelector(state => state.NotebookReducer.current_page);
    let doc_name = useSelector(state => state.NotebookReducer.current_notebook_name);
    let total_page = useSelector(state => state.NotebookReducer.total_page)
    let doc_data = useSelector(state => state.SdrawReducer.drawingData);
    let current_notebook_data = useSelector(state => state.NotebookReducer.current_notebook_data)
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
        dispatch(action_SaveNotebook({ current_page: current_page, total_page: total_page, data: current_notebook_data, doc_name: doc_name, doc_data: doc_data }));
        alert(`Document Saved`);
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
    let current_page = useSelector(state => state.NotebookReducer.current_page);
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
            // console.dir(fetchedData);
            dispatch({
                type: ActionTypes.setSdrawCanvasDrawingData,
                payload: { fetchedData, current_page, },
            })
        }
    }, [fetchedData]);
    useEffect(() => {
        window.addEventListener('resize', Resize);
        return () => {
            window.removeEventListener('resize', Resize);
        }
    }, []);

    return <>
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
    </>;
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
