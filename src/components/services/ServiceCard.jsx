import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the specific service page based on service id
    const routeMap = {
      's1': '/services/short-films',
      's2': '/services/digital-commercials',
      's3': '/services/feature-films',
      's4': '/services/corporate-videos',
      's5': '/services/music-videos'
    };
    
    const route = routeMap[service.id];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div 
      className="group perspective-[1000px] w-full max-w-lg h-80"
      onClick={handleCardClick}
    >
      <div
        className="
          relative w-full h-full transition-all duration-500
          bg-[#EAEAEA]
          rounded-2xl
          p-6
          flex flex-col
          items-center justify-center
          text-center
          shadow-lg
          cursor-pointer
          hover:shadow-xl
          hover:-translate-y-1
        "
      >
        {/* Badge Number */}
        <div className="absolute top-4 left-4">
          <div className="bg-[#F2B656] text-white font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-xl shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
            {service.number}
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-12 right-12 w-20 h-20 rounded-full bg-gray-200/50 -z-10" />
        <div className="absolute bottom-20 left-8 w-12 h-12 rounded-full bg-gray-200/50 -z-10" />
        <div className="absolute top-1/2 right-8 w-6 h-6 rounded-full bg-[#F2B656]/20" />
        
        {/* Content - Just Title */}
        <div className="relative z-10 max-w-xs">
          <h3 className="text-[#1a2e35] text-3xl font-extrabold uppercase tracking-tighter leading-none mb-4">
            {service.title}
          </h3>
          <div className="w-16 h-1 bg-[#F2B656] mx-auto rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
        </div>
        
        {/* Hover visual cue at bottom */}
        <div className="absolute bottom-6 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <div className="flex flex-col items-center gap-1 text-gray-400 font-bold uppercase text-xs tracking-widest animate-bounce">
            <span>View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
