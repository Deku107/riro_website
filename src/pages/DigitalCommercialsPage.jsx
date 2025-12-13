import React from 'react';
import { useNavigate } from 'react-router-dom';

const DigitalCommercialsPage = () => {
  const navigate = useNavigate();

  const handleBackToServices = () => {
    navigate('/');
    // Scroll to services section after navigation
    setTimeout(() => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#00473e]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#00473e]/95 backdrop-blur-sm border-b border-[#2D5A4C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackToServices}
            className="flex items-center gap-2 text-[#f2f7f5] hover:text-[#F2B656] transition-colors text-sm sm:text-base font-medium"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#fffffe] tracking-tight mt-2">
            Digital Commercials
            <span className="block h-1 w-16 sm:w-20 lg:w-24 bg-[#F2B656] mt-2 rounded-full"></span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center py-12 sm:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[#0F3D32]/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#F2B656]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Coming Soon</h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                We're working on bringing you amazing digital commercial projects. 
                Check back soon to see our latest work in brand storytelling and visual marketing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {['Brand Storytelling', 'Product Launches', 'Social Media Campaigns'].map((service, index) => (
                <div key={index} className="bg-[#0F3D32]/30 rounded-lg p-4 border border-[#2D5A4C]/30">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F2B656]/20 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#F2B656]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium text-sm sm:text-base mb-2">{service}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Exciting projects in development</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCommercialsPage;
