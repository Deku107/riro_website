import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import heroImage from '../../assets/hero/WEB GRAPHICS-05.png';
import logo from '../../assets/RIRO Logo (2).png';
import { scrollToSection } from '../../utils/scrollToSection';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredLine, setHoveredLine] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  return (
    <section
      ref={heroRef}
      id="home"
      className="bg-[#f2f7f5] section-padding section-y relative overflow-hidden scroll-mt-16 md:scroll-mt-20 min-h-screen"
    >
      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <img 
          src={logo} 
          alt="RIRO Talehouse Watermark" 
          className="w-96 h-auto object-contain transform scale-150"
        />
      </div>
      
      {/* Mobile Image - Above watermark, below text */}
      <div className="lg:hidden absolute inset-0 flex items-start justify-center md:justify-end pt-96 sm:pt-[112px] md:pt-[28rem] md:pr-8 z-20">
        <img
          src={heroImage}
          alt="Web Graphics"
          className="h-[35vh] sm:h-[40vh] md:h-[45vh] w-auto object-contain opacity-90"
        />
      </div>
      <div className="relative min-h-screen">
        {/* Mobile: Image below text, Desktop: Image on right */}
        <div className="hidden lg:absolute lg:inset-0 lg:flex lg:items-start lg:justify-end lg:pr-4 lg:pr-8 lg:pt-8 lg:pt-12 lg:block">
          <img
            src={heroImage}
            alt="Web Graphics"
            className="hidden sm:block h-[45vh] md:h-[55vh] lg:h-[60vh] w-auto object-contain opacity-90 lg:translate-x-8 lg:translate-x-16"
          />
        </div>
        <div className="relative z-10 max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 sm:gap-10 lg:gap-20 xl:gap-28 items-center min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh]">
            <div className="space-y-6 sm:space-y-8 max-w-full sm:max-w-xl pt-8 lg:pt-4 mx-auto lg:mx-0 text-center lg:text-left -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-24 px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[3.5rem] leading-tight font-bold tracking-tight">
            
            <span 
              className={`
                text-[#00473e] inline-block transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
                ${hoveredLine === 1 ? 'text-[#003d3a]' : ''}
              `}
              style={{ transitionDelay: '200ms' }}
              onMouseEnter={() => setHoveredLine(1)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              YOUR STORY.
            </span>
            <br />
            <span 
              className={`
                text-[#00473e] inline-block transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
                ${hoveredLine === 2 ? 'text-[#003d3a]' : ''}
              `}
              style={{ transitionDelay: '400ms' }}
              onMouseEnter={() => setHoveredLine(2)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              OUR SCREEN.
            </span>
            <br />
            <span 
              className={`
                text-[#00473e] inline-block transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
                ${hoveredLine === 3 ? 'text-[#003d3a]' : ''}
              `}
              style={{ transitionDelay: '600ms' }}
              onMouseEnter={() => setHoveredLine(3)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              THE WORLD'S STAGE
            </span>
          </h1>

          <p className={`
            text-xs sm:text-sm md:text-base lg:text-lg text-[#00473e] font-medium leading-relaxed max-w-full sm:max-w-lg mx-auto lg:mx-0 px-3 sm:px-0
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
          `}
          style={{ transitionDelay: '800ms' }}>
            RIRO Talehouse is a new-age film and digital content studio building a single-window system for creators—from script to screen.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 relative z-30">
            {/* Mobile: Swipe down text */}
            <button 
              onClick={() => scrollToSection('services')}
              className="lg:hidden flex items-center gap-2 text-sm text-slate-600 animate-bounce cursor-pointer bg-transparent border-none p-2"
            >
              <span>Swipe down for more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
            {/* Desktop: Learn More button */}
            <button 
              onClick={() => scrollToSection('process')}
              className="hidden lg:inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white relative z-30 pointer-events-auto min-h-[44px] min-w-[44px]"
            >
              Learn More
            </button>
            <a 
              href="https://www.youtube.com/@RiroTalehouse" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-slate-900 hover:text-slate-700 transition-colors"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00473e] text-white shadow-soft">
                ▶
              </span>
              Watch Video
            </a>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
