import { ReactNode } from "react";

export enum AppId {
  PHONE = 'phone',
  MESSAGES = 'messages',
  BROWSER = 'browser',
  SETTINGS = 'settings',
  CALCULATOR = 'calculator',
  CLOCK = 'clock',
  CAMERA = 'camera',
  GALLERY = 'gallery',
  CONTACTS = 'contacts',
  WEATHER = 'weather',
  MUSIC = 'music',
  ANIMATOR = 'animator',
}

export interface AppConfig {
  id: AppId;
  name: string;
  icon: ReactNode;
  color: string;
  component: ReactNode;
}

export enum OSView {
  ALWAYS_ON = 'ALWAYS_ON',
  LOCK_SCREEN = 'LOCK_SCREEN',
  HOME_SCREEN = 'HOME_SCREEN',
  APP_OPEN = 'APP_OPEN',
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  appId: AppId;
  timestamp: Date;
}

export type IconStyle = 'standard' | 'dark';

export interface IconConfig {
  size: number; // px value, e.g., 60
  style: IconStyle;
  showLabels: boolean;
}

export interface Song {
  title: string;
  artist: string;
  url: string; // URL to audio file
  cover: string; // URL to cover art
}

export interface MusicState {
  isPlaying: boolean;
  currentTrackIndex: number;
  trackList: Song[];
}

export interface OSContextType {
  view: OSView;
  activeApp: AppId | null;
  wallpaper: string;
  brightness: number;
  volume: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airplaneMode: boolean;
  flashlightEnabled: boolean;
  doNotDisturb: boolean;
  rotationLock: boolean;
  isRecording: boolean;
  
  notifications: Notification[];
  currentTime: Date;
  isControlCenterOpen: boolean;
  stopwatch: StopwatchState;
  
  // Customization
  iconConfig: IconConfig;
  setIconConfig: (config: Partial<IconConfig>) => void;
  
  // Music
  musicState: MusicState;
  playMusic: () => void;
  pauseMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // Actions
  unlock: () => void;
  lock: () => void;
  wake: () => void;
  toggleSleep: () => void;
  openApp: (appId: AppId) => void;
  closeApp: () => void;
  toggleControlCenter: () => void;
  setWallpaper: (url: string) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleAirplaneMode: () => void;
  toggleFlashlight: () => void;
  toggleDoNotDisturb: () => void;
  toggleRotationLock: () => void;
  toggleScreenRecording: () => void;

  addNotification: (n: Notification) => void;
  clearNotification: (id: string) => void;
  
  // Stopwatch Actions
  toggleStopwatch: () => void;
  resetStopwatch: () => void;
}

export interface StopwatchState {
  isRunning: boolean;
  startTime: number;
  accumulatedTime: number;
}