import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSectionWithRetry } from '../utils/scrollToSection';

const MusicVideosPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Fetch projects data from backend
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data['s5'] || []); // s5 is the service ID for music videos
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
        setProjects([]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Debounce scroll handling
      scrollTimeout = setTimeout(() => {
        // Always show header when at top of page
        if (currentScrollY < 50) {
          setIsVisible(true);
        }
        // Hide header when scrolling down past 100px
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } 
        // Only show header when scrolling up significantly (more than 100px)
        else if (lastScrollY - currentScrollY > 100) {
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }, 10); // Small delay to prevent rapid firing
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  const handleBackToServices = () => {
    navigate('/');
    // Use enhanced scrollToSectionWithRetry for reliable mobile navigation
    setTimeout(() => {
      scrollToSectionWithRetry('services');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#00473e]">
      {/* Header */}
      <div className={`sticky top-0 z-40 bg-transparent transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackToServices}
            className="flex items-center gap-2 text-[#f2f7f5] hover:text-[#F2B656] transition-colors text-sm sm:text-base font-medium bg-[#00473e]/80 backdrop-blur-sm px-3 py-2 rounded-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#fffffe] tracking-tight mt-2 bg-[#00473e]/80 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
            Music Videos
            <span className="block h-1 w-16 sm:w-20 lg:w-24 bg-[#F2B656] mt-2 rounded-full"></span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Empty State */}
        <div className="text-center py-20">
          <p className="text-white/50 text-lg">Music videos coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MusicVideosPage;
