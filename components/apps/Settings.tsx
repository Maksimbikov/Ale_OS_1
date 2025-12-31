import React, { PropsWithChildren } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS, SUPER_MOON, SUPER_EARTH, SUPER_MARS } from '../../constants';
import { Check, Wifi, Bluetooth, Battery, Monitor, Bell, Sparkles, LayoutGrid, Type, Smartphone, ExternalLink, Star, Cpu, Zap } from 'lucide-react';

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

const Row = ({ icon, label, action, isLast = false, description }: any) => (
  <div className={`flex flex-col p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <div className="p-1.5 bg-blue-500 rounded-md text-white">
            {icon}
        </div>
        <span className="text-gray-900 font-medium">{label}</span>
        </div>
        <div>{action}</div>
    </div>
    {description && (
        <div className="mt-1 ml-10 text-[10px] text-gray-400 font-medium">
            {description}
        </div>
    )}
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
    iconConfig, setIconConfig,
    performanceMode, togglePerformanceMode
  } = useOS();

  return (
    <div className="h-full w-full bg-gray-100 overflow-y-auto pb-20 text-black">
      <div className="p-4 pt-12 pb-2">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* About System Section - ENHANCED */}
      <div className="px-4 mb-8">
         <h3 className="text-gray-500 uppercase text-xs font-bold mb-3 tracking-wider ml-1">About System</h3>
         {/* Increased height to h-64 (256px) for larger elements */}
         <div className="grid grid-cols-5 gap-3 h-64">
            
            {/* Main Info Card - Samsung Style Phone */}
            <div className="col-span-3 bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden group">
                {/* Decorative BG Blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/80 rounded-full blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-purple-100/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="flex gap-4 z-10 h-full relative">
                    
                    {/* Drawn Phone Back - Samsung S-Series Style (No Logo) - STATIC */}
                    <div className="w-[82px] h-[145px] bg-[#1a1a1a] rounded-[10px] border-[1px] border-gray-700 relative shadow-2xl flex-shrink-0 transform rotate-6 mt-1 ml-2 overflow-hidden">
                        
                        {/* Matte Back Effect with subtle gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#111111]" />
                        
                        {/* Vertical Camera Array (Floating Lenses - "Traffic Light" Design) */}
                        <div className="absolute top-3 left-2.5 flex flex-col gap-[6px] z-20">
                            {/* Lens 1 */}
                            <div className="w-[14px] h-[14px] rounded-full bg-black ring-[1.5px] ring-[#444] shadow-md relative flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-[#0a1128] rounded-full opacity-80" />
                                <div className="absolute top-[3px] right-[3px] w-[2px] h-[2px] bg-white/60 blur-[0.2px] rounded-full" />
                            </div>
                            {/* Lens 2 */}
                            <div className="w-[14px] h-[14px] rounded-full bg-black ring-[1.5px] ring-[#444] shadow-md relative flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-[#0a1128] rounded-full opacity-80" />
                                <div className="absolute top-[3px] right-[3px] w-[2px] h-[2px] bg-white/60 blur-[0.2px] rounded-full" />
                            </div>
                            {/* Lens 3 */}
                            <div className="w-[14px] h-[14px] rounded-full bg-black ring-[1.5px] ring-[#444] shadow-md relative flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-[#0a1128] rounded-full opacity-80" />
                                <div className="absolute top-[3px] right-[3px] w-[2px] h-[2px] bg-white/60 blur-[0.2px] rounded-full" />
                            </div>
                        </div>

                        {/* Flash (Positioned to the right of top cameras) */}
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-yellow-100/70 rounded-full blur-[0.3px] z-20" />

                        {/* NO LOGO - Clean Back */}
                        
                        {/* Light Reflection Stripe for Glass/Metal look */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="flex flex-col pt-3 justify-center pl-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Cpu size={14} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-none tracking-tight">Ale OS</h2>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wide mt-1 bg-blue-50 px-2 py-0.5 rounded-md w-fit">7.0 Web</span>
                    </div>
                </div>

                <div className="mt-auto z-10 flex flex-col gap-1">
                     <div className="text-[10px] text-gray-400 font-mono">Updated: 2025-31-12</div>
                     <a 
                        href="https://www.tiktok.com/@edits_for_brattsifona" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-gray-700 hover:text-white hover:bg-black transition-all duration-300 flex items-center gap-1.5 font-bold bg-gray-100 w-fit px-3 py-1.5 rounded-full border border-gray-200"
                     >
                        <span>@edits_for_brattsifona</span>
                        <ExternalLink size={10} />
                     </a>
                </div>
            </div>

            {/* The "7" Night Cube - STATIC MOON */}
            <div className="col-span-2 bg-gradient-to-b from-[#020617] via-[#172554] to-[#1e1b4b] rounded-3xl p-2 relative overflow-hidden flex flex-col items-center justify-center text-white shadow-xl border border-white/5 group">
                 
                 {/* Realistic CSS Moon - Static */}
                 <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_0_50px_rgba(255,255,255,0.4)] opacity-90">
                    {/* Craters */}
                    <div className="absolute top-8 left-6 w-4 h-4 rounded-full bg-slate-400/30 shadow-inner" />
                    <div className="absolute top-14 left-10 w-2 h-2 rounded-full bg-slate-400/40 shadow-inner" />
                    <div className="absolute top-5 right-10 w-6 h-6 rounded-full bg-slate-400/20 shadow-inner" />
                 </div>

                 {/* Stars - Static */}
                 <div className="absolute inset-0">
                    <Star size={8} className="absolute top-10 left-4 text-white" fill="white" />
                    <Star size={6} className="absolute bottom-12 right-6 text-blue-200" fill="currentColor" />
                    <Star size={4} className="absolute top-1/2 left-2 text-white/50" fill="currentColor" />
                    <Star size={4} className="absolute top-4 right-[40%] text-white/30" fill="currentColor" />
                    <div className="absolute bottom-4 left-8 w-0.5 h-0.5 bg-white rounded-full" />
                 </div>
                 
                 {/* The Big Number - Upscaled */}
                 <div className="relative z-10 text-center mt-8">
                    <div className="text-[7rem] font-black leading-none tracking-tighter filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 scale-y-110">
                        7
                    </div>
                 </div>
                 
                 <div className="absolute bottom-3 text-[9px] font-bold tracking-[0.3em] text-blue-200/50 uppercase">
                    Night Edition
                 </div>
            </div>
         </div>
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

      <Section title="Performance">
        <Row 
            icon={<Zap size={18} fill={performanceMode ? "white" : "none"} />} 
            label="Performance Mode" 
            description="Disables blur effects to improve FPS."
            action={
              <div 
                onClick={togglePerformanceMode}
                className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${performanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${performanceMode ? 'left-6' : 'left-1'}`} />
              </div>
            }
            isLast
          />
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