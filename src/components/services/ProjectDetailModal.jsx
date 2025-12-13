import React, { useState } from 'react';
import VideoPreview from './VideoPreview';
import YouTubeEmbed from './YouTubeEmbed';

const ProjectDetailModal = ({ service, onClose, projects = [] }) => {
  const [loading, setLoading] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const scrollContentRef = React.useRef(null);

  // Mock loading - in real app this would come from API
  React.useEffect(() => {
    setLoading(false);
  }, [projects]);

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

  const handleWheel = (e) => {
    if (scrollContentRef.current) {
      // Allow the modal content to handle the scroll
      scrollContentRef.current.scrollTop += e.deltaY;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#F2B656]/50 backdrop-blur-md pointer-events-auto" onWheel={handleWheel}>
        
        {/* Header */}
        <div className="p-8 border-b border-[#2D5A4C] flex justify-between items-start bg-[#0F3D32]/80 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#F2B656] text-[#0F3D32] text-xs font-bold px-2 py-1 rounded">
                {service.number}
              </span>
              <h2 className="text-3xl font-bold text-white uppercase tracking-wider">{service.title}</h2>
            </div>
            <p className="text-gray-300 max-w-xl">
              Explore our latest work in {service.title.toLowerCase()}. Hover over thumbnails to preview glimpses of our productions.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#14332C]/80" data-modal-content ref={scrollContentRef}>
          {loading ? (
            <div className="text-center text-white/50 py-20">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-white/50 py-20">Projects coming soon...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#0F3D32]/50 rounded-2xl overflow-hidden border border-[#2D5A4C]/50 hover:border-[#F2B656]/50 transition-colors group">
                  {/* Video Area - Not clickable */}
                  <div className="h-64 w-full bg-black">
                    {project.youtubeEmbedUrl ? (
                      <YouTubeEmbed 
                        embedUrl={project.youtubeEmbedUrl}
                        thumbnailUrl={project.thumbnailUrl} 
                        className="w-full h-full"
                      />
                    ) : (
                      <VideoPreview 
                        thumbnailUrl={project.thumbnailUrl} 
                        videoUrl={project.videoUrl} 
                        className="w-full h-full"
                      />
                    )}
                  </div>

                  {/* Project Info - Clickable */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-[#0F3D32]/70 transition-colors"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                        <p className="text-[#F2B656] text-sm font-medium">{project.director} &bull; {project.year}</p>
                      </div>
                      <div className="ml-4">
                        <a 
                          href={project.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-white bg-[#cc0000] hover:bg-[#ff0000] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                          </svg>
                          Watch Full Video
                        </a>
                      </div>
                    </div>
                    
                    <p className={`text-gray-300 text-sm leading-relaxed mb-6 border-l-2 border-[#F2B656] pl-4 ${
                      expandedProjects.has(project.id) ? 'block' : 'hidden'
                    }`}>
                      {project.description}
                    </p>
                    
                    {/* Cast and Crew - Only visible after clicking video */}
                    {expandedProjects.has(project.id) && (
                      <div className="mt-6 pt-6 border-t border-[#2D5A4C]/50 animate-in slide-in-from-top duration-300">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500 font-bold block uppercase mb-1">Cast</span>
                            <div className="flex flex-wrap gap-2">
                              {project.cast.map(c => (
                                <span key={c} className="bg-[#1a4d43]/50 text-gray-300 px-2 py-1 rounded border border-[#2D5A4C]/50">{c}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold block uppercase mb-1">Crew</span>
                            <div className="text-gray-400">
                              {project.crew && project.crew.length > 0 ? (
                                project.crew.slice(0, 7).map((c, i) => (
                                  <div key={i} className="text-xs">{c}</div>
                                ))
                              ) : (
                                <div className="text-xs">Crew details unavailable</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default ProjectDetailModal;
