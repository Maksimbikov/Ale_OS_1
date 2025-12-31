import React from 'react';

const IMAGES = Array.from({ length: 15 }).map((_, i) => 
  `https://picsum.photos/300/300?random=${i}`
);

const Gallery: React.FC = () => {
  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 border-b z-10">
        <h1 className="text-2xl font-bold text-black">Photos</h1>
      </div>
      <div className="grid grid-cols-3 gap-0.5 pb-20">
        {IMAGES.map((src, idx) => (
          <div key={idx} className="aspect-square relative overflow-hidden bg-gray-200">
            <img 
              src={src} 
              alt={`Gallery item ${idx}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;