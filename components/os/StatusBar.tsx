import React from 'react';
import { useOS } from '../../context/OSContext';
import { Wifi, Battery, Signal } from 'lucide-react';
import { format } from 'date-fns';

const StatusBar: React.FC = () => {
  const { currentTime, wifiEnabled, view, toggleControlCenter } = useOS();
  const isLockScreen = view === 'LOCK_SCREEN';
  const isAOD = view === 'ALWAYS_ON';

  if (isAOD) return null;

  return (
    <div 
      onClick={toggleControlCenter}
      className={`absolute top-0 left-0 right-0 h-12 flex justify-between items-start pt-3 px-6 text-xs font-semibold z-50 transition-colors duration-300 cursor-pointer ${isLockScreen ? 'text-white' : 'text-white mix-blend-difference'}`}
    >
      <div className="w-16">
        <span>{format(currentTime, 'h:mm')}</span>
      </div>
      
      {/* Spacer for Dynamic Island */}
      <div className="flex-1" />

      <div className="flex items-center space-x-2 w-16 justify-end">
        {wifiEnabled && <Wifi size={14} />}
        <Signal size={14} />
        <Battery size={16} className="fill-current" />
      </div>
    </div>
  );
};

export default StatusBar;