import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AppId, OSView, Notification, IconConfig, MusicState, Song, OSContextType, StopwatchState } from '../types';
import { WALLPAPERS } from '../constants';

// Playlist with User's requested Phonk/Funk titles
const TRACKS: Song[] = [
  {
    title: "MONTAGEM REBOLA",
    artist: "DJ Mandy / RXDX VILAO",
    url: "https://cdn.discordapp.com/attachments/1350380777774256138/1455700976961982546/5mnukIQFwx8LXVNLRAMTtXR4-ahomuY.m4a?ex=6955aeae&is=69545d2e&hm=d9f62cf59735f8842fb495237e5a54a1bf293448de4f0512941000c10ebed76b&", 
    cover: "https://img.youtube.com/vi/xcNLg8Thkh0/hqdefault.jpg" 
  },
  {
    title: "sem nada",
    artist: "Phonk Edition",
    url: "https://cdn.discordapp.com/attachments/1350380777774256138/1455700879226437843/fKYZJMON5IOttt8suRkj9LuXLWhyjl8.m4a?ex=6955ae97&is=69545d17&hm=93b0a3cf4b06784fbd015aa52f98c9a309ad87a704e9302d86b162947773605a&", 
    cover: "https://img.youtube.com/vi/7HUWFDfj97Y/hqdefault.jpg"
  },
  {
    title: "Montagem - Volte Sempre",
    artist: "Slowed + Reverb",
    url: "https://cdn.discordapp.com/attachments/1350380777774256138/1455701241215848448/kZUdYxzSW3CW1aJRNI7FBv96IljoKkg.m4a?ex=6955aeed&is=69545d6d&hm=9359b165fd00d92296433338a27b1cc1a40896796cd3854572319490a6a50836&",
    cover: "https://img.youtube.com/vi/Bv96IljoKkg/hqdefault.jpg" 
  },
  {
    title: "BAD HAPPENING FUNK",
    artist: "Brazilian Phonk",
    url: "https://cdn.discordapp.com/attachments/1350380777774256138/1455700524342050897/xWpEls7Oqb4mzWTin65Bz15uWVY-DfE.m4a?ex=6955ae42&is=69545cc2&hm=6049f7147e6f1ce82d2465e3ba3472dcb78776de7e7607474dabf3a0b65c5e8c&",
    cover: "https://img.youtube.com/vi/z15uWVY-DfE/hqdefault.jpg" 
  }
];

// Helper for LocalStorage
const getStorage = <T,>(key: string, initial: T): T => {
  try {
    const saved = localStorage.getItem(`ale-os-${key}`);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    return initial;
  }
};

const setStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(`ale-os-${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save to localStorage", e);
  }
};

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<OSView>(OSView.LOCK_SCREEN);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  
  // Persisted States
  const [wallpaper, setWallpaper] = useState(() => getStorage('wallpaper', WALLPAPERS[0]));
  const [brightness, setBrightness] = useState(() => getStorage('brightness', 100));
  const [volume, setVolume] = useState(() => getStorage('volume', 75));
  
  // Toggles Persisted
  const [wifiEnabled, setWifiEnabled] = useState(() => getStorage('wifi', true));
  const [bluetoothEnabled, setBluetoothEnabled] = useState(() => getStorage('bluetooth', true));
  const [airplaneMode, setAirplaneMode] = useState(false); // Usually resets on reboot
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(() => getStorage('dnd', false));
  const [rotationLock, setRotationLock] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Performance Mode
  const [performanceMode, setPerformanceMode] = useState(() => getStorage('performanceMode', false));

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  // Icon Customization Defaults Persisted
  const [iconConfig, setIconConfigState] = useState<IconConfig>(() => getStorage('iconConfig', {
    size: 60,
    style: 'standard',
    showLabels: true
  }));

  // Save Effects
  useEffect(() => setStorage('wallpaper', wallpaper), [wallpaper]);
  useEffect(() => setStorage('brightness', brightness), [brightness]);
  useEffect(() => setStorage('volume', volume), [volume]);
  useEffect(() => setStorage('wifi', wifiEnabled), [wifiEnabled]);
  useEffect(() => setStorage('bluetooth', bluetoothEnabled), [bluetoothEnabled]);
  useEffect(() => setStorage('dnd', doNotDisturb), [doNotDisturb]);
  useEffect(() => setStorage('iconConfig', iconConfig), [iconConfig]);
  useEffect(() => setStorage('performanceMode', performanceMode), [performanceMode]);

  const setIconConfig = (newConfig: Partial<IconConfig>) => {
    setIconConfigState(prev => ({ ...prev, ...newConfig }));
  };

  // Stopwatch State
  const [stopwatch, setStopwatch] = useState<StopwatchState>({ isRunning: false, startTime: 0, accumulatedTime: 0 });
  const stopwatchIntervalRef = useRef<number | null>(null);

  // Music State
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false,
    currentTrackIndex: 0,
    trackList: TRACKS
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    audioRef.current = new Audio(TRACKS[0].url);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync Audio with State
  useEffect(() => {
    if (!audioRef.current) return;
    const currentUrl = TRACKS[musicState.currentTrackIndex].url;
    
    if (audioRef.current.src !== currentUrl) {
      audioRef.current.src = currentUrl;
      audioRef.current.load();
      if (musicState.isPlaying) {
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    } else {
        if (musicState.isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [musicState.isPlaying, musicState.currentTrackIndex]);

  // Handle Volume Change
  useEffect(() => {
      if(audioRef.current) {
          audioRef.current.volume = volume / 100;
      }
  }, [volume]);

  const playMusic = () => setMusicState(prev => ({ ...prev, isPlaying: true }));
  const pauseMusic = () => setMusicState(prev => ({ ...prev, isPlaying: false }));
  
  const nextTrack = () => {
    setMusicState(prev => {
        const next = (prev.currentTrackIndex + 1) % prev.trackList.length;
        return { ...prev, currentTrackIndex: next };
    });
  };

  const prevTrack = () => {
    setMusicState(prev => {
        const next = prev.currentTrackIndex === 0 ? prev.trackList.length - 1 : prev.currentTrackIndex - 1;
        return { ...prev, currentTrackIndex: next };
    });
  };

  // Clock tick
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch Logic
  useEffect(() => {
    if (stopwatch.isRunning) {
      stopwatchIntervalRef.current = window.setInterval(() => {
        setStopwatch(prev => ({ ...prev }));
      }, 10) as unknown as number;
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [stopwatch.isRunning]);

  const toggleStopwatch = () => {
    setStopwatch(prev => {
      if (prev.isRunning) {
        return {
          ...prev,
          isRunning: false,
          accumulatedTime: prev.accumulatedTime + (Date.now() - prev.startTime),
          startTime: 0
        };
      } else {
        return {
          ...prev,
          isRunning: true,
          startTime: Date.now(),
        };
      }
    });
  };

  const resetStopwatch = () => {
    setStopwatch({ isRunning: false, startTime: 0, accumulatedTime: 0 });
  };

  const unlock = () => {
    setView(OSView.HOME_SCREEN);
    setIsControlCenterOpen(false);
  };

  const lock = () => {
    setView(OSView.LOCK_SCREEN);
    setActiveApp(null);
    setIsControlCenterOpen(false);
  };

  const wake = () => {
    if (view === OSView.ALWAYS_ON) {
      setView(OSView.LOCK_SCREEN);
    }
  };

  const toggleSleep = () => {
    setView(prev => {
      if (prev === OSView.ALWAYS_ON) return OSView.LOCK_SCREEN;
      return OSView.ALWAYS_ON;
    });
    setIsControlCenterOpen(false);
    setActiveApp(null);
  };

  const openApp = (appId: AppId) => {
    setActiveApp(appId);
    setView(OSView.APP_OPEN);
    setIsControlCenterOpen(false);
  };

  const closeApp = () => {
    setActiveApp(null);
    setView(OSView.HOME_SCREEN);
  };

  const toggleControlCenter = () => setIsControlCenterOpen(prev => !prev);
  const addNotification = (n: Notification) => setNotifications(prev => [n, ...prev]);
  const clearNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  
  // -- Toggles Implementation --

  const toggleWifi = () => {
      if (airplaneMode) setAirplaneMode(false);
      setWifiEnabled(prev => !prev);
  };

  const toggleBluetooth = () => {
      if (airplaneMode) setAirplaneMode(false);
      setBluetoothEnabled(prev => !prev);
  };

  const toggleAirplaneMode = () => {
      setAirplaneMode(prev => {
          const newState = !prev;
          if (newState) {
              setWifiEnabled(false);
              setBluetoothEnabled(false);
          } else {
              setWifiEnabled(true);
              setBluetoothEnabled(true);
          }
          return newState;
      });
  };

  const toggleFlashlight = () => setFlashlightEnabled(prev => !prev);
  const toggleDoNotDisturb = () => setDoNotDisturb(prev => !prev);
  const toggleRotationLock = () => setRotationLock(prev => !prev);
  const toggleScreenRecording = () => setIsRecording(prev => !prev);
  const togglePerformanceMode = () => setPerformanceMode(prev => !prev);

  return (
    <OSContext.Provider value={{
      view, activeApp, wallpaper, brightness, volume, 
      wifiEnabled, bluetoothEnabled, airplaneMode, flashlightEnabled, doNotDisturb, rotationLock, isRecording, performanceMode,
      notifications, currentTime, isControlCenterOpen, stopwatch,
      iconConfig, setIconConfig,
      musicState, playMusic, pauseMusic, nextTrack, prevTrack,
      unlock, lock, wake, toggleSleep, openApp, closeApp, toggleControlCenter, setWallpaper, setBrightness, setVolume, 
      toggleWifi, toggleBluetooth, toggleAirplaneMode, toggleFlashlight, toggleDoNotDisturb, toggleRotationLock, toggleScreenRecording, togglePerformanceMode,
      addNotification, clearNotification,
      toggleStopwatch, resetStopwatch
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within OSProvider");
  return context;
};