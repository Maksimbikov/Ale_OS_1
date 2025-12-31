import React, { useEffect, useState } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { AppId, OSView, AppConfig } from './types';
import { APPS, DOCK_APPS, HOME_APPS, SUPER_MOON, SUPER_EARTH, SUPER_MARS } from './constants';
import StatusBar from './components/os/StatusBar';
import ControlCenter from './components/os/ControlCenter';
import DynamicIsland from './components/os/DynamicIsland';
import AlwaysOnDisplay from './components/os/AlwaysOnDisplay';
import SuperMoonWallpaper from './components/os/SuperMoonWallpaper';
import { ChevronUp, Plane } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, LayoutGroup } from 'framer-motion';
import { format } from 'date-fns';

// --- Constants ---

// Default high-quality spring
const SPRING_TRANSITION = { type: "spring", stiffness: 280, damping: 32, mass: 1 };

// --- Sub-components ---

const LockScreen: React.FC = () => {
  const { currentTime, notifications, unlock, performanceMode } = useOS();
  
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-between py-12 z-20 select-none"
      initial={{ filter: "blur(0px)", opacity: 1 }}
      exit={{ opacity: 0, filter: performanceMode ? "none" : "blur(20px)", transition: { duration: 0.5, ease: "easeOut" } }}
    >
      <div className="flex flex-col items-center mt-12 w-full px-8">
        <motion.div 
          layoutId="lock-date"
          className="text-lg font-medium text-white/90 mb-2"
          transition={SPRING_TRANSITION}
        >
          {format(currentTime, 'EEEE, MMMM do')}
        </motion.div>
        
        <div className="flex flex-col items-center leading-none">
          <motion.div 
            layoutId="lock-clock-hours"
            className="text-8xl font-thin tracking-tighter text-white"
            transition={SPRING_TRANSITION}
          >
             {format(currentTime, 'h')}
          </motion.div>
          <motion.div 
            layoutId="lock-clock-minutes"
            className="text-8xl font-thin tracking-tighter text-white/80"
            transition={SPRING_TRANSITION}
          >
             {format(currentTime, 'mm')}
          </motion.div>
        </div>
      </div>

      <div className="w-full px-6 space-y-2 flex-1 overflow-y-auto mt-4 no-scrollbar">
        {notifications.map(n => (
          <div key={n.id} className={`${performanceMode ? 'bg-gray-800' : 'bg-white/10 backdrop-blur-xl border-white/5'} rounded-2xl p-4 text-white shadow-sm border`}>
             <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md ${APPS[n.appId].color} flex items-center justify-center scale-75`}>
                     {APPS[n.appId].icon}
                  </div>
                  <span className="font-bold text-sm">{APPS[n.appId].name}</span>
               </div>
               <span className="text-[10px] opacity-70">now</span>
             </div>
             <p className="text-sm mt-2 opacity-90 pl-7">{n.message}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-2 mb-8 animate-bounce relative z-30">
        <ChevronUp className="text-white opacity-50" />
        <span className="text-white text-xs opacity-50 font-medium tracking-wider">SWIPE UP TO UNLOCK</span>
      </div>

      <motion.div 
        className="absolute inset-0 z-20"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y < -150 || velocity.y < -500) {
            unlock();
          }
        }}
      />
    </motion.div>
  );
};

interface AppIconProps {
  appId: AppId;
  onClick: () => void;
  isActive?: boolean;
}

const AppIcon: React.FC<AppIconProps> = ({ appId, onClick, isActive }) => {
  const { iconConfig } = useOS();
  const app = APPS[appId];
  const size = iconConfig.size;
  const isDark = iconConfig.style === 'dark';
  const borderRadius = size * 0.26; 
  const bgColorClass = isDark ? 'bg-[#1f1f1f]' : app.color;
  const iconScale = isDark ? 0.8 : 0.9;
  
  const handleClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
       navigator.vibrate(5);
    }
    onClick();
  };
  
  if (isActive) {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 w-full invisible">
         <div style={{ width: size, height: size }} />
         {iconConfig.showLabels && <span className="text-[11px] h-[16px]">Placeholder</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full relative z-10">
      <motion.button 
        layoutId={appId}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        transition={SPRING_TRANSITION}
        className={`
          ${bgColorClass} 
          flex items-center justify-center text-white shadow-md relative overflow-hidden
        `}
        style={{ 
          width: size, 
          height: size,
          borderRadius: borderRadius,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }} 
      >
        <motion.div 
           layoutId={`${appId}-icon`} 
           className="relative z-10"
           style={{ scale: iconScale }}
           transition={SPRING_TRANSITION}
        >
            {app.icon}
        </motion.div>
        
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none" />
        )}
      </motion.button>
      
      {iconConfig.showLabels && (
        <motion.span 
          initial={{ opacity: 1 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[11px] text-white font-medium drop-shadow-md truncate w-full text-center px-1"
        >
          {app.name}
        </motion.span>
      )}
    </div>
  );
};

const HomeScreen: React.FC<{ isBehindApp: boolean }> = ({ isBehindApp }) => {
  const { openApp, activeApp, performanceMode } = useOS();

  return (
    <motion.div 
      className="absolute inset-0 z-10 origin-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ 
        scale: isBehindApp ? 0.92 : 1, 
        borderRadius: isBehindApp ? 32 : 0, 
        opacity: 1
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={SPRING_TRANSITION}
      style={{
        willChange: "transform, opacity, border-radius",
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate'
      }}
    >
      <div className="relative w-full h-full flex flex-col pt-16 pb-6 px-4">
        {/* App Grid */}
        <div className="w-full max-w-[320px] mx-auto flex-1 flex flex-col z-10">
          <div className="grid grid-cols-4 gap-4 mt-2 place-items-center content-start">
            {HOME_APPS.map(id => (
              <AppIcon key={id} appId={id} onClick={() => openApp(id)} isActive={activeApp === id} />
            ))}
          </div>
        </div>

        {/* Dock */}
        <div className="mt-auto px-2 w-full max-w-[340px] mx-auto z-10">
          <div className={`${performanceMode ? 'bg-gray-800' : 'bg-white/10 backdrop-blur-2xl border-white/5'} rounded-[30px] p-3 flex justify-around items-center shadow-lg border`}>
            {DOCK_APPS.map(id => (
              <AppIcon key={id} appId={id} onClick={() => openApp(id)} isActive={activeApp === id} />
            ))}
          </div>
        </div>

        {/* Dimming Overlay */}
        <motion.div 
            className="absolute inset-0 bg-black pointer-events-none z-20"
            initial={false}
            animate={{ opacity: isBehindApp ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const ActiveAppView: React.FC<{ appConfig: AppConfig }> = ({ appConfig }) => {
  const { closeApp, iconConfig } = useOS();
  const y = useMotionValue(0);
  const scale = useTransform(y, [0, 300], [1, 0.5]); 
  const iconRadius = iconConfig.size * 0.26;
  const borderRadius = useTransform(y, [0, 300], [48, 24]);

  return (
    <motion.div 
      layoutId={appConfig.id} 
      className="absolute inset-0 z-40 bg-white overflow-hidden shadow-2xl origin-bottom"
      initial={{ borderRadius: iconRadius }} 
      animate={{ borderRadius: 48 }} 
      exit={{ borderRadius: iconRadius }} 
      transition={SPRING_TRANSITION}
      style={{ 
        y, 
        scale, 
        borderRadius, 
        willChange: "transform, border-radius",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        isolation: "isolate"
      }} 
    >
      <motion.div 
        className="h-full w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.05 } }} 
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
         {appConfig.component}
      </motion.div>

      <motion.div 
         className="absolute bottom-0 left-0 right-0 h-10 z-[60] flex justify-center items-end pb-3 cursor-grab active:cursor-grabbing bg-gradient-to-t from-black/5 to-transparent"
         drag="y"
         dragConstraints={{ top: 0, bottom: 0 }}
         dragElastic={{ top: 0.05, bottom: 0.2 }}
         onDragEnd={(e, { offset, velocity }) => {
            if (offset.y < -50 || velocity.y < -300) {
               closeApp();
            }
         }}
         whileDrag={{ scaleY: 1.2 }}
      >
        <div className="w-32 h-1.5 bg-gray-900/50 backdrop-blur-md rounded-full pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

// --- Main Layout ---

const PhoneShell = () => {
  const { wallpaper, view, toggleSleep, activeApp, brightness, airplaneMode } = useOS();
  const isAOD = view === OSView.ALWAYS_ON;
  const isSuperWallpaper = [SUPER_MOON, SUPER_EARTH, SUPER_MARS].includes(wallpaper);
  
  const showHomeScreen = view === OSView.HOME_SCREEN || view === OSView.APP_OPEN;
  const showLockScreen = view === OSView.LOCK_SCREEN;

  return (
    <div className="relative w-[360px] h-[780px]">
      
      {/* Physical Buttons */}
      <div className="absolute top-24 -right-[6px] h-24 w-1.5 bg-gray-700 rounded-r-md shadow-sm z-0" />
      <button 
        onClick={toggleSleep}
        className="absolute top-56 -right-[6px] h-16 w-1.5 bg-orange-500 rounded-r-md shadow-sm z-50 cursor-pointer active:scale-95 transition-transform" 
        title="Power / Toggle AOD"
      />

      {/* Main Chassis */}
      <div className="relative w-full h-full bg-black rounded-[48px] overflow-hidden shadow-[0_0_0_8px_#1f1f1f,0_0_0_10px_#333,0_20px_50px_rgba(0,0,0,0.5)] transform-gpu">
        
        {/* Dynamic Island */}
        <DynamicIsland />

        {/* Global Brightness Overlay */}
        <div 
            className="absolute inset-0 pointer-events-none z-[100] bg-black transition-opacity duration-300" 
            style={{ opacity: (100 - brightness) / 110 }} 
        />

        {/* Airplane Mode */}
        {airplaneMode && !isAOD && (
            <div className="absolute top-12 right-6 z-40 text-orange-500 animate-pulse pointer-events-none">
                <Plane size={16} />
            </div>
        )}

        {/* Wallpaper Layer */}
        <div className="absolute inset-0 bg-black transition-colors duration-1000">
          {isSuperWallpaper ? (
              <SuperMoonWallpaper />
          ) : (
            <>
              <motion.div 
                className="absolute inset-0 bg-cover bg-center"
                animate={{ opacity: isAOD ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ backgroundImage: `url(${wallpaper})` }} 
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </>
          )}
        </div>

        {/* System UI */}
        <StatusBar />
        <ControlCenter />

        {/* View Router */}
        <LayoutGroup>
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence>
              {showHomeScreen && (
                <HomeScreen key="home" isBehindApp={view === OSView.APP_OPEN} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {activeApp && (
                <ActiveAppView key="active-app" appConfig={APPS[activeApp]} />
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {showLockScreen && <LockScreen key="lock" />}
              {isAOD && <AlwaysOnDisplay key="aod" />}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [scale, setScale] = useState(1);

  // Universal Responsive Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;
      
      const phoneWidth = 380; 
      const phoneHeight = 820; 
      
      const scaleW = availableWidth / phoneWidth;
      const scaleH = availableHeight / phoneHeight;
      
      const newScale = Math.min(scaleW, scaleH, 1.2) * 0.95;
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <OSProvider>
      <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-900 overflow-hidden">
        <motion.div 
          className="relative origin-center"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <PhoneShell />
        </motion.div>
      </div>
    </OSProvider>
  );
};

export default App;