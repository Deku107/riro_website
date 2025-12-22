import React, { useEffect } from 'react';

const ProcessPageHeader = () => {
  useEffect(() => {
    // Smooth scroll behavior for internal navigation
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <main className="section-y scroll-smooth bg-[#f2f7f5]">
      {/* Full width background header */}
      <div className="bg-[#f2f7f5] py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="pt-24 pb-16 text-center animate-fadeIn">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wide mb-6 border border-brand-100 hover:bg-brand-100 transition-colors cursor-default">
              Redefining Production
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#00473e] mb-8 tracking-tight leading-tight">
              From Script to Screen.<br/>
              <span className="text-[#00473e]">Seamlessly.</span>
            </h1>
            <p className="text-xl text-[#00473e] max-w-2xl mx-auto leading-relaxed">
              Experience a production ecosystem designed for transparency, creativity, and speed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProcessPageHeader;
