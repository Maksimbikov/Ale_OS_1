import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { Pause, Play, Timer, Square, SkipBack, SkipForward, Music, Video } from 'lucide-react';

const DynamicIsland: React.FC = () => {
  const { 
      activeApp, view, 
      stopwatch, toggleStopwatch, resetStopwatch,
      musicState, playMusic, pauseMusic, nextTrack, prevTrack,
      isRecording, toggleScreenRecording
  } = useOS();
  const [isExpanded, setIsExpanded] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  
  // -- State Logic --
  
  // Stopwatch is active if running OR has accumulated time
  const isStopwatchActive = (stopwatch.isRunning || stopwatch.accumulatedTime > 0);
  // Music is active if playing
  const isMusicActive = musicState.isPlaying;
  
  // Don't show redundant info if app is open
  const isClockOpen = activeApp === AppId.CLOCK;
  const isMusicOpen = activeApp === AppId.MUSIC;
  const isAOD = view === 'ALWAYS_ON';

  // Determine what to show. Priority: Recording > Stopwatch > Music
  const showRecording = isRecording;
  const showStopwatch = isStopwatchActive && !isClockOpen && !isAOD && !showRecording;
  const showMusic = isMusicActive && !isMusicOpen && !isAOD && !showStopwatch && !showRecording;
  
  const isActive = showStopwatch || showMusic || showRecording;

  // Collapse when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (islandRef.current && !islandRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Stopwatch Tick
  const [, setTick] = useState(0);
  useEffect(() => {
    if (stopwatch.isRunning && !isClockOpen) {
      const interval = setInterval(() => setTick(t => t + 1), 30);
      return () => clearInterval(interval);
    }
  }, [stopwatch.isRunning, isClockOpen]);

  // Helpers
  const getStopwatchTime = () => {
    const totalMs = stopwatch.accumulatedTime + (stopwatch.isRunning ? Date.now() - stopwatch.startTime : 0);
    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const ms = Math.floor((totalMs % 1000) / 10);
    
    if (isExpanded) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentSong = () => musicState.trackList[musicState.currentTrackIndex];

  if (isAOD) return null;

  // --- Dimensions ---
  let width = 100;
  let height = 28;
  let borderRadius = 20;

  if (isActive) {
    if (isExpanded) {
      width = 340;
      height = 160; // Slightly taller for music art
      if (showStopwatch || showRecording) height = 80; // Timer/Recording is shorter
      borderRadius = 40;
    } else {
      width = 180;
      height = 36;
    }
  }

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[60] flex justify-center">
      <motion.div
        ref={islandRef}
        layout
        initial={false}
        animate={{ width, height, borderRadius }}
        // Idle Animation: "Reacts like pressed when empty"
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-black overflow-hidden shadow-2xl pointer-events-auto border border-white/5 relative"
        style={{ cursor: 'pointer' }}
        onClick={() => {
           if (isActive) setIsExpanded(!isExpanded);
        }}
      >
        <AnimatePresence mode="wait">
          
          {/* RECORDING MODE */}
          {showRecording && (
            <motion.div 
              key="recording"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col px-1 absolute inset-0"
            >
               <div className={`flex items-center w-full h-full ${isExpanded ? 'justify-between px-6' : 'justify-between px-3'}`}>
                  {/* Left: Info */}
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     {isExpanded && <span className="font-medium text-white text-sm">Screen Recording</span>}
                  </div>
                  
                  {/* Right: Controls */}
                  {isExpanded ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-1.5 rounded-full bg-red-500/20 text-red-500 font-bold text-xs"
                        onClick={(e) => { e.stopPropagation(); toggleScreenRecording(); setIsExpanded(false); }}
                    >
                        STOP
                    </motion.button>
                  ) : (
                     <div className="text-red-500 text-[10px] font-bold tracking-wider">REC</div>
                  )}
               </div>
            </motion.div>
          )}

          {/* STOPWATCH MODE */}
          {showStopwatch && (
            <motion.div 
              key="stopwatch"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col px-1 absolute inset-0"
            >
               <div className={`flex items-center w-full h-full ${isExpanded ? 'justify-between px-6' : 'justify-between px-3'}`}>
                  {/* Left: Time */}
                  <div className="flex items-center gap-3">
                     {!isExpanded && <Timer size={16} className="text-orange-500" />}
                     <div className={`font-mono text-orange-400 font-bold tracking-widest ${isExpanded ? 'text-3xl' : 'text-sm'}`}>
                        {getStopwatchTime()}
                     </div>
                  </div>
                  
                  {/* Right: Controls */}
                  {isExpanded ? (
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white"
                            onClick={(e) => { e.stopPropagation(); resetStopwatch(); setIsExpanded(false); }}
                        >
                            <Square size={16} fill="currentColor" />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-black ${stopwatch.isRunning ? 'bg-orange-500' : 'bg-green-500'}`}
                            onClick={(e) => { e.stopPropagation(); toggleStopwatch(); }}
                        >
                            {stopwatch.isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </motion.button>
                    </div>
                  ) : (
                     <div className="flex items-center gap-2">
                        <div className="text-white/80 p-1">
                           {stopwatch.isRunning ? <div className="animate-pulse w-2 h-2 rounded-full bg-orange-500" /> : <Play size={10} fill="currentColor" className="text-gray-400"/>}
                        </div>
                     </div>
                  )}
               </div>
            </motion.div>
          )}

          {/* MUSIC MODE */}
          {showMusic && (
             <motion.div 
             key="music"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="w-full h-full flex flex-col absolute inset-0"
           >
              {isExpanded ? (
                 /* EXPANDED MUSIC */
                 <div className="flex flex-col w-full h-full p-4">
                    <div className="flex gap-4 items-center">
                        <img src={getCurrentSong().cover} className="w-16 h-16 rounded-xl object-cover bg-gray-800" alt="art" />
                        <div className="flex-1 overflow-hidden">
                           <div className="flex items-center gap-2">
                              <span className="bg-red-500 text-[9px] font-bold px-1 rounded text-white">FUNK</span>
                           </div>
                           <h3 className="text-white font-bold truncate text-lg mt-1">{getCurrentSong().title}</h3>
                           <p className="text-gray-400 text-sm truncate">{getCurrentSong().artist}</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center">
                           <div className="flex gap-1 items-end h-4">
                              <motion.div animate={{ height: [4, 12, 6, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-green-500 rounded-full" />
                              <motion.div animate={{ height: [8, 4, 16, 8, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-green-500 rounded-full" />
                              <motion.div animate={{ height: [12, 8, 4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-green-500 rounded-full" />
                           </div>
                        </div>
                    </div>
                    
                    {/* Controls Row: SkipBack, Stop(Close), SkipForward */}
                    <div className="flex justify-between items-center mt-auto px-6">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); prevTrack(); }}>
                           <SkipBack size={32} fill="currentColor" className="text-white" />
                        </motion.button>
                        
                        {/* STOP BUTTON (Pause & Close) */}
                        <motion.button 
                           whileTap={{ scale: 0.9 }} 
                           onClick={(e) => { 
                               e.stopPropagation(); 
                               pauseMusic(); 
                               setIsExpanded(false); 
                           }}
                           className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10"
                        >
                           <Pause size={28} fill="currentColor" />
                        </motion.button>
                        
                        <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); nextTrack(); }}>
                           <SkipForward size={32} fill="currentColor" className="text-white" />
                        </motion.button>
                    </div>
                 </div>
              ) : (
                 /* COMPACT MUSIC */
                 <div className="flex items-center justify-between w-full h-full px-3">
                    <img src={getCurrentSong().cover} className="w-5 h-5 rounded-sm object-cover" alt="mini-art" />
                    <div className="flex items-center gap-1">
                        <div className="flex gap-0.5 items-end h-3 mx-2">
                              <motion.div animate={{ height: [3, 8, 4, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-green-500 rounded-full" />
                              <motion.div animate={{ height: [5, 3, 10, 5, 5] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-green-500 rounded-full" />
                              <motion.div animate={{ height: [8, 5, 3, 8, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-green-500 rounded-full" />
                        </div>
                    </div>
                 </div>
              )}
           </motion.div>
          )}

          {/* IDLE (No Active State) */}
          {!isActive && (
             <motion.div
               key="idle"
               className="w-full h-full flex items-center justify-center"
             >
                {/* Visual hint that it's interactive if pressed */}
             </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DynamicIsland;