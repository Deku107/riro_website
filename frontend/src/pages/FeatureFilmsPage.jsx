import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTubeEmbed from '../components/services/YouTubeEmbed';
import { scrollToSectionWithRetry } from '../utils/scrollToSection';

const FeatureFilmsPage = () => {
  const navigate = useNavigate();
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Fetch projects data from backend
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data['s3'] || []); // s3 is the service ID for feature films
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

  const handleProjectClick = (projectId) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

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
            Feature Films
            <span className="block h-1 w-16 sm:w-20 lg:w-24 bg-[#F2B656] mt-2 rounded-full"></span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">Feature films coming soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-[#0F3D32]/50 rounded-xl lg:rounded-2xl overflow-hidden border border-[#2D5A4C]/50 hover:border-[#F2B656]/50 transition-all duration-300 group">
                
                {/* Video Area */}
                <div className="relative h-48 sm:h-56 lg:h-64 w-full bg-black">
                  {project.youtubeEmbedUrl ? (
                    <YouTubeEmbed 
                      embedUrl={project.youtubeEmbedUrl}
                      thumbnailUrl={project.thumbnailUrl} 
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <p className="text-white/50 text-sm sm:text-base">Video coming soon</p>
                    </div>
                  )}
                </div>

                {/* Project Info - Clickable */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-[#0F3D32]/70 transition-colors"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{project.title}</h3>
                      <p className="text-[#F2B656] text-sm sm:text-base font-medium">{project.director} &bull; {project.year}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <a 
                        href={project.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white bg-[#cc0000] hover:bg-[#ff0000] px-3 sm:px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        <span className="hidden sm:inline">Watch Full Video</span>
                        <span className="sm:hidden">Watch</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* Expandable Content */}
                  <div className={`space-y-4 sm:space-y-6 overflow-hidden transition-all duration-300 ${
                    expandedProjects.has(project.id) ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#F2B656] pl-4">
                      {project.description}
                    </p>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Cast</h4>
                      <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
                        {project.cast.map((member, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F2B656] rounded-full"></span>
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Crew</h4>
                      <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
                        {project.crew.map((member, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F2B656] rounded-full"></span>
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Click Instruction */}
                  <div className={`text-center text-[#F2B656] text-xs sm:text-sm font-medium mt-3 sm:mt-4 transition-opacity duration-300 ${
                    expandedProjects.has(project.id) ? 'opacity-0' : 'opacity-100'
                  }`}>
                    Click to view details
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureFilmsPage;
