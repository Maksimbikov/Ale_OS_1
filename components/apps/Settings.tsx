import React, { PropsWithChildren } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS, SUPER_MOON, SUPER_EARTH, SUPER_MARS } from '../../constants';
import { Check, Wifi, Bluetooth, Battery, Monitor, Bell, Sparkles, LayoutGrid, Type } from 'lucide-react';

interface SectionProps {
  title: string;
}

const Section: React.FC<PropsWithChildren<SectionProps>> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-gray-500 uppercase text-xs font-bold px-4 mb-2 tracking-wider">{title}</h3>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm mx-4">
      {children}
    </div>
  </div>
);

const Row = ({ icon, label, action, isLast = false }: any) => (
  <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-blue-500 rounded-md text-white">
        {icon}
      </div>
      <span className="text-gray-900 font-medium">{label}</span>
    </div>
    <div>{action}</div>
  </div>
);

const SuperWallpaperCard = ({ id, name, sub, img, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`relative h-32 rounded-xl overflow-hidden cursor-pointer border-4 transition-all flex-1 min-w-[140px] ${active ? 'border-orange-500 scale-[1.02] shadow-lg' : 'border-transparent shadow-md'}`}
  >
      <img src={img} className="w-full h-full object-cover" alt={name} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
        <div className="flex items-center gap-1 text-white font-bold text-sm">
            <Sparkles size={14} className="text-orange-500" />
            <span>{name}</span>
        </div>
        <p className="text-white/70 text-[10px]">{sub}</p>
      </div>
      {active && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
          <Check size={12} />
        </div>
      )}
  </div>
);

const Settings: React.FC = () => {
  const { 
    wallpaper, setWallpaper, 
    wifiEnabled, toggleWifi, 
    bluetoothEnabled, toggleBluetooth,
    iconConfig, setIconConfig
  } = useOS();

  return (
    <div className="h-full w-full bg-gray-100 overflow-y-auto pb-20 text-black">
      <div className="p-4 pt-12 pb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Section title="Super Wallpapers">
         <div className="flex gap-3 overflow-x-auto p-4 scrollbar-hide">
            <SuperWallpaperCard 
               id={SUPER_EARTH}
               name="Earth"
               sub="Home"
               img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"
               active={wallpaper === SUPER_EARTH}
               onClick={() => setWallpaper(SUPER_EARTH)}
            />
             <SuperWallpaperCard 
               id={SUPER_MARS}
               name="Mars"
               sub="Red Planet"
               // Fixed Broken URL using reliable Wikimedia source
               img="https://upload.wikimedia.org/wikipedia/commons/f/f5/3D_Mars.png"
               active={wallpaper === SUPER_MARS}
               onClick={() => setWallpaper(SUPER_MARS)}
            />
             <SuperWallpaperCard 
               id={SUPER_MOON}
               name="Moon"
               sub="Faraway"
               img="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=400&auto=format&fit=crop"
               active={wallpaper === SUPER_MOON}
               onClick={() => setWallpaper(SUPER_MOON)}
            />
         </div>
      </Section>

      <Section title="Home Screen & Icons">
        {/* Icon Size Slider */}
        <div className="p-4 border-b border-gray-100">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-1.5 bg-blue-500 rounded-md text-white"><LayoutGrid size={18}/></div>
             <span className="font-medium text-gray-900">Icon Size</span>
             <span className="ml-auto text-gray-500 text-sm">{Math.round(iconConfig.size)}px</span>
           </div>
           <input 
             type="range" 
             min="50" max="74" 
             value={iconConfig.size} 
             onChange={(e) => setIconConfig({ size: Number(e.target.value) })}
             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
           />
           <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>Small</span>
              <span>Huge</span>
           </div>
        </div>

        {/* Icon Style Toggle */}
        <Row 
          icon={<Sparkles size={18} />} 
          label="Dark Icons" 
          action={
            <div 
              onClick={() => setIconConfig({ style: iconConfig.style === 'standard' ? 'dark' : 'standard' })}
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${iconConfig.style === 'dark' ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${iconConfig.style === 'dark' ? 'left-6' : 'left-1'}`} />
            </div>
          } 
        />

        {/* Show Text Toggle */}
        <Row 
          icon={<Type size={18} />} 
          label="Show App Names" 
          action={
            <div 
              onClick={() => setIconConfig({ showLabels: !iconConfig.showLabels })}
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${iconConfig.showLabels ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${iconConfig.showLabels ? 'left-6' : 'left-1'}`} />
            </div>
          } 
          isLast
        />
      </Section>

      <Section title="Connectivity">
        <Row 
          icon={<Wifi size={18} />} 
          label="Wi-Fi" 
          action={
            <div 
              onClick={toggleWifi}
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${wifiEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${wifiEnabled ? 'left-6' : 'left-1'}`} />
            </div>
          } 
        />
        <Row 
          icon={<Bluetooth size={18} />} 
          label="Bluetooth" 
          action={
            <div 
              onClick={toggleBluetooth}
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${bluetoothEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${bluetoothEnabled ? 'left-6' : 'left-1'}`} />
            </div>
          }
          isLast
        />
      </Section>

      <Section title="Classic Wallpapers">
        <div className="p-4">
          <div className="mb-2 font-medium">Standard</div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {WALLPAPERS.map((wp, i) => (
              <button 
                key={i} 
                onClick={() => setWallpaper(wp)}
                className={`relative w-20 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 ${wallpaper === wp ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img src={wp} alt="wallpaper" className="w-full h-full object-cover" />
                {wallpaper === wp && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="text-white" size={24} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="General">
        <Row icon={<Battery size={18} />} label="Battery" action={<span className="text-gray-400">100%</span>} />
        <Row icon={<Monitor size={18} />} label="Display" action={<span className="text-gray-400">Auto</span>} />
        <Row icon={<Bell size={18} />} label="Notifications" isLast />
      </Section>
    </div>
  );
};

export default Settings;