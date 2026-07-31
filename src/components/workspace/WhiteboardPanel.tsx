import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolType, WhiteboardElement } from '../../types';
import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle as CircleIcon, 
  ArrowRight, 
  Minus, 
  Type, 
  StickyNote, 
  Trash2, 
  Undo, 
  Redo, 
  Download, 
  Grid,
  MousePointer,
  Sparkles
} from 'lucide-react';

export const WhiteboardPanel: React.FC = () => {
  const { whiteboardElements, setWhiteboardElements, activePartner, showToast } = useApp();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#60a5fa');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Drawing mouse state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Partner Cursor simulation
  const [partnerCursor, setPartnerCursor] = useState<{ x: number; y: number }>({ x: 300, y: 200 });

  // History for Undo/Redo
  const [history, setHistory] = useState<WhiteboardElement[][]>([whiteboardElements]);
  const [historyStep, setHistoryStep] = useState<number>(0);

  // Partner simulated drawing movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerCursor(prev => ({
        x: Math.min(800, Math.max(100, prev.x + (Math.random() - 0.5) * 40)),
        y: Math.min(500, Math.max(80, prev.y + (Math.random() - 0.5) * 40))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Redraw Canvas whenever elements or tool state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 1000;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (if enabled)
    if (showGrid) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Render elements
    whiteboardElements.forEach(el => {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'pen' && el.points && el.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } else if (el.type === 'rectangle' && el.x !== undefined && el.y !== undefined) {
        ctx.strokeRect(el.x, el.y, el.width || 100, el.height || 60);
        if (el.text) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = '12px sans-serif';
          ctx.fillText(el.text, el.x + 10, el.y + 30);
        }
      } else if (el.type === 'circle' && el.x !== undefined && el.y !== undefined) {
        ctx.beginPath();
        ctx.arc(el.x, el.y, (el.width || 50) / 2, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (el.type === 'sticky' && el.x !== undefined && el.y !== undefined) {
        ctx.fillStyle = el.color || '#fef08a';
        ctx.fillRect(el.x, el.y, el.width || 180, el.height || 120);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        const lines = (el.text || '').split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, el.x! + 12, el.y! + 24 + i * 16);
        });
      }
    });

    // Render current active drawing line
    if (isDrawing && currentPath.length > 0) {
      ctx.strokeStyle = activeTool === 'eraser' ? '#0f172a' : color;
      ctx.lineWidth = activeTool === 'eraser' ? 24 : strokeWidth;
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [whiteboardElements, isDrawing, currentPath, color, strokeWidth, showGrid, activeTool]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPath.length > 0) {
      let newElement: WhiteboardElement;

      if (activeTool === 'pen' || activeTool === 'eraser') {
        newElement = {
          id: `w-${Date.now()}`,
          type: activeTool,
          points: currentPath,
          color: activeTool === 'eraser' ? '#0f172a' : color,
          strokeWidth: activeTool === 'eraser' ? 24 : strokeWidth
        };
      } else if (activeTool === 'rectangle' && startPos) {
        const last = currentPath[currentPath.length - 1];
        newElement = {
          id: `w-${Date.now()}`,
          type: 'rectangle',
          x: Math.min(startPos.x, last.x),
          y: Math.min(startPos.y, last.y),
          width: Math.abs(last.x - startPos.x),
          height: Math.abs(last.y - startPos.y),
          color,
          strokeWidth
        };
      } else if (activeTool === 'sticky' && startPos) {
        const stickyText = prompt('Enter Sticky Note Text:', 'Concept Idea / Formula');
        if (!stickyText) return;
        newElement = {
          id: `w-${Date.now()}`,
          type: 'sticky',
          x: startPos.x,
          y: startPos.y,
          width: 180,
          height: 120,
          color,
          strokeWidth: 2,
          text: stickyText
        };
      } else {
        newElement = {
          id: `w-${Date.now()}`,
          type: 'pen',
          points: currentPath,
          color,
          strokeWidth
        };
      }

      const updated = [...whiteboardElements, newElement];
      setWhiteboardElements(updated);
      setHistory(prev => [...prev.slice(0, historyStep + 1), updated]);
      setHistoryStep(prev => prev + 1);
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setWhiteboardElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setWhiteboardElements(history[historyStep + 1]);
    }
  };

  const handleClear = () => {
    if (confirm('Clear entire whiteboard canvas?')) {
      setWhiteboardElements([]);
      showToast('Whiteboard cleared', 'info');
    }
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `StudyConnect_Whiteboard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Exported whiteboard as PNG image!', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Top Floating Whiteboard Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/95 border-b border-slate-800 z-10 backdrop-blur-md">
        
        {/* Drawing Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTool === 'pen' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Pen Tool"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTool === 'eraser' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Eraser Tool"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <button
            onClick={() => setActiveTool('rectangle')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTool === 'rectangle' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Rectangle Tool"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('sticky')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTool === 'sticky' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Sticky Note"
          >
            <StickyNote className="w-4 h-4" />
            <span className="hidden sm:inline">Sticky</span>
          </button>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center gap-2">
          {['#60a5fa', '#34d399', '#fef08a', '#f472b6', '#a78bfa', '#f8fafc'].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
              showGrid ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Background Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="btn-export-whiteboard"
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Image</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Partner Simulated Live Co-drawing Cursor */}
        <div
          className="absolute z-30 flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/90 text-slate-950 font-bold text-[10px] shadow-xl transition-all duration-300 pointer-events-none"
          style={{ left: `${partnerCursor.x}px`, top: `${partnerCursor.y}px` }}
        >
          <MousePointer className="w-3 h-3 text-slate-950 fill-slate-950 animate-bounce" />
          <span>{activePartner?.name.split(' ')[0] || 'Partner'}</span>
        </div>
      </div>
    </div>
  );
};
