import React, { useState } from 'react';

const YouTubeEmbed = ({ embedUrl, thumbnailUrl, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasThumbnail = !!thumbnailUrl;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Only load the iframe when hovered to prevent auto-play
  const embedUrlWithAutoplay = embedUrl.includes('?') 
    ? `${embedUrl}&autoplay=1&mute=1` 
    : `${embedUrl}?autoplay=1&mute=1`;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-black group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Image - Only if thumbnail exists */}
      {hasThumbnail && (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* YouTube Embed - Always visible if no thumbnail, otherwise shown on hover */}
      <div className={`youtube-embed-container absolute inset-0 w-full h-full ${
        hasThumbnail 
          ? (isHovered ? 'animate-fade-in' : 'opacity-0 pointer-events-none')
          : 'opacity-100'
      }`}>
        <iframe
          src={hasThumbnail ? (isHovered ? embedUrlWithAutoplay : '') : embedUrlWithAutoplay}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Click Indicator - Only visible if thumbnail exists and not hovered */}
      {hasThumbnail && !isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 p-4 rounded-full backdrop-blur-sm border border-white/20">
            <div className="flex flex-col items-center text-white text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <span className="text-xs font-medium">Hover to play video</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
