import React from 'react';
import { Star, MonitorPlay, UserCheck } from 'lucide-react';
import cameraImage from '../../assets/teampage/camera photo.png'

const Hero = () => {
  return (
    <div id="team" className="relative w-full max-w-5xl mx-auto pt-10 pb-20 px-4 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-gray-900">Our</span> <span className="text-cyan-500">Team</span>
      </h1>

      {/* Main Graphic Container */}
      <div className="relative w-full max-w-lg aspect-square md:aspect-[4/3] flex items-center justify-center">
        
        {/* Background Dots */}
        <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-50 -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 pattern-dots opacity-50 translate-y-10 -translate-x-10"></div>

        {/* Abstract Shapes */}
        <div className="absolute w-full h-full flex items-center justify-center z-0">
             {/* The Pink Blob */}
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[350px] bg-[#e11d48] blob-shape absolute top-10 transform -rotate-12 shadow-2xl opacity-90"></div>
            {/* The Dark Blue Blob */}
            <div className="w-[200px] h-[200px] bg-[#1e293b] rounded-full absolute -left-4 top-20 -z-10 mix-blend-multiply opacity-80"></div>
        </div>

        {/* Central Image (Camera) */}
        <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 animate-in fade-in zoom-in duration-700">
          <img 
            src={cameraImage} 
            alt="Camera" 
            className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Floating Badges */}
        
        {/* Creativity */}
        <div className="absolute top-0 left-0 md:-left-12 bg-white p-3 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-pink-600 p-2 rounded-lg text-white">
                <MonitorPlay size={20} />
            </div>
            <span className="font-medium text-gray-500 text-sm">Creativity</span>
        </div>

        {/* Satisfaction */}
        <div className="absolute top-1/3 -right-4 md:-right-16 bg-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Star className="text-yellow-400 fill-yellow-400" size={18} />
            <span className="font-medium text-gray-500 text-sm">Satisfaction</span>
        </div>

        {/* Production Badge */}
        <div className="absolute -bottom-8 right-0 md:right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border-l-4 border-pink-600 z-20">
             <div className="bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-white">
                <UserCheck size={20} />
             </div>
             <div className="flex flex-col">
                 <span className="font-bold text-gray-800 text-sm">Production</span>
                 <span className="text-xs text-gray-400">5 Years</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
