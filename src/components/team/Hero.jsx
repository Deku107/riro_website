import React from 'react';
import { Star, MonitorPlay, UserCheck } from 'lucide-react';
import teamImage from '../../assets/teampage/TEAM-01.png'

const Hero = () => {
  return (
    <div id="team" className="relative w-full mx-auto pt-10 pb-20 px-4 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-0 text-center">
        <span className="text-gray-900">Our</span> <span className="text-cyan-500">Team</span>
      </h1>
      
      {/* Team Image */}
      <div className="relative w-full max-w-6xl mx-auto -mt-20 -mb-40">
        <img 
          src={teamImage} 
          alt="Our Team" 
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>

     
    </div>
  );
};

export default Hero;
