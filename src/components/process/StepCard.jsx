import React, { useState, useEffect, useRef } from 'react';
import { ArrowDirection } from './types';
import { ProcessArrow } from './ProcessArrows';

export const StepCard = ({ step, direction, gridArea }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smoother initial animation
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2, // Increased threshold for more reliable triggering
        rootMargin: "0px 0px -100px 0px" // Increased margin to trigger earlier
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`relative group h-full w-full ${gridArea}`}
      style={{ gridArea: undefined }}
    >
      {/* Desktop Arrow */}
      <ProcessArrow direction={direction} />

      {/* Card Content */}
      <div 
        className={`
          relative z-10 flex flex-col items-center justify-center 
          h-full w-full p-6 
          bg-white border-2 border-slate-200 rounded-2xl shadow-lg 
          transition-all duration-200 ease-out
          hover:shadow-xl hover:border-[#00473e]/30 hover:-translate-y-1
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          transitionDelay: isVisible ? '50ms' : '0ms',
          willChange: isVisible ? 'opacity, transform' : 'auto'
        }}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#f2f7f5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
        
        {/* Icon Container */}
        <div className={`
          relative flex items-center justify-center w-14 h-14 mb-5 
          rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-[#00473e]
          shadow-md
          transition-all duration-200 ease-out
          group-hover:from-[#00473e] group-hover:to-[#00473e]/80 group-hover:text-white
          group-hover:shadow-lg
        `}>
          <div className="transition-transform duration-150">{step.icon}</div>
        </div>
        
        {/* Title */}
        <h3 className={`
          text-lg font-bold text-slate-800 text-center mb-3 
          transition-colors duration-150
          group-hover:text-[#00473e]
        `}>
          {step.title}
        </h3>
        
        {/* Description */}
        {step.description && (
          <p className="text-sm text-slate-600 text-center leading-relaxed transition-colors duration-150 group-hover:text-slate-700">
            {step.description}
          </p>
        )}

        {/* Decorative Elements - Simplified for performance */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-[#00473e]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        
        {/* Subtle Border Animation */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#00473e]/0 via-[#00473e]/20 to-[#00473e]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>
    </div>
  );
};
