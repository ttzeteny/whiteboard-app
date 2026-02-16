import { useEffect, useState, useRef } from "react";
import "./App.css";

const Board = ({ socket, roomId }) => {
    const canvasRef = useRef(null);
    const historyRef = useRef([]); 
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState("pencil");

    const drawLine = (start, end, ctx, lineColor, width) => {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = lineColor;
        
        ctx.lineCap = "round"; 
        ctx.lineJoin = "round";

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const setCanvasSize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            
            historyRef.current.forEach(line => {
                drawLine(line.prevPoint, line.currentPoint, ctx, line.color, line.width);
            });
        };

        setCanvasSize();

        window.addEventListener('resize', setCanvasSize);

        const handleDrawLine = (data) => {
            historyRef.current.push(data);
            drawLine(data.prevPoint, data.currentPoint, ctx, data.color, data.width);
        };

        const handleHistory = (history) => {
            historyRef.current = history;
            
            history.forEach(line => {
                drawLine(line.prevPoint, line.currentPoint, ctx, line.color, line.width);
            });
        };

        socket.on("draw_line", handleDrawLine);
        socket.on("draw_history", handleHistory);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            socket.off("draw_line", handleDrawLine);
            socket.off("draw_history", handleHistory);
        };
    }, [socket]);

    const prevPoint = useRef(null);

    const onMouseDown = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        prevPoint.current = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        };
    };

    const onMouseMove = (e) => {
        if (!isDrawing || !prevPoint.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentPoint = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        };

        const ctx = canvasRef.current.getContext("2d");

        const drawColor = tool === "eraser" ? "#ffffff" : color;
        const drawWidth = tool === "eraser" ? 20 : lineWidth;

        drawLine(prevPoint.current, currentPoint, ctx, drawColor, drawWidth);

        const lineData = {
            prevPoint: prevPoint.current,
            currentPoint,
            color: drawColor,
            width: drawWidth,
            roomId
        };

        socket.emit("draw_line", lineData);
        historyRef.current.push(lineData);

        prevPoint.current = currentPoint;
    };

    const onMouseUp = () => {
        setIsDrawing(false);
        prevPoint.current = null;
    };

    return (
        <div className="board-container-inner">
            <div className="tools">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                        setTool("pencil");
                    }}
                />
                
                <button 
                    onClick={() => setTool("pencil")}
                    style={{ fontWeight: tool === "pencil" ? "bold" : "normal" }}
                >
                    Pencil
                </button>
                
                <button 
                    onClick={() => setTool("eraser")}
                    style={{ fontWeight: tool === "eraser" ? "bold" : "normal" }}
                >
                    Eraser
                </button>
                
                <input 
                    type="range" min="1" max="20" 
                    value={lineWidth} 
                    onChange={(e) => setLineWidth(e.target.value)} 
                    title="Line Width"
                />
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="whiteboard-canvas"
            />
        </div>
    );
};

export default Board;