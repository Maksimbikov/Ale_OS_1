import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, MoreVertical } from 'lucide-react';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('ale-os.com');

  return (
    <div className="h-full w-full bg-white flex flex-col text-black">
      {/* Address Bar */}
      <div className="bg-gray-100 p-2 border-b flex items-center gap-2">
        <div className="flex gap-4 px-2 text-gray-600">
           <ArrowLeft size={20} />
           <ArrowRight size={20} className="text-gray-300" />
        </div>
        <div className="flex-1 bg-white rounded-full h-9 px-4 flex items-center text-sm shadow-sm">
           <Search size={14} className="text-gray-400 mr-2" />
           <input 
             type="text" 
             value={url} 
             onChange={(e) => setUrl(e.target.value)} 
             className="flex-1 outline-none text-gray-800"
           />
           <RotateCw size={14} className="text-gray-400" />
        </div>
        <MoreVertical size={20} className="text-gray-600 px-1" />
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2">ale os</h1>
           <p className="text-gray-500">The web is your playground.</p>
        </div>
        
        <div className="mt-8 w-full max-w-sm">
           <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;