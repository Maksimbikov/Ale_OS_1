import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Plus, Minus, Diamond, Layers, Wand2, Settings2, Sparkles, Activity, Upload, Download, Video as VideoIcon, Loader2 } from 'lucide-react';

// --- Types ---
interface Keyframe {
  time: number; // 0 to 100
  value: number;
}

interface PropertyTrack {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  keyframes: Keyframe[];
}

type EasingMode = 'linear' | 'bezier';

// --- Initial Data ---
const INITIAL_TRACKS: PropertyTrack[] = [
  { id: 'x', name: 'Position X', min: -150, max: 150, step: 1, unit: 'px', keyframes: [{ time: 0, value: 0 }, { time: 50, value: 50 }, { time: 100, value: 0 }] },
  { id: 'y', name: 'Position Y', min: -150, max: 150, step: 1, unit: 'px', keyframes: [{ time: 0, value: 0 }, { time: 50, value: -50 }, { time: 100, value: 0 }] },
  { id: 'rotate', name: 'Rotation', min: -360, max: 360, step: 1, unit: '°', keyframes: [{ time: 0, value: 0 }, { time: 100, value: 360 }] },
  { id: 'scale', name: 'Scale', min: 0.1, max: 3, step: 0.1, unit: '', keyframes: [{ time: 0, value: 1 }, { time: 50, value: 1.5 }, { time: 100, value: 1 }] },
  { id: 'opacity', name: 'Opacity', min: 0, max: 100, step: 1, unit: '%', keyframes: [{ time: 0, value: 100 }] },
  { id: 'radius', name: 'Corner', min: 0, max: 50, step: 1, unit: '%', keyframes: [{ time: 0, value: 10 }, { time: 50, value: 50 }, { time: 100, value: 10 }] },
  { id: 'hue', name: 'Color Hue', min: 0, max: 360, step: 1, unit: '°', keyframes: [{ time: 0, value: 240 }, { time: 100, value: 300 }] },
  { id: 'blur', name: 'Blur', min: 0, max: 20, step: 0.5, unit: 'px', keyframes: [{ time: 0, value: 0 }, { time: 50, value: 10 }, { time: 100, value: 0 }] },
];

const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const MotionEditor: React.FC = () => {
  const [tracks, setTracks] = useState<PropertyTrack[]>(INITIAL_TRACKS);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 100
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState<string>('x');
  const [easing, setEasing] = useState<EasingMode>('bezier');
  
  // Video / Media State
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Interpolation Logic ---
  const getValueAtTime = (trackId: string, time: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return 0;
    
    const sortedKeys = [...track.keyframes].sort((a, b) => a.time - b.time);
    
    if (sortedKeys.length === 0) return track.min;
    if (time <= sortedKeys[0].time) return sortedKeys[0].value;
    if (time >= sortedKeys[sortedKeys.length - 1].time) return sortedKeys[sortedKeys.length - 1].value;

    const nextIndex = sortedKeys.findIndex(k => k.time > time);
    const prevKey = sortedKeys[nextIndex - 1];
    const nextKey = sortedKeys[nextIndex];

    const rawProgress = (time - prevKey.time) / (nextKey.time - prevKey.time);
    const progress = easing === 'bezier' ? easeInOutCubic(rawProgress) : rawProgress;

    return prevKey.value + (nextKey.value - prevKey.value) * progress;
  };

  // Helper to get all current values cleanly
  const getCurrentValues = (time: number) => ({
      x: getValueAtTime('x', time),
      y: getValueAtTime('y', time),
      rotate: getValueAtTime('rotate', time),
      scale: getValueAtTime('scale', time),
      opacity: getValueAtTime('opacity', time) / 100,
      radius: getValueAtTime('radius', time),
      hue: getValueAtTime('hue', time),
      blur: getValueAtTime('blur', time),
  });

  // --- Draw Loop ---
  const drawCanvas = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Video Background
    if (videoElementRef.current && videoSrc) {
       const vid = videoElementRef.current;
       // Sync video time to timeline (assuming 5 second loop for simplicity in this demo)
       // If real video, we would map 0-100% to video.duration
       if (!isExporting && vid.duration) { 
          vid.currentTime = (time / 100) * vid.duration; 
       }
       
       // Draw video frame covering canvas (object-cover style)
       const hRatio = canvas.width / vid.videoWidth;
       const vRatio = canvas.height / vid.videoHeight;
       const ratio = Math.max(hRatio, vRatio);
       const centerShift_x = (canvas.width - vid.videoWidth * ratio) / 2;
       const centerShift_y = (canvas.height - vid.videoHeight * ratio) / 2;
       
       ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight, centerShift_x, centerShift_y, vid.videoWidth * ratio, vid.videoHeight * ratio);
    } else {
       // Default Checkerboard Background
       ctx.fillStyle = '#111';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Animated Shape
    const vals = getCurrentValues(time);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    
    // Transform
    ctx.translate(centerX + vals.x, centerY + vals.y);
    ctx.rotate((vals.rotate * Math.PI) / 180);
    ctx.scale(vals.scale, vals.scale);
    ctx.globalAlpha = vals.opacity;
    ctx.filter = `blur(${vals.blur}px)`;

    // Shape (Rectangle with rounded corners simulation)
    const size = 100;
    const half = size / 2;
    
    ctx.beginPath();
    // Simple rounded rect path
    const r = (vals.radius / 100) * half;
    ctx.moveTo(-half + r, -half);
    ctx.lineTo(half - r, -half);
    ctx.quadraticCurveTo(half, -half, half, -half + r);
    ctx.lineTo(half, half - r);
    ctx.quadraticCurveTo(half, half, half - r, half);
    ctx.lineTo(-half + r, half);
    ctx.quadraticCurveTo(-half, half, -half, half - r);
    ctx.lineTo(-half, -half + r);
    ctx.quadraticCurveTo(-half, -half, -half + r, -half);
    ctx.closePath();

    ctx.fillStyle = `hsl(${vals.hue}, 70%, 60%)`;
    ctx.fill();
    
    // Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();

    ctx.restore();
  };

  // --- Animation Loop ---
  useEffect(() => {
    let animationFrame: number;
    
    const loop = () => {
      if (isPlaying && !isExporting) {
        setCurrentTime(prev => {
          if (prev >= 100) return 0;
          return prev + 0.5; // Speed
        });
      }
      // Always draw even if paused
      drawCanvas(currentTime);
      animationFrame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, currentTime, isExporting, tracks, easing, videoSrc]);

  // --- Video Upload ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      
      // Initialize hidden video element
      if (!videoElementRef.current) {
        videoElementRef.current = document.createElement('video');
        videoElementRef.current.crossOrigin = "anonymous";
        videoElementRef.current.muted = true; // Auto-mute to allow play
        videoElementRef.current.loop = true;
      }
      videoElementRef.current.src = url;
      videoElementRef.current.load();
      videoElementRef.current.play().catch(e => console.log("Video preview play error", e));
    }
  };

  // --- Export Logic ---
  const handleExport = async () => {
    if (isExporting || !canvasRef.current) return;
    setIsExporting(true);
    setIsPlaying(false); // Stop UI loop

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ale-motion-${Date.now()}.webm`;
        a.click();
        setIsExporting(false);
    };

    recorder.start();

    // Programmatic Render Loop
    const exportDuration = 5000; // 5 seconds export for this demo
    const fps = 30;
    const totalFrames = (exportDuration / 1000) * fps;
    let frame = 0;
    
    const vid = videoElementRef.current;

    const renderFrame = () => {
        if (frame > totalFrames) {
            recorder.stop();
            return;
        }

        const progress = (frame / totalFrames) * 100;
        
        // Sync video for export
        if (vid && vid.duration) {
            vid.currentTime = (progress / 100) * vid.duration;
        }

        drawCanvas(progress);
        
        frame++;
        requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  // --- Basic Actions ---
  const toggleKeyframe = () => {
    setTracks(prev => prev.map(track => {
      if (track.id !== selectedPropId) return track;
      const currentValue = getValueAtTime(selectedPropId, currentTime);
      const existingKeyIndex = track.keyframes.findIndex(k => Math.abs(k.time - currentTime) < 0.5);
      let newKeys;
      if (existingKeyIndex >= 0) {
        newKeys = track.keyframes.filter((_, i) => i !== existingKeyIndex);
      } else {
        newKeys = [...track.keyframes, { time: currentTime, value: currentValue }];
      }
      return { ...track, keyframes: newKeys };
    }));
  };

  const updateValue = (newValue: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id !== selectedPropId) return track;
      const existingKeyIndex = track.keyframes.findIndex(k => Math.abs(k.time - currentTime) < 1);
      let newKeys = [...track.keyframes];
      if (existingKeyIndex >= 0) {
         newKeys[existingKeyIndex] = { ...newKeys[existingKeyIndex], value: newValue };
      } else {
         newKeys.push({ time: currentTime, value: newValue });
      }
      return { ...track, keyframes: newKeys };
    }));
  };

  const applyShakeEffect = () => {
     setTracks(prev => prev.map(track => {
         if (track.id !== 'x' && track.id !== 'y') return track;
         const newKeys = [{ time: 0, value: 0 }];
         for(let i=5; i<=95; i+=3) {
             newKeys.push({ time: i, value: (Math.random() - 0.5) * 30 });
         }
         newKeys.push({ time: 100, value: 0 });
         return { ...track, keyframes: newKeys };
     }));
  };

  const applyRandomPreset = () => {
     setTracks(prev => prev.map(track => {
         const newKeys = [
             { time: 0, value: track.id === 'scale' ? 1 : 0 },
             { time: 25, value: (Math.random() * (track.max - track.min)) * 0.5 + track.min },
             { time: 50, value: (Math.random() * (track.max - track.min)) * 0.5 + track.min },
             { time: 75, value: (Math.random() * (track.max - track.min)) * 0.5 + track.min },
             { time: 100, value: track.id === 'scale' ? 1 : 0 },
         ];
         return { ...track, keyframes: newKeys };
     }));
  };

  const activeTrack = tracks.find(t => t.id === selectedPropId);
  const activeValue = activeTrack ? getValueAtTime(selectedPropId, currentTime) : 0;
  const hasKeyframeNow = activeTrack?.keyframes.some(k => Math.abs(k.time - currentTime) < 1);

  // Handle Timeline Click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCurrentTime(percentage);
    setIsPlaying(false);
  };

  return (
    <div className="h-full w-full bg-[#121212] text-white flex flex-col font-sans select-none relative">
      <input 
         type="file" 
         accept="video/*" 
         ref={fileInputRef} 
         className="hidden" 
         onChange={handleFileUpload} 
      />

      {/* Export Overlay */}
      {isExporting && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
              <h2 className="text-xl font-bold">Rendering Video...</h2>
              <p className="text-gray-400 text-sm">Please wait</p>
          </div>
      )}
      
      {/* Header */}
      <div className="h-20 border-b border-white/10 flex items-end justify-between px-5 pb-3 bg-[#1e1e1e] pt-4">
         <div className="flex items-center gap-2 mb-1">
            <Layers size={18} className="text-indigo-400"/>
            <span className="font-bold text-base tracking-tight">Project 1</span>
         </div>
         <div className="flex items-center gap-2">
             <button 
                onClick={applyShakeEffect} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition-colors"
             >
                 <Wand2 size={12} className="text-pink-500" />
                 Shake
             </button>
             
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition-colors">
                 <VideoIcon size={12} className="text-blue-400" />
                 Media
             </button>
             
             <div 
               onClick={handleExport}
               className="bg-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5"
             >
                 <Upload size={12} />
                 EXPORT
             </div>
         </div>
      </div>

      {/* Viewport / Canvas */}
      <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
         <canvas 
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full object-contain max-w-[90%] max-h-[90%] shadow-2xl border border-white/10 bg-black"
         />
         
         <div className="absolute bottom-4 right-4 text-xs font-mono bg-black/50 px-2 py-1 rounded text-gray-400 pointer-events-none">
            FRAME: {Math.round(currentTime)}
         </div>
      </div>

      {/* Controls Area */}
      <div className="h-[50%] bg-[#1e1e1e] border-t border-white/10 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-10">
          
          {/* Transport Controls */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#181818]">
              <div className="flex gap-4">
                  <button 
                    onClick={() => setEasing(e => e === 'linear' ? 'bezier' : 'linear')}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded hover:bg-white/10"
                  >
                      <Activity size={12} className={easing === 'bezier' ? 'text-green-400' : 'text-gray-500'} />
                      {easing}
                  </button>
              </div>

              <div className="flex items-center gap-6">
                <ChevronLeft size={20} className="text-gray-400 active:scale-90" onClick={() => setCurrentTime(0)} />
                <button onClick={() => setIsPlaying(!isPlaying)} className="active:scale-90 transition-transform">
                    {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                </button>
                <ChevronRight size={20} className="text-gray-400 active:scale-90" onClick={() => setCurrentTime(100)} />
              </div>
              
              <div className="w-8" /> 
          </div>

          {/* Timeline */}
          <div 
             className="h-14 bg-[#121212] relative cursor-pointer group border-b border-white/5"
             ref={timelineRef}
             onClick={handleTimelineClick}
             onMouseMove={(e) => {
                 if (e.buttons === 1) handleTimelineClick(e);
             }}
          >
             {/* Grid Lines */}
             <div className="absolute inset-0 flex justify-between px-2 opacity-10 pointer-events-none">
                 {[0,1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="w-px h-full bg-white"/>)}
             </div>

             {/* Active Track Visual */}
             <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/10 mx-2 rounded-full overflow-hidden">
                {activeTrack?.keyframes.length && activeTrack.keyframes.length > 1 && (
                     <div 
                        className="absolute top-0 bottom-0 bg-indigo-500/30"
                        style={{ 
                            left: `${activeTrack.keyframes[0].time}%`, 
                            right: `${100 - activeTrack.keyframes[activeTrack.keyframes.length - 1].time}%` 
                        }} 
                     />
                )}
             </div>

             {/* Keyframes */}
             {activeTrack?.keyframes.map((kf, i) => (
                 <div 
                    key={i}
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border transition-colors ${Math.abs(kf.time - currentTime) < 1 ? 'bg-white border-white scale-125 z-20 shadow-[0_0_10px_white]' : 'bg-indigo-600 border-black z-10'}`}
                    style={{ left: `${kf.time}%`, marginLeft: '-6px' }}
                 />
             ))}

             {/* Playhead */}
             <div 
                className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_red]"
                style={{ left: `${currentTime}%` }}
             >
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-red-500 -ml-[4.5px]" />
             </div>
          </div>

          {/* Property Inspector */}
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
              {/* Prop Selector Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {tracks.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSelectedPropId(t.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${selectedPropId === t.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-[#252525] border-transparent text-gray-400 hover:bg-[#333]'}`}
                      >
                          {t.name}
                      </button>
                  ))}
              </div>

              {/* Value Editor */}
              {activeTrack && (
                <div className="bg-[#252525] p-4 rounded-xl flex items-center gap-4 border border-white/5 shadow-inner">
                    <button 
                       onClick={toggleKeyframe}
                       className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all active:scale-95 ${hasKeyframeNow ? 'bg-white border-white text-black' : 'bg-transparent border-white/20 text-gray-400'}`}
                    >
                        <Diamond size={20} className={hasKeyframeNow ? "fill-current" : ""} />
                    </button>

                    <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="flex justify-between items-end">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{activeTrack.name}</span>
                             <span className="text-xl font-bold font-mono text-indigo-400">{activeValue.toFixed(1)} <span className="text-xs text-gray-500">{activeTrack.unit}</span></span>
                        </div>
                        
                        <div className="relative h-6 w-full flex items-center">
                            <input 
                            type="range"
                            min={activeTrack.min}
                            max={activeTrack.max}
                            step={activeTrack.step}
                            value={activeValue}
                            onChange={(e) => updateValue(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-white relative z-10"
                            />
                            <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-indigo-600 rounded-l-lg pointer-events-none"
                                style={{ width: `${((activeValue - activeTrack.min) / (activeTrack.max - activeTrack.min)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <button onClick={() => updateValue(activeValue + activeTrack.step)} className="bg-black/40 w-8 h-8 flex items-center justify-center rounded hover:bg-black/60 active:scale-95"><Plus size={16}/></button>
                        <button onClick={() => updateValue(activeValue - activeTrack.step)} className="bg-black/40 w-8 h-8 flex items-center justify-center rounded hover:bg-black/60 active:scale-95"><Minus size={16}/></button>
                    </div>
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default MotionEditor;