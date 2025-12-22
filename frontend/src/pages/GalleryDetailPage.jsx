import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { scrollToSectionWithRetry } from '../utils/scrollToSection';

const GalleryDetailPage = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cld = new Cloudinary({ cloud: { cloudName: 'dow6mrkpm' } });
  const getCloudinaryImage = (publicId) =>
    cld.image(publicId).format('auto').quality('auto');

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3001/api/gallery/${galleryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.length) {
          setIsLoading(false);
          return;
        }

        // Extract folder name from first image
        const folderName = data[0].asset_folder.split('/').pop();

        // Transform API response into object with title, description, and photos
        const galleryObj = {
          id: folderName,
          title: folderName,
          description: `Gallery of ${folderName}`,
          photos: data
            .filter((img) => img.public_id !== `thumbnail_${folderName}`) // exclude thumbnail
            .map((img) => img.public_id),
          thumbnail: data.find((img) => img.public_id.startsWith('thumbnail'))?.public_id || null
        };

        setGallery(galleryObj);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [galleryId]);

  const handleBackToGallery = () => {
    // Navigate to home page first
    navigate('/', { replace: false });
    
    // Use enhanced scrollToSectionWithRetry for reliable mobile navigation
    setTimeout(() => {
      scrollToSectionWithRetry('gallery');
    }, 500);
  };

  // Handle image click for lightbox
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Navigate to next/previous image in lightbox
  const navigateImage = (direction) => {
    if (!gallery) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((prev) =>
        prev === gallery.photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === 0 ? gallery.photos.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gallery not found</h1>
          <button
            onClick={handleBackToGallery}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-transparent sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToGallery}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Gallery
            </button>
            <h1 className="text-xl font-semibold text-gray-900 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg">{gallery.title}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {gallery.description}
          </p>
        </div>

        {/* Photo Grid Collage Design */}
        <div className="relative">
          {/* Vertical Scroll Container - Fixed Scrolling */}
          <div 
            className="overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
            style={{ height: '750px', scrollBehavior: 'smooth' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Masonry Grid Container with Auto Aspect Ratio */}
            <div className="columns-1 sm:columns-1 lg:columns-2 xl:columns-2 gap-6 space-y-6 py-6 min-h-full">
          {gallery.photos.map((photo, index) => {
              return (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className="break-inside-avoid mb-4 overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 group relative"
            >
                  <div className="w-full relative">
                    {/* Image with Natural Aspect Ratio */}
              <AdvancedImage
                cldImg={getCloudinaryImage(photo)}
                      className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      style={{ aspectRatio: 'auto' }}
                      onError={(e) => {
                        // Fallback for missing images
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback Placeholder */}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" 
                      style={{ display: 'none' }}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-3"></div>
                        <p className="text-gray-600 text-sm font-medium">Photo {index + 1}</p>
            </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-medium">Photo {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-90">Click to view</span>
                            <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <AdvancedImage
              cldImg={getCloudinaryImage(gallery.photos[selectedImageIndex])}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {selectedImageIndex + 1} / {gallery.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDetailPage;
