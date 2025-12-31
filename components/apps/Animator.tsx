import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Trash2, Eraser, Pen, Layers } from 'lucide-react';

interface Frame {
  id: number;
  data: ImageData | null;
}

const CANVAS_SIZE = 300; // Fixed square size

const AnimatorApp: React.FC = () => {
  // State
  const [frames, setFrames] = useState<Frame[]>([{ id: 1, data: null }]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [showOnion, setShowOnion] = useState(true);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onionCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // --- Canvas Setup ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // High DPI scaling
      const dpr = window.devicePixelRatio || 1;
      // Set actual size in memory (scaled)
      canvas.width = CANVAS_SIZE * dpr;
      canvas.height = CANVAS_SIZE * dpr;
      // Set visible size (css)
      canvas.style.width = `${CANVAS_SIZE}px`;
      canvas.style.height = `${CANVAS_SIZE}px`;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        contextRef.current = ctx;
        
        // Initialize blank frame if needed
        if (frames[0].data === null) {
            const blankData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setFrames(prev => {
                const newFrames = [...prev];
                newFrames[0] = { ...newFrames[0], data: blankData };
                return newFrames;
            });
        } else {
            loadFrameToCanvas(0);
        }
      }
    }

    // Onion setup
    const onion = onionCanvasRef.current;
    if (onion) {
        const dpr = window.devicePixelRatio || 1;
        onion.width = CANVAS_SIZE * dpr;
        onion.height = CANVAS_SIZE * dpr;
        onion.style.width = `${CANVAS_SIZE}px`;
        onion.style.height = `${CANVAS_SIZE}px`;
        const oCtx = onion.getContext('2d');
        if (oCtx) oCtx.scale(dpr, dpr);
    }
  }, []);

  // --- Frame Logic ---
  
  const saveCurrentFrame = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    // Get raw pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setFrames(prev => {
      const newFrames = [...prev];
      if (newFrames[currentFrameIndex]) {
          newFrames[currentFrameIndex] = { ...newFrames[currentFrameIndex], data: imageData };
      }
      return newFrames;
    });
  };

  const loadFrameToCanvas = (index: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;

    // Clear current canvas completely
    // We use the raw width/height to ensure full clear on high DPI
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    // Additional brute force clear for safety due to scaling transforms
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Put data
    const frameData = frames[index]?.data;
    if (frameData) {
      ctx.putImageData(frameData, 0, 0);
    }
  };

  const updateOnionSkin = (index: number) => {
      if (!onionCanvasRef.current) return;
      const ctx = onionCanvasRef.current.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      
      // Clear onion
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();

      if (!showOnion || index === 0) return;

      const prevFrameData = frames[index - 1]?.data;
      if (prevFrameData) {
          ctx.globalAlpha = 0.2; // Lower opacity for better visibility
          
          // We need a temp canvas because putImageData ignores globalAlpha
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = CANVAS_SIZE * dpr;
          tempCanvas.height = CANVAS_SIZE * dpr;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.putImageData(prevFrameData, 0, 0);
            
            // Draw scaled image
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
          }
      }
  };

  // Sync frames when switching
  useEffect(() => {
    loadFrameToCanvas(currentFrameIndex);
    updateOnionSkin(currentFrameIndex);
  }, [currentFrameIndex]);

  // --- Drawing Handlers ---
  
  const getCoordinates = (e: React.PointerEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      
      // Correct for CSS scaling transform on the parent container (PhoneShell)
      // If the app is scaled down, rect.width will be smaller than CANVAS_SIZE (300)
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;

      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      };
  };

  const startDrawing = (e: React.PointerEvent) => {
    if (isPlaying) return;
    if (!contextRef.current || !canvasRef.current) return;
    
    // Capture pointer to track outside canvas
    (e.target as Element).setPointerCapture(e.pointerId);
    
    const { x, y } = getCoordinates(e);

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    contextRef.current.strokeStyle = isEraser ? '#FFFFFF' : brushColor;
    contextRef.current.lineWidth = isEraser ? 20 : brushSize;
    
    // Use destination-out for real transparency eraser, or source-over with white for simple eraser
    // Using white is safer if we don't have a background layer, but destination-out is "real" erasing
    contextRef.current.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    
    isDrawing.current = true;
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing.current || !contextRef.current) return;
    const { x, y } = getCoordinates(e);
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = (e: React.PointerEvent) => {
    if (!isDrawing.current || !contextRef.current) return;
    
    (e.target as Element).releasePointerCapture(e.pointerId);
    
    contextRef.current.closePath();
    isDrawing.current = false;
    
    // Reset composite operation
    contextRef.current.globalCompositeOperation = 'source-over';
    saveCurrentFrame(); 
  };

  // --- Playback ---
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentFrameIndex(prev => {
          const next = prev + 1;
          return next >= frames.length ? 0 : next;
        });
      }, 125); // 8 FPS
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  // --- Actions ---
  const addNewFrame = () => {
    saveCurrentFrame(); // Save current work before adding
    // Create new blank frame
    setFrames(prev => [...prev, { id: Date.now(), data: null }]);
    setCurrentFrameIndex(prev => prev + 1);
  };

  const changeFrame = (index: number) => {
      saveCurrentFrame(); // Save current work before switching
      setCurrentFrameIndex(index);
  };

  const deleteFrame = () => {
    if (frames.length <= 1) {
        // Just clear if it's the only frame
        if (contextRef.current && canvasRef.current) {
            contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
            saveCurrentFrame();
        }
        return;
    }
    const newFrames = frames.filter((_, i) => i !== currentFrameIndex);
    setFrames(newFrames);
    // Go to previous frame or 0
    setCurrentFrameIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col text-white select-none">
      {/* Top Bar - Adjusted Height to be lower */}
      <div className="h-32 bg-[#252525] flex items-end justify-between px-6 pb-6 border-b border-white/5 relative z-30 shadow-lg">
         <div className="text-orange-500 font-black text-2xl italic tracking-tighter">Animator</div>
         <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowOnion(!showOnion)} 
                className={`p-2.5 rounded-xl transition-all active:scale-95 ${showOnion ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                title="Onion Skin"
            >
                <Layers size={22} />
            </button>
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${isPlaying ? 'bg-orange-500 text-white' : 'bg-white text-orange-600'}`}
            >
                {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1"/>}
            </button>
         </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center bg-[#121212] overflow-hidden">
         <div 
            className="relative bg-white shadow-2xl"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
         >
            {/* Onion Skin Layer */}
            <canvas 
                ref={onionCanvasRef}
                className="absolute inset-0 pointer-events-none z-10"
            />
            {/* Drawing Layer */}
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 z-20 touch-none cursor-crosshair"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                // Removed onPointerLeave as it interrupts drawing when going fast near edges
            />
         </div>
         <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-gray-300 pointer-events-none border border-white/10">
            FRAME {currentFrameIndex + 1} / {frames.length}
         </div>
      </div>

      {/* Tools & Timeline */}
      <div className="h-[40%] bg-[#252525] border-t border-white/5 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
         {/* Tools */}
         <div className="flex justify-around items-center p-4 border-b border-white/5">
            <button 
               onClick={() => setIsEraser(false)}
               className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${!isEraser ? 'bg-white/10 text-orange-500' : 'text-gray-400'}`}
            >
                <Pen size={24} />
                <span className="text-[10px] font-medium">Pen</span>
            </button>
            <button 
               onClick={() => setIsEraser(true)}
               className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${isEraser ? 'bg-white/10 text-orange-500' : 'text-gray-400'}`}
            >
                <Eraser size={24} />
                <span className="text-[10px] font-medium">Eraser</span>
            </button>
            
            {/* Color Swatches */}
            <div className="flex gap-3 bg-black/20 p-3 rounded-2xl">
                {['#000000', '#FF4500', '#1E90FF', '#32CD32', '#FFD700'].map(c => (
                    <button 
                        key={c}
                        onClick={() => { setBrushColor(c); setIsEraser(false); }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${brushColor === c && !isEraser ? 'border-white scale-110 shadow-sm' : 'border-transparent scale-95'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>

            <button onClick={deleteFrame} className="text-red-400 p-3 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all">
                <Trash2 size={22} />
            </button>
         </div>

         {/* Timeline */}
         <div className="flex-1 flex items-center px-4 gap-3 overflow-x-auto pb-8 pt-4 scrollbar-hide">
            {frames.map((frame, i) => (
                <button
                    key={frame.id}
                    onClick={() => changeFrame(i)}
                    className={`
                        relative flex-shrink-0 w-16 h-20 bg-white rounded-xl border-2 overflow-hidden transition-all duration-200
                        ${currentFrameIndex === i ? 'border-orange-500 shadow-[0_0_20px_rgba(255,100,0,0.2)] scale-105 z-10' : 'border-transparent opacity-50 hover:opacity-80 scale-95'}
                    `}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-2xl opacity-10 select-none">
                        {i + 1}
                    </div>
                </button>
            ))}
            
            <button 
                onClick={addNewFrame}
                className="flex-shrink-0 w-16 h-20 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-400 transition-all active:scale-95"
            >
                <Plus size={28} />
            </button>
            
            {/* Padding at end */}
            <div className="w-4 flex-shrink-0" />
         </div>
      </div>
    </div>
  );
};

export default AnimatorApp;