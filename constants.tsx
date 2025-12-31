import React from 'react';
import { AppId, AppConfig } from './types';
import { 
  Phone, MessageSquare, Globe, Settings, Calculator, Clock, 
  Camera, Image as ImageIcon, Users, CloudSun, Music, Clapperboard, PenTool 
} from 'lucide-react';
import CalculatorApp from './components/apps/Calculator';
import ClockApp from './components/apps/Clock';
import BrowserApp from './components/apps/Browser';
import SettingsApp from './components/apps/Settings';
import GalleryApp from './components/apps/Gallery';
import PhoneApp from './components/apps/Phone';
import WeatherApp from './components/apps/Weather';
import MusicApp from './components/apps/Music';
import CameraApp from './components/apps/Camera';
import MessagesApp from './components/apps/Messages';
import AnimatorApp from './components/apps/Animator';

// Simple placeholders for apps not fully implemented
const PlaceholderApp = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
    <div className="text-6xl mb-4 opacity-30 grayscale">🚧</div>
    <h2 className="text-xl font-medium text-gray-800">{name}</h2>
    <p className="text-sm">Under Construction</p>
  </div>
);

export const SUPER_MOON = 'super_moon';
export const SUPER_EARTH = 'super_earth';
export const SUPER_MARS = 'super_mars';

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop", // Abstract Blue/Pink
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // Liquid Oil
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop", // Gradient Mesh
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop", // Vaporwave
];

export const APPS: Record<AppId, AppConfig> = {
  [AppId.PHONE]: {
    id: AppId.PHONE,
    name: 'Phone',
    icon: <Phone size={24} className="text-white" />,
    color: 'bg-green-500',
    component: <PhoneApp />,
  },
  [AppId.MESSAGES]: {
    id: AppId.MESSAGES,
    name: 'Messages',
    icon: <MessageSquare size={24} className="text-white" />,
    color: 'bg-green-500',
    component: <MessagesApp />,
  },
  [AppId.BROWSER]: {
    id: AppId.BROWSER,
    name: 'Browser',
    icon: <Globe size={24} className="text-white" />,
    color: 'bg-indigo-500',
    component: <BrowserApp />,
  },
  [AppId.SETTINGS]: {
    id: AppId.SETTINGS,
    name: 'Settings',
    icon: <Settings size={24} className="text-white" />,
    color: 'bg-gray-600',
    component: <SettingsApp />,
  },
  [AppId.CALCULATOR]: {
    id: AppId.CALCULATOR,
    name: 'Calculator',
    icon: <Calculator size={24} className="text-white" />,
    color: 'bg-orange-500',
    component: <CalculatorApp />,
  },
  [AppId.CLOCK]: {
    id: AppId.CLOCK,
    name: 'Clock',
    icon: <Clock size={24} className="text-white" />,
    color: 'bg-black border border-gray-700',
    component: <ClockApp />,
  },
  [AppId.CAMERA]: {
    id: AppId.CAMERA,
    name: 'Camera',
    icon: <Camera size={24} className="text-white" />,
    color: 'bg-gray-800',
    component: <CameraApp />,
  },
  [AppId.GALLERY]: {
    id: AppId.GALLERY,
    name: 'Gallery',
    icon: <ImageIcon size={24} className="text-white" />,
    color: 'bg-purple-500',
    component: <GalleryApp />,
  },
  [AppId.CONTACTS]: {
    id: AppId.CONTACTS,
    name: 'Contacts',
    icon: <Users size={24} className="text-white" />,
    color: 'bg-teal-600',
    component: <PlaceholderApp name="Contacts" />,
  },
  [AppId.WEATHER]: {
    id: AppId.WEATHER,
    name: 'Weather',
    icon: <CloudSun size={24} className="text-white" />,
    color: 'bg-sky-400',
    component: <WeatherApp />,
  },
  [AppId.MUSIC]: {
    id: AppId.MUSIC,
    name: 'Music',
    icon: <Music size={24} className="text-white" />,
    color: 'bg-red-500',
    component: <MusicApp />,
  },
  [AppId.ANIMATOR]: {
    id: AppId.ANIMATOR,
    name: 'Animator',
    icon: <PenTool size={24} className="text-white" />,
    color: 'bg-red-600',
    component: <AnimatorApp />,
  },
};

export const DOCK_APPS = [AppId.PHONE, AppId.MESSAGES, AppId.BROWSER, AppId.SETTINGS];
export const HOME_APPS = [AppId.CLOCK, AppId.CALCULATOR, AppId.GALLERY, AppId.CAMERA, AppId.WEATHER, AppId.MUSIC, AppId.ANIMATOR];