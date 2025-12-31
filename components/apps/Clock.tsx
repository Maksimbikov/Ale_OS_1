import React from 'react';
import { useOS } from '../../context/OSContext';
import { format } from 'date-fns';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Clock: React.FC = () => {
  const { currentTime, stopwatch, toggleStopwatch, resetStopwatch } = useOS();

  // Helper to format milliseconds
  const getDisplayTime = () => {
    const totalMs = stopwatch.accumulatedTime + (stopwatch.isRunning ? Date.now() - stopwatch.startTime : 0);
    const ms = Math.floor((totalMs % 1000) / 10);
    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: ms.toString().padStart(2, '0')
    };
  };

  const time = getDisplayTime();

  return (
    <div className="h-full w-full bg-black text-white flex flex-col items-center pt-16 px-6">
       
       {/* Main Clock Section */}
       <div className="mb-12 text-center opacity-50 scale-75">
         <div className="text-xl uppercase tracking-widest mb-1 text-gray-500">World Clock</div>
         <div className="text-4xl font-thin tracking-wider">
           {format(currentTime, 'HH:mm')}
         </div>
       </div>

       {/* Stopwatch Section */}
       <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="font-variant-numeric tabular-nums text-7xl font-light tracking-tight mb-12 flex items-baseline">
             <span>{time.min}</span>
             <span className="mx-1">:</span>
             <span>{time.sec}</span>
             <span className="text-4xl text-gray-500 ml-2">.{time.ms}</span>
          </div>

          <div className="flex items-center gap-12">
            {/* Reset Button */}
            <button 
              onClick={resetStopwatch}
              className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 active:scale-95 transition-all"
            >
              <RotateCcw size={24} />
            </button>

            {/* Play/Pause Button */}
            <button 
              onClick={toggleStopwatch}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-lg ${stopwatch.isRunning ? 'bg-red-500/20 text-red-500 ring-2 ring-red-500' : 'bg-green-500/20 text-green-500 ring-2 ring-green-500'}`}
            >
              {stopwatch.isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
          </div>
       </div>
    </div>
  );
};

export default Clock;