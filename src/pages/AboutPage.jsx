import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, Square, Circle, Target, Eye, Compass } from 'lucide-react';

const aboutData = [
  {
    id: 1,
    title: "Our Mission",
    description: "To empower storytellers with innovative production solutions that bridge creative vision with practical execution. We believe every story deserves the opportunity to reach its audience with authenticity, impact, and artistic integrity.",
    image: "/api/placeholder/288/384",
    alt: "Team collaborating on creative project",
    alignment: "left",
    bgColor: "bg-blue-50",
    icon: Target
  },
  {
    id: 2,
    title: "Our Vision",
    description: "To create a global ecosystem where diverse voices in cinema can thrive, transforming the traditional production landscape into an inclusive, transparent, and artist-centric community that celebrates storytelling in all its forms.",
    image: "/api/placeholder/288/384",
    alt: "Vision of global film community",
    alignment: "right",
    bgColor: "bg-purple-50",
    icon: Eye
  }
];

const AnimatedObject = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 rotate-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AboutBlock = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef();
  const Icon = item.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={blockRef}
      className={`grid md:grid-cols-2 gap-12 items-center ${item.alignment === 'right' ? 'md:grid-flow-col-dense' : ''} transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Text Column */}
      <div className={`${item.alignment === 'right' ? 'md:col-start-2' : ''} space-y-6`}>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${item.bgColor} transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}>
          <Icon className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-medium text-slate-700">{item.title}</span>
        </div>
        
        <h2 className={`text-2xl md:text-3xl font-bold text-slate-900 transition-all duration-700 transform ${
          isVisible ? 'translate-x-0 opacity-100' : item.alignment === 'right' ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0'
        }`}>
          {item.title}
        </h2>
        
        <p className={`text-slate-600 text-lg leading-relaxed transition-all duration-700 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {item.description}
        </p>
        
        <button className={`group inline-flex items-center gap-3 bg-yellow-200 text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: `${400}ms` }}>
          Learn More
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3 h-3 text-slate-900" />
          </div>
        </button>
      </div>

      {/* Image Column */}
      <div className={`${item.alignment === 'right' ? 'md:col-start-1' : ''} relative`}>
        {/* Animated blob background */}
        <AnimatedObject delay={200}>
          <div className={`absolute inset-0 transform scale-110 ${item.bgColor} rounded-[3rem] opacity-60`}>
            {/* Multiple blob layers for depth */}
            <div className="absolute inset-0 rounded-[3rem] transform rotate-3"></div>
            <div className="absolute inset-0 rounded-[3rem] transform -rotate-1 scale-95"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-8 right-8 animate-bounce delay-300">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="absolute bottom-8 left-8 animate-pulse delay-500">
              <Square className="w-4 h-4 text-slate-700" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
              <Circle className="w-6 h-6 text-slate-400 opacity-30" />
            </div>
            
            {/* Compass icon for vision */}
            {index === 1 && (
              <div className="absolute top-12 left-12 animate-draw">
                <Compass className="w-6 h-6 text-purple-600" />
              </div>
            )}
            
            {/* Target icon for mission */}
            {index === 0 && (
              <svg className="absolute top-12 left-12 w-16 h-8 animate-draw" viewBox="0 0 64 32" fill="none">
                <path d="M0 16 Q 16 8, 32 16 T 64 16" stroke="#1e293b" strokeWidth="2" />
              </svg>
            )}
          </div>
        </AnimatedObject>

        {/* Actual image with animation */}
        <div className={`relative z-10 transition-all duration-700 transform ${
          isVisible ? 'scale-100 rotate-0 opacity-100' : 'scale-95 rotate-6 opacity-0'
        }`} style={{ transitionDelay: `${300}ms` }}>
          <div className="w-full h-80 md:h-96 flex items-center justify-center">
            <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <img 
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-${i + 1}`}
              style={{
                top: `${20 + i * 25}%`,
                left: `${10 + i * 30}%`,
                animationDelay: `${i * 200}ms`
              }}
            >
              <div className={`w-2 h-2 ${item.bgColor.replace('bg-', 'bg-').replace('-50', '-300')} rounded-full opacity-60`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes draw {
          from { stroke-dasharray: 0 100; }
          to { stroke-dasharray: 100 100; }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -15px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -5px); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-draw { animation: draw 2s ease-out forwards; }
        .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3s ease-in-out infinite 0.5s; }
        .animate-float-3 { animation: float-3 3s ease-in-out infinite 1s; }
      `}</style>
      
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div 
            ref={headerRef}
            className={`flex justify-between items-start mb-20 transition-all duration-1000 transform ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
            }`}
          >
            {/* Left side - Main title with decorative element */}
            <div className="flex items-center gap-4">
              {/* Purple vertical rectangle */}
              <div className="w-1 h-12 bg-purple-600 transition-all duration-700 hover:scale-110"></div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                  About <span className="relative">Us<span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 transition-all duration-700 hover:scale-105"></span></span>
                </h1>
              </div>
            </div>
            
            {/* Right side - Tag */}
            <div>
              <span className="text-sm uppercase tracking-wider text-slate-500 transition-all duration-500 hover:text-slate-700">
                Our story
              </span>
            </div>
          </div>

          {/* About Blocks */}
          <div className="space-y-32">
            {aboutData.map((item, index) => (
              <AboutBlock key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
