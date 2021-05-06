import React, { useRef, useState, useEffect } from 'react'
import './Drawing.css';
import img from "./brushes/t1.png";

var canvasConfigurations = {
    brushColor: "blue",
    brushRadius: 15,
    currentBrush: undefined,
}

function Drawing() {
    return (
        <div>
            <Header />
            <CanvasFrame />
            <Footer />
        </div>
    )
}

const Header = () => {
    return <React.Fragment>
        <div className="d_headerfooter">
            <div className="d_pagenav">
                5/10
            </div>
        </div>
    </React.Fragment>;
}
const Footer = () => {
    return <div className="d_headerfooter d_footer d_iconcolor">
        <i className="fas fa-highlighter fa-lg"></i>
        <i className="fas fa-eraser fa-lg"></i>

        <div className='d_footerplus'>
            <i className="fas fa-plus fa-lg"></i>
        </div>

        <i className="fas fa-file-export fa-lg"></i>
        <i className="fas fa-trash fa-lg"></i>
    </div>;
}

function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}
function imgToValidImg(image) {
    brush.src = image;
    canvasConfigurations.currentBrush = brush;
}
var lastPoint, isDrawing;
var tempCoords;
var brush = new Image();

const CanvasFrame = () => {

    // Usable References 

    let canvasRef = useRef(undefined);
    var colorRef = useRef(undefined)
    const marginTop = 48;
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight - (marginTop * 2),
    });
    let pointData = [];
    let mobile = false;
    // let tcanvas = canvasRef.current;
    // let tcanvasctx = tcanvas.getContext("2d");
    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        let tcanvas = canvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");

        var currentPoint;
        if (!mobile) {
            currentPoint = {
                x: e.clientX,
                y: e.clientY - marginTop,
            }
        } else {
            currentPoint = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY - marginTop,
            }
        }
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);
        let x, y;
        for (let i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - canvasConfigurations.brushRadius;
            y = lastPoint.y + (Math.cos(angle) * i) - canvasConfigurations.brushRadius;
            x = ~~(x + 0.5);
            y = ~~(y + 0.5);
            if (canvasConfigurations.currentBrush.width === canvasConfigurations.brushRadius) {
                tcanvasctx.drawImage(canvasConfigurations.currentBrush, x, y);
                // console.log("Not Scaling")
            } else {
                tcanvasctx.drawImage(canvasConfigurations.currentBrush, x, y, canvasConfigurations.brushRadius, canvasConfigurations.brushRadius);
                // console.log(`Scaling ${canvasConfigurations.currentBrush.width}, ${canvasConfigurations.brushRadius}`)
                // console.log(canvasConfigurations.currentBrush.width)
            }
            // tcanvasctx.beginPath();
            // tcanvasctx.fillStyle = "red";
            // tcanvasctx.arc(x, y, 5, 0, Math.PI * 2, false);
            // tcanvasctx.fill();
            // tcanvasctx.closePath();
            pointData.push({ x: x, y: y, brushSize: canvasConfigurations.brushRadius, brushColor: canvasConfigurations.brushColor });
            // console.log(pointData)
        }
        lastPoint = currentPoint;
    }

    const redraw = () => {
        // console.log("Resizing");
        let tcanvas = canvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");
        tcanvasctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        tcanvasctx.rect(0, 0, window.innerWidth, window.innerHeight);
        tcanvasctx.fill();
        if (pointData) {
            for (let i in pointData) {
                if (pointData[i].brushColor !== canvasConfigurations.brushColor) {
                    changeBrushColor(undefined, pointData[i].brushColor);
                }
                tcanvasctx.drawImage(brush, pointData[i].x, pointData[i].y, pointData[i].brushSize, pointData[i].brushSize);
                // tcanvasctx.arc(pointData[i].x, pointData[i].y, 5, 0, Math.PI * 2, false);
            }
        }
    }
    const drawAtPoint = ({ x, y }) => {
        let tcanvas = canvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");
        tcanvasctx.drawImage(brush, x, y, canvasConfigurations.brushRadius, canvasConfigurations.brushRadius);
    }
    const AddListeners = () => {
        window.addEventListener("resize", (e) => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - (marginTop * 2),
            });
            redraw();
        })
        let tcanvas = canvasRef.current;
        let tcanvasctx = tcanvas.getContext("2d");

        // Temporary Black Background Canvas
        tcanvasctx.rect(0, 0, window.innerWidth, window.innerHeight);
        tcanvasctx.fill();

        // Adding Canvas Listeners
        tcanvas.addEventListener("mousedown", (e) => {
            isDrawing = true;
            lastPoint = { x: e.clientX, y: e.clientY - marginTop };
            tempCoords = { x: e.clientX, y: e.clientY - marginTop };
            tcanvas.addEventListener("mousemove", draw);
        })
        tcanvas.addEventListener("touchstart", (e) => {
            isDrawing = true;
            mobile = true;
            lastPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY - marginTop };
            tcanvas.addEventListener("touchmove", draw);
        })
        tcanvas.addEventListener("mouseup", (e) => {
            if (tempCoords.x === e.clientX && tempCoords.y === e.clientY - marginTop) {
                drawAtPoint({ x: e.clientX, y: e.clientY - marginTop });
            }
            tcanvas.removeEventListener("mousemove", draw);
        })
        tcanvas.addEventListener("touchend", (e) => {
            mobile = false;
            tcanvas.removeEventListener("touchmove", draw);
        })
        imgToValidImg(img);
    }

    const LoadDefaultConfiguration = () => { };
    useEffect(() => {
        AddListeners();
        LoadDefaultConfiguration();
    }, []);

    const changeBrushColor = (e, brushcolor) => {
        if (e !== undefined) {
            canvasConfigurations.brushColor = e.target.value;
            imgToValidImg(e.target.value);
        }
        if (brushcolor) {
            canvasConfigurations.brushColor = brushcolor;
            imgToValidImg(brushcolor);
        }
        let ccanvas = colorRef.current;
        let ccanvasctx = ccanvas.getContext("2d");
        ccanvasctx.clearRect(0, 0, canvasConfigurations.brushRadius, canvasConfigurations.brushRadius);
        let t1 = new Image();
        t1.src = img;
        ccanvasctx.rect(0, 0, canvasConfigurations.brushRadius, canvasConfigurations.brushRadius);
        ccanvasctx.fill();
        ccanvasctx.save();
        ccanvasctx.fillStyle = canvasConfigurations.brushColor;
        ccanvasctx.globalCompositeOperation = "destination-in";
        ccanvasctx.drawImage(t1, 0, 0, canvasConfigurations.brushRadius, canvasConfigurations.brushRadius);
        ccanvasctx.globalCompositeOperation = "source-over";
        let newimg = ccanvas.toDataURL("image/png");
        // ccanvasctx.restore();
        imgToValidImg(newimg);
    }
    return <div>
        <div className="d_canvascontainer">
            <canvas className="d_drawcanvas" ref={canvasRef} width={dimensions.width} height={dimensions.height}></canvas>
            <canvas ref={colorRef} className="d_hide" width={canvasConfigurations.brushRadius} height={canvasConfigurations.brushRadius}></canvas>
            <input type="color" className="d_cpick" onInput={changeBrushColor} onChange={changeBrushColor} />
        </div>
    </div>;
}

export default Drawing
