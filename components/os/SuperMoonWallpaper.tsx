import React from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import { OSView } from '../../types';
import { SUPER_EARTH, SUPER_MARS, SUPER_MOON } from '../../constants';

const PLANET_CONFIG = {
  [SUPER_MOON]: {
    image: "https://pngimg.com/d/moon_PNG19.png",
    // Black Background
    glowHome: 'radial-gradient(circle at 80% 30%, rgba(100, 150, 255, 0.15), transparent 60%)',
    lockPosition: { x: "-25%", y: "10%", rotate: 45 },
    homePosition: { x: "40%", y: "-15%", rotate: 100 },
  },
  [SUPER_EARTH]: {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png",
    // Black Background
    glowHome: 'radial-gradient(circle at 80% 30%, rgba(50, 200, 255, 0.2), transparent 60%)',
    lockPosition: { x: "-30%", y: "15%", rotate: -15 }, 
    homePosition: { x: "45%", y: "10%", rotate: -45 },
  },
  [SUPER_MARS]: {
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/3D_Mars.png",
    // Black Background
    glowHome: 'radial-gradient(circle at 80% 30%, rgba(255, 100, 50, 0.2), transparent 60%)',
    lockPosition: { x: "-20%", y: "-10%", rotate: 90 },
    homePosition: { x: "35%", y: "25%", rotate: 160 },
  }
};

const SuperMoonWallpaper: React.FC = () => {
  const { view, wallpaper } = useOS();

  // Determine current planet config, default to Moon if something breaks
  const config = PLANET_CONFIG[wallpaper as keyof typeof PLANET_CONFIG] || PLANET_CONFIG[SUPER_MOON];

  const getVariant = () => {
    switch (view) {
      case OSView.ALWAYS_ON:
        return {
          scale: 0.45,
          x: 0,
          y: -50,
          rotate: 0,
          filter: "brightness(0.6) grayscale(0.5)",
          opacity: 1
        };
      case OSView.LOCK_SCREEN:
        return {
          scale: 1.4,
          x: config.lockPosition.x,
          y: config.lockPosition.y,
          rotate: config.lockPosition.rotate,
          filter: "brightness(0.85) grayscale(0.1)",
          opacity: 1
        };
      case OSView.HOME_SCREEN:
      case OSView.APP_OPEN:
        return {
          scale: 3.2, 
          x: config.homePosition.x,
          y: config.homePosition.y,
          rotate: config.homePosition.rotate,
          filter: "brightness(1) grayscale(0)",
          opacity: 1
        };
      default:
        return { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 };
    }
  };

  return (
    <div className="absolute inset-0 bg-black overflow-hidden z-0">
      {/* Pure Black Background - No image, strict OLED black */}
      <div className="absolute inset-0 bg-black" />

      {/* The Planet */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={false}
        animate={getVariant()}
        transition={{
          duration: 1.4,
          type: "spring",
          stiffness: 70,
          damping: 25,
          mass: 1.2
        }}
      >
        <img 
          src={config.image}
          alt="Super Planet"
          className="w-[360px] h-[360px] object-contain drop-shadow-2xl"
          style={{ willChange: "transform" }}
        />
      </motion.div>
      
      {/* Atmosphere Glow Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
            background: view === OSView.HOME_SCREEN 
                ? config.glowHome
                : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0), transparent 60%)'
        }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default SuperMoonWallpaper;