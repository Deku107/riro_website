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

export default function PersonCard4({ member }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-5xl mx-auto rounded-3xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" style={{backgroundColor: '#f2f7f5'}}>
      {/* Profile Card */}
      <div className="flex-shrink-0 w-full lg:w-64">
        <div className="bg-gradient-to-br from-custom-900 to-custom-900 rounded-3xl shadow-lg h-80 lg:h-80 flex flex-col overflow-hidden p-2 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white flex-1 flex items-center justify-center p-4 rounded-2xl relative overflow-hidden group">
            <img 
              src={getCacheBustedUrl(member.image) || "src/assets/teampage/Anjali Verma.png"} 
              alt={member.imageAlt || member.name}
              className="w-full h-full object-cover transition-all duration-500"
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                transform: `scale(${member.imageZoom || 1}) translate(${(member.imagePosition?.x || 50) - 50}%, ${(member.imagePosition?.y || 50) - 50}%)`,
                transformOrigin: 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-center text-white p-4 transform transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg lg:text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-custom-900-100 text-sm">{member.role}</p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-custom-900 to-custom-900 rounded-3xl p-4 lg:p-6 shadow-lg h-80 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-white space-y-3 lg:space-y-4">
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
