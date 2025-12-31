import React, { useEffect, useRef, useState } from 'react';
import { Camera as CameraIcon, RotateCcw, Zap, ZapOff } from 'lucide-react';

const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full w-full bg-black flex flex-col relative overflow-hidden">
       {/* Viewfinder */}
       <div className="flex-1 relative rounded-[32px] overflow-hidden m-2 bg-gray-900">
          {error ? (
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center p-8">
               {error}
             </div>
          ) : (
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className="w-full h-full object-cover mirror-mode" // transform scaleX(-1) usually for selfies
               style={{ transform: 'scaleX(-1)' }}
             />
          )}
          
          {/* Top Controls Overlay */}
          <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-10">
             <button onClick={() => setFlash(!flash)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                {flash ? <Zap size={20} className="fill-yellow-400 text-yellow-400" /> : <ZapOff size={20} />}
             </button>
             <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               HD 30
             </div>
          </div>
       </div>

       {/* Bottom Controls */}
       <div className="h-32 bg-black flex flex-col justify-center px-8 pb-4">
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
             <span>Video</span>
             <span className="text-yellow-400">Photo</span>
             <span>Portrait</span>
          </div>
          
          <div className="flex justify-between items-center">
             <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
               {/* Gallery Preview Placeholder */}
             </div>

             <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform">
                <div className="w-full h-full bg-white rounded-full" />
             </button>

             <button className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-white">
                <RotateCcw size={24} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default CameraApp;