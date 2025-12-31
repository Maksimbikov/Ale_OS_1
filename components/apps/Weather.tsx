import React from 'react';
import { Cloud, CloudRain, Sun, Wind, MapPin } from 'lucide-react';

const WeatherApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 flex flex-col overflow-hidden relative">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-start mt-8 z-10">
         <div>
            <div className="flex items-center gap-1 text-blue-100 font-medium mb-1">
                <MapPin size={16} />
                <span>San Francisco</span>
            </div>
            <div className="text-sm opacity-80">Just updated</div>
         </div>
      </div>

      {/* Main Status */}
      <div className="flex flex-col items-center mt-12 z-10">
         <Sun size={120} className="text-yellow-300 drop-shadow-lg mb-4" />
         <h1 className="text-8xl font-thin tracking-tighter">72°</h1>
         <p className="text-xl font-medium mt-2">Mostly Sunny</p>
         <div className="flex gap-4 mt-4 text-sm opacity-90 font-medium">
            <span>H: 76°</span>
            <span>L: 64°</span>
         </div>
      </div>

      {/* Details Card */}
      <div className="mt-auto bg-white/20 backdrop-blur-md rounded-3xl p-6 z-10 border border-white/10">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <Wind size={20} className="opacity-70" />
                <span className="font-semibold">6 mph</span>
            </div>
            <div className="flex items-center gap-2">
                <CloudRain size={20} className="opacity-70" />
                <span className="font-semibold">12%</span>
            </div>
            <div className="flex items-center gap-2">
                <Cloud size={20} className="opacity-70" />
                <span className="font-semibold">45%</span>
            </div>
         </div>

         {/* Weekly Forecast */}
         <div className="space-y-4">
             {[
                 { day: "Today", icon: <Sun size={18} className="text-yellow-300"/>, min: 64, max: 76 },
                 { day: "Tue", icon: <CloudRain size={18} />, min: 60, max: 68 },
                 { day: "Wed", icon: <Cloud size={18} />, min: 62, max: 70 },
                 { day: "Thu", icon: <Sun size={18} className="text-yellow-300"/>, min: 65, max: 74 },
             ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                    <span className="w-12 font-medium">{item.day}</span>
                    <div className="flex-1 flex justify-center">{item.icon}</div>
                    <div className="flex gap-3 text-right">
                        <span className="opacity-60">{item.min}°</span>
                        <div className="w-16 h-1 bg-white/20 rounded-full mt-2 relative overflow-hidden">
                             <div className="absolute left-2 right-2 top-0 bottom-0 bg-white/80 rounded-full" />
                        </div>
                        <span className="font-bold">{item.max}°</span>
                    </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default WeatherApp;