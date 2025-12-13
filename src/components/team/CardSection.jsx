import React from 'react';
import PersonCard from './PersonCard';
import PersonCard2 from './PersonCard2';
import PersonCard3 from './PersonCard3';
import PersonCard4 from './PersonCard4';
import PersonCard5 from './PersonCard5';
import PersonCard6 from './PersonCard6';

const CardSection = () => {
  return (
    <section id="team" className="py-16 px-4 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* PersonCard - 20% left from center */}
          <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up">
            <PersonCard />
          </div>
          
          {/* PersonCard2 - 20% right from center */}
          <div className="flex justify-end pr-[20%] opacity-0 animate-fade-in-up animation-delay-200">
            <PersonCard2 />
          </div>
          
          {/* PersonCard3 - 20% left from center */}
          <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up animation-delay-400">
            <PersonCard3 />
          </div>
          
          {/* PersonCard4 - 20% right from center */}
          <div className="flex justify-end pr-[20%] opacity-0 animate-fade-in-up animation-delay-600">
            <PersonCard4 />
          </div>
          
          {/* PersonCard5 - 20% left from center */}
          <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up animation-delay-800">
            <PersonCard5 />
          </div>
          
          {/* PersonCard6 - 20% right from center */}
          <div className="flex justify-end pr-[20%] opacity-0 animate-fade-in-up animation-delay-1000">
            <PersonCard6 />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardSection;
