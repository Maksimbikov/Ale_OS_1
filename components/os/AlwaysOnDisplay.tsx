import React from 'react';
import { useOS } from '../../context/OSContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AlwaysOnDisplay: React.FC = () => {
  const { currentTime, notifications, wake } = useOS();

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-start pt-20 px-8 text-gray-400 select-none cursor-pointer overflow-hidden"
      onClick={wake}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Floating Container for aesthetics (simulated burn-in protection movement) */}
      <motion.div
        className="w-full"
        animate={{ 
          x: [0, 5, 0, -5, 0],
          y: [0, 10, 0, -10, 0]
        }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Date - Shared Element */}
        <motion.div layoutId="lock-date" className="text-lg font-medium tracking-wide mb-0 text-orange-500/90 ml-1">
          {format(currentTime, 'EEEE, MMMM do')}
        </motion.div>

        {/* Clock - Shared Element */}
        <div className="flex flex-col leading-[0.85] -ml-1">
          <motion.div 
            layoutId="lock-clock-hours"
            className="text-[9rem] font-[150] tracking-tighter bg-gradient-to-br from-orange-200 to-orange-600 bg-clip-text text-transparent"
          >
            {format(currentTime, 'h')}
          </motion.div>
          <motion.div 
            layoutId="lock-clock-minutes"
            className="text-[9rem] font-[150] tracking-tighter bg-gradient-to-br from-white/90 to-white/30 bg-clip-text text-transparent"
          >
            {format(currentTime, 'mm')}
          </motion.div>
        </div>

        {/* Notification Count Pill - Fade in separately */}
        {notifications.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-800/50 backdrop-blur-md"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_3s_ease-in-out_infinite]" />
             <span className="text-xs font-medium text-gray-300">{notifications.length} Notification{notifications.length > 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-gray-800 font-bold tracking-[0.3em] uppercase"
      >
        Designed for Ale OS
      </motion.div>
    </motion.div>
  );
};

export default AlwaysOnDisplay;