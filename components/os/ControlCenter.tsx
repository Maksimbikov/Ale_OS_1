import React from 'react';
import { useOS } from '../../context/OSContext';
import { Wifi, Bluetooth, Sun, Volume2, Flashlight, Plane, Moon, RotateCw, Signal, Play, Pause, SkipForward, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ControlCenter: React.FC = () => {
  const { 
    isControlCenterOpen, toggleControlCenter, 
    wifiEnabled, toggleWifi, 
    bluetoothEnabled, toggleBluetooth,
    airplaneMode, toggleAirplaneMode,
    flashlightEnabled, toggleFlashlight,
    doNotDisturb, toggleDoNotDisturb,
    rotationLock, toggleRotationLock,
    isRecording, toggleScreenRecording,
    brightness, setBrightness,
    volume, setVolume,
    musicState, playMusic, pauseMusic, nextTrack
  } = useOS();

  const currentSong = musicState.trackList[musicState.currentTrackIndex];

  // Helper for toggle buttons
  const ToggleButton = ({ icon: Icon, isActive, onClick, colorClass = "bg-blue-500 text-white" }: any) => (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`aspect-square rounded-full flex items-center justify-center transition-all shadow-sm ${isActive ? colorClass : 'bg-gray-700/50 text-gray-400'}`}
    >
      <Icon size={20} />
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isControlCenterOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleControlCenter}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ y: -500, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -500, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute top-2 left-2 right-2 bg-gray-900/90 backdrop-blur-xl rounded-[32px] p-4 z-50 text-white shadow-2xl border border-white/10"
          >
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Connectivity Group */}
              <div className="bg-gray-800/50 rounded-3xl p-3 grid grid-cols-2 gap-3">
                <ToggleButton 
                   icon={Wifi} 
                   isActive={wifiEnabled} 
                   onClick={toggleWifi} 
                />
                <ToggleButton 
                   icon={Bluetooth} 
                   isActive={bluetoothEnabled} 
                   onClick={toggleBluetooth} 
                />
                <ToggleButton 
                   icon={Plane} 
                   isActive={airplaneMode} 
                   onClick={toggleAirplaneMode}
                   colorClass="bg-orange-500 text-white" 
                />
                <ToggleButton 
                   icon={Signal} 
                   isActive={true} 
                   onClick={() => {}} // Mock cellular
                   colorClass="bg-green-500 text-white" 
                />
              </div>

              {/* Media Controls */}
              <div className="bg-gray-800/50 rounded-3xl p-3 flex flex-col justify-between overflow-hidden relative">
                 {musicState.isPlaying && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                        className="absolute inset-0"
                     >
                         <img src={currentSong.cover} className="w-full h-full object-cover blur-md" alt="bg" />
                     </motion.div>
                 )}
                
                <div className="flex items-center gap-2 text-xs text-gray-400 relative z-10">
                   <motion.div 
                      animate={musicState.isPlaying ? { rotate: 360 } : {}} 
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   >
                     <Disc size={14} /> 
                   </motion.div>
                   <span>Now Playing</span>
                </div>
                
                <div className="relative z-10 my-1">
                    <div className="text-sm font-bold truncate leading-tight">{currentSong.title}</div>
                    <div className="text-[10px] text-gray-400 truncate">{currentSong.artist}</div>
                </div>
                
                <div className="flex justify-between items-center mt-auto relative z-10">
                   <motion.button whileTap={{ scale: 0.8 }} onClick={musicState.isPlaying ? pauseMusic : playMusic}>
                       {musicState.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                   </motion.button>
                   <motion.button whileTap={{ scale: 0.8 }} onClick={nextTrack}>
                       <SkipForward size={24} fill="currentColor" />
                   </motion.button>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-gray-800/50 rounded-3xl p-4 mb-4 space-y-5">
              <div className="flex items-center gap-3">
                <Sun size={20} className="text-gray-400 flex-shrink-0" />
                <div className="relative flex-1 h-10 rounded-full bg-gray-700/50 overflow-hidden">
                    <div 
                        className="absolute inset-y-0 left-0 bg-white" 
                        style={{ width: `${brightness}%` }}
                    />
                    <input 
                      type="range" 
                      min="10" max="100" 
                      value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-gray-400 flex-shrink-0" />
                <div className="relative flex-1 h-10 rounded-full bg-gray-700/50 overflow-hidden">
                    <div 
                        className="absolute inset-y-0 left-0 bg-white" 
                        style={{ width: `${volume}%` }}
                    />
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
              </div>
            </div>

            {/* Toggles Row */}
            <div className="grid grid-cols-4 gap-3">
               <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFlashlight}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-colors ${flashlightEnabled ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-gray-800/50'}`}
               >
                 <Flashlight size={24} fill={flashlightEnabled ? "currentColor" : "none"} />
               </motion.button>
               
               <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRotationLock}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-colors ${rotationLock ? 'bg-white text-red-500' : 'bg-gray-800/50'}`}
               >
                 <RotateCw size={24} className={rotationLock ? '' : 'text-white'} />
               </motion.button>
               
               <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDoNotDisturb}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-colors ${doNotDisturb ? 'bg-purple-600 text-white' : 'bg-gray-800/50'}`}
               >
                 <Moon size={24} fill={doNotDisturb ? "currentColor" : "none"} />
               </motion.button>
               
               <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleScreenRecording}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-colors bg-gray-800/50`}
               >
                 <div className={`rounded-full border-2 border-white flex items-center justify-center w-8 h-8`}>
                    <motion.div 
                        animate={isRecording ? { scale: [1, 0.8, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`w-full h-full rounded-full scale-75 ${isRecording ? 'bg-red-500 rounded-sm scale-50' : 'bg-red-500'}`} 
                    />
                 </div>
               </motion.button>
            </div>
            
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-4" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ControlCenter;