import React, { useState } from 'react';
import { SERVICES_DATA } from './constants.js';
import ServiceCard from './ServiceCard';

const Services = () => {
  const [services] = useState(SERVICES_DATA);

  return (
    <div id="services" className="relative bg-[#00473e] min-h-screen">
      {/* Header Section */}
      <div className="container mx-auto px-6 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-black text-[#fffffe] mb-6 leading-tight">
            Services We Offer <br/> 
          </h2>
          <p className="text-xl md:text-2xl text-[#f2f7f5] max-w-2xl leading-relaxed">
            Comprehensive services covering every aspect of film and digital content creation, from concept to global distribution.
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="py-20">
        {/* Desktop: Centered Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center max-w-7xl mx-auto px-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        
        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex gap-4 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {services.map((service, index) => (
            <div key={service.id} className="flex-shrink-0 w-72 snap-center">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;