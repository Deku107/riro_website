import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import heroImage from '../../assets/hero/camera stand 1.png';
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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <img 
          src={logo} 
          alt="RIRO Talehouse Watermark" 
          className="w-96 h-auto object-contain transform scale-150"
        />
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-20 xl:gap-28 items-center min-h-[80vh] max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-8 max-w-full sm:max-w-xl pt-2 lg:pt-4 mx-auto lg:mx-0 text-center lg:text-left -mt-12 md:-mt-16 lg:-mt-24 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] leading-tight font-bold tracking-tight">
            
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
            text-sm sm:text-base md:text-lg text-[#00473e] font-medium leading-relaxed max-w-full sm:max-w-lg mx-auto lg:mx-0 px-4 sm:px-0
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
          `}
          style={{ transitionDelay: '800ms' }}>
            RIRO Talehouse is a new-age film and digital content studio building a single-window system for creators—from script to screen.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
            <Button variant="ghost" onClick={() => scrollToSection('process')}>Learn More</Button>
            <button className="inline-flex items-center gap-3 text-sm text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00473e] text-white shadow-soft">
                ▶
              </span>
              Watch Video
            </button>
          </div>
        </div>

        <div className="relative h-[400px] sm:h-[500px] lg:h-[500px] flex items-end justify-center mt-10 lg:mt-0 lg:absolute lg:bottom-0 lg:right-1/4">
          <img
            src={heroImage}
            alt="Camera photographer"
            className="h-full w-auto object-contain max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
