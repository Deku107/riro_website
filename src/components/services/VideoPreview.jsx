import React, { useRef, useState } from 'react';

// Helper function to add cache-busting to Cloudinary URLs
const getCacheBustedUrl = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // If URL already has cache-busting parameter, return as is
  if (imageUrl.includes('?t=')) {
    return imageUrl;
  }
  
  // Add timestamp for cache-busting
  const timestamp = Date.now();
  return `${imageUrl}?t=${timestamp}`;
};

const VideoPreview = ({ thumbnailUrl, videoUrl, className = '', onClick }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      setIsLoading(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("Auto-play prevented or interrupted:", error);
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    // Prevent video controls from interfering with click
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-black group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Thumbnail Image - visible when not playing */}
      <img
        src={getCacheBustedUrl(thumbnailUrl)}
        alt="Thumbnail"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Loading Indicator */}
      {isLoading && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Click to Expand Indicator */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/70 p-4 rounded-full backdrop-blur-sm border border-white/20">
            <div className="flex flex-col items-center text-white text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <span className="text-xs font-medium">Click to see synopsis & cast & crew</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
