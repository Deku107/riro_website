import React, { useEffect, useRef, useState } from 'react';
import { Feather, Film, Layout, Globe, ArrowUpRight, Sparkles, Zap } from 'lucide-react';

const approaches = [
  {
    title: "Story First",
    description: "Socially relevant, audience-centric narratives that resonate deeply.",
    iconName: "Feather",
    color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    hoverColor: "hover:from-purple-600 hover:to-indigo-700",
    borderColor: "border-purple-200",
    lightBg: "bg-purple-50"
  },
  {
    title: "Cinematic Craft",
    description: "High production value tailored meticulously for multi-platform release.",
    iconName: "Film",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    hoverColor: "hover:from-blue-600 hover:to-cyan-700",
    borderColor: "border-blue-200",
    lightBg: "bg-blue-50"
  },
  {
    title: "Lean & Transparent",
    description: "Smart budgets, clear milestones, and fully accountable reporting.",
    iconName: "Layout",
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    hoverColor: "hover:from-emerald-600 hover:to-teal-700",
    borderColor: "border-emerald-200",
    lightBg: "bg-emerald-50"
  },
  {
    title: "Distribution Mindset",
    description: "Deliverables and QC mapped from day one for digital platforms and festivals.",
    iconName: "Globe",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    hoverColor: "hover:from-orange-600 hover:to-red-700",
    borderColor: "border-orange-200",
    lightBg: "bg-orange-50"
  }
];

const IconMap = {
  Feather, Film, Layout, Globe
};

// Individual Item Component
const ApproachCard = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const Icon = IconMap[item.iconName];

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-[#f2f7f5] rounded-[2rem] p-8 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 scale-95'
      } hover:-translate-y-2 hover:shadow-2xl`}
      style={{ 
        transitionDelay: `${index * 150}ms`,
        boxShadow: isVisible ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      {/* Animated Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffa8ba] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out rounded-b-[2rem]"></div>
      
      <div className="flex justify-between items-start mb-6">
        {/* Large Icon Container */}
        <div className="w-16 h-16 bg-[#fa5246]/10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-[#fa5246]">
          <Icon className="w-8 h-8 text-[#fa5246] transition-colors duration-500 group-hover:text-white" />
        </div>
        
        {/* Circular Arrow Button */}
        <div className="w-12 h-12 rounded-full bg-[#fa5246]/10 flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-[#00473e]">
          <ArrowUpRight className="w-5 h-5 text-[#fa5246] transition-colors duration-500 group-hover:text-white" />
        </div>
      </div>

      <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300 text-[#00473e] group-hover:text-[#003d3a]`}>
        {item.title}
      </h3>
      
      <p className="text-slate-600 text-lg leading-relaxed group-hover:text-slate-700 transition-colors">
        {item.description}
      </p>

          </div>
  );
};

const ApproachSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-32 bg-[#f2f7f5]"
      aria-labelledby="approach-heading"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between mb-24 border-b-2 border-[#00473e] pb-8">
        <div 
          className={`transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
          <div className="px-4 py-2 bg-[#faae2b] rounded-full">
            <span className="text-sm font-bold text-[#00473e] tracking-widest uppercase">Our Philosophy</span>
          </div>
        </div>
          <h1 id="approach-heading" className="text-4xl md:text-6xl font-black bg-[#00473e] bg-clip-text text-transparent tracking-tight">
            The Approach
          </h1>
        </div>
        <p className={`mt-6 md:mt-0 text-[#475d5b] max-w-md text-right text-lg transition-all duration-1000 delay-300 ease-out transform ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
        }`}>
          We combine creative passion with strategic execution to bring stories to life.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
        {approaches.map((item, index) => (
          <ApproachCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ApproachSection;
