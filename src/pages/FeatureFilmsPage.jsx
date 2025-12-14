import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeatureFilmsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch projects data from backend
    fetch('http://localhost:5000/api/projects')
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
    <div className="min-h-screen bg-[#00473e] py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={handleBackToServices}
            className="mb-8 flex items-center gap-2 text-[#f2f7f5] hover:text-[#F2B656] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#fffffe] tracking-tight">
            Feature Films
            <span className="block h-1.5 w-24 bg-brand-accent mt-4 rounded-full"></span>
          </h1>
        </div>

        {/* Empty State */}
        <div className="text-center py-20">
          <p className="text-white/50 text-lg">Feature films coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureFilmsPage;
