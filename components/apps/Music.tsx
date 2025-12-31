import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, ListMusic, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';

const MusicApp: React.FC = () => {
  const { musicState, playMusic, pauseMusic, nextTrack, prevTrack } = useOS();
  const currentSong = musicState.trackList[musicState.currentTrackIndex];

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col">
       <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-8 opacity-50" />
       
       {/* Album Art */}
       <motion.div 
         key={currentSong.cover} // Re-animate on change
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: musicState.isPlaying ? 1 : 0.9 }}
         transition={{ type: "spring", stiffness: 100, damping: 20 }}
         className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/10 relative"
       >
          <img src={currentSong.cover} className="w-full h-full object-cover" alt="Album" />
       </motion.div>

       {/* Info */}
       <div className="flex justify-between items-end mb-8">
          <div className="flex-1 mr-4">
             <div className="overflow-hidden">
                <h2 className="text-2xl font-bold mb-1 truncate whitespace-nowrap">{currentSong.title}</h2>
             </div>
             <p className="text-gray-400 truncate">{currentSong.artist}</p>
          </div>
          <button className="text-green-500 mb-1 active:scale-90 transition-transform"><Heart fill="currentColor" /></button>
       </div>

       {/* Progress Bar (Visual only for now) */}
       <div className="mb-8">
          <div className="w-full h-1 bg-gray-700 rounded-full mb-2 overflow-hidden">
             <motion.div 
               className="h-full bg-white" 
               initial={{ width: "0%" }}
               animate={{ width: musicState.isPlaying ? "100%" : "30%" }} 
               transition={{ duration: 180, ease: "linear" }}
             />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
             <span>2:14</span>
             <span>4:03</span>
          </div>
       </div>

       {/* Controls */}
       <div className="flex justify-between items-center mb-8">
           <button className="text-gray-400 hover:text-white"><Volume2 size={24} /></button>
           
           <div className="flex items-center gap-6">
              <button onClick={prevTrack} className="text-white hover:scale-110 active:scale-95 transition-transform"><SkipBack size={32} fill="currentColor" /></button>
              <button 
                onClick={musicState.isPlaying ? pauseMusic : playMusic}
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/20"
              >
                 {musicState.isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={nextTrack} className="text-white hover:scale-110 active:scale-95 transition-transform"><SkipForward size={32} fill="currentColor" /></button>
           </div>
           
           <button className="text-gray-400 hover:text-white"><ListMusic size={24} /></button>
       </div>
    </div>
  );
};

export default MusicApp;