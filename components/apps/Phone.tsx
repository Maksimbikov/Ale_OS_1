import React, { useState } from 'react';
import { Phone, Delete, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhoneApp: React.FC = () => {
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handlePress = (val: string) => {
    if (number.length < 15) setNumber(prev => prev + val);
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const startCall = () => {
    if (number.length > 0) setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
    setNumber('');
  };

  return (
    <div className="h-full w-full bg-white flex flex-col text-black overflow-hidden relative">
      {/* Calling Screen Overlay */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col items-center pt-24 pb-12 text-white"
          >
             <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-6 shadow-2xl">
                <User size={64} className="text-gray-400" />
             </div>
             <h2 className="text-3xl font-thin mb-2">{number}</h2>
             <p className="text-gray-400 animate-pulse">Calling mobile...</p>
             
             <div className="mt-auto grid grid-cols-3 gap-6 w-full px-12 place-items-center">
                 {/* Fake controls */}
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><User size={24}/></div>
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><User size={24}/></div>
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><User size={24}/></div>
             </div>

             <div className="mt-8">
               <button onClick={endCall} className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                 <Phone size={32} className="rotate-[135deg] fill-white" />
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dialpad */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 border-b">
         <div className="h-20 flex items-center justify-center">
            <span className="text-4xl font-semibold tracking-wider transition-all">
                {number || <span className="text-gray-300">Enter Number</span>}
            </span>
         </div>
         {number.length > 0 && (
             <div className="text-sm text-blue-500 font-medium mt-2">Add to Contacts</div>
         )}
      </div>
      
      <div className="pb-12 px-8 pt-4">
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((item) => (
            <button 
              key={item}
              onClick={() => handlePress(String(item))}
              className="aspect-square rounded-full bg-gray-100 active:bg-gray-300 flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-3xl font-medium">{item}</span>
              {typeof item === 'number' && item > 1 && item < 10 && (
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">
                      {['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'][item - 2]}
                  </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 place-items-center">
          <div /> {/* Spacer */}
          <button 
             onClick={startCall}
             className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-transform"
          >
            <Phone size={32} fill="currentColor" />
          </button>
          {number.length > 0 && (
              <button onClick={handleDelete} className="text-gray-400 active:text-gray-800 p-2">
                  <Delete size={28} />
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneApp;