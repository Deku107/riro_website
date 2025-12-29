import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const GallerySection = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the same Cloudinary cloud name as configured on the backend (index.php)
  const cld = new Cloudinary({ cloud: { cloudName: 'da7jzdkkt' } });

  const getCloudinaryImage = (publicId) => {
    return cld.image(publicId).format('auto').quality('auto');
  };

  useEffect(() => {
    setIsLoading(true);
     fetch('http://localhost:8000/api/galleries')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          console.log('Galleries loaded:', data); // Debug log
          setGalleries(data);
        } else {
          console.error('Expected array but got:', data);
          setGalleries([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Gallery fetch error:', error);
        setGalleries([]);
        setIsLoading(false);
      });
  }, []);

  const handleThumbnailClick = (galleryId) => {
    navigate(`/gallery/${galleryId}`);
  };

  return (
    <section 
      id="gallery" 
      className="section-y bg-white scroll-mt-20 relative py-16 lg:py-24"
      style={{
        backgroundImage: 'url("/src/assets/Gallary/Gallary bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-white/95"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Gallery
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Behind the scenes moments and production highlights from our creative journey
          </p>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading galleries...</p>
            </div>
          ) : (
            <>
              <div 
                className="overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
                style={{ height: '750px', scrollBehavior: 'smooth' }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="columns-1 md:columns-2 lg:columns-2 xl:columns-3 gap-8 py-6 min-h-full">
                  {galleries.map((gallery, index) => (
                    <div
                      key={gallery.id}
                      onClick={() => handleThumbnailClick(gallery.id)}
                      className={`break-inside-avoid mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/10 group relative border border-gray-200 ${
                        index % 3 === 0 ? 'h-[28rem]' : index % 3 === 1 ? 'h-[32rem]' : 'h-[24rem]'
                      }`}
                    >
                      <div className="w-full h-full relative">
                        {/* Use AdvancedImage with public_id */}
                        {gallery.thumbnail ? (
                          <AdvancedImage
                            cldImg={getCloudinaryImage(gallery.thumbnail)}
                            alt={gallery.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                            onError={(e) => {
                              console.error('Image load error for:', gallery.thumbnail);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Fallback Placeholder */}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" 
                          style={{ display: gallery.thumbnail ? 'none' : 'flex' }}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600 text-sm font-medium">{gallery.title}</p>
                            <p className="text-gray-500 text-xs mt-2">No thumbnail</p>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center p-8">
                          <div className="text-center text-white transform translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                            <h3 className="text-2xl font-bold mb-4">{gallery.title}</h3>
                            {gallery.imageCount && (
                              <p className="text-sm opacity-80 mb-3">{gallery.imageCount} photos</p>
                            )}
                            <div className="flex items-center gap-3 text-base opacity-90">
                              <span>Explore gallery</span>
                              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                          <span className="text-gray-800 text-sm font-semibold">{index + 1}</span>
                        </div>
                        
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                          {gallery.title.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          
              {galleries.length === 0 && !isLoading && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">No galleries available</p>
                </div>
              )}
              
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: Math.ceil(galleries.length / 6) }).map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-gray-300 rounded-full transition-all duration-300 hover:bg-gray-400"
                  />
                ))}
              </div>
              
              <div className="text-center mt-4 sticky bottom-4">
                <div className="inline-flex items-center gap-2 text-gray-600 text-sm bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span>Scroll to explore</span>
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;