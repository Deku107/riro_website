export default function PersonCard2() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-5xl mx-auto bg-white rounded-3xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Profile Card */}
      <div className="flex-shrink-0 w-full lg:w-64">
        <div className="bg-gradient-to-br from-custom-700 to-custom-700 rounded-3xl shadow-lg h-80 lg:h-80 flex flex-col overflow-hidden p-2 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white flex-1 flex items-center justify-center p-0 rounded-2xl relative overflow-hidden group">
            <img 
              src="src/assets/teampage/Ritesh photo.jpeg" 
              alt="Ritesh Verma"
              className="absolute inset-0 w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-center text-white p-4 transform transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg lg:text-xl font-bold mb-1">Ritesh Verma</h3>
            <p className="text-custom-700-100 text-sm">Founder & Creative Producer</p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-custom-700 to-custom-700 rounded-3xl p-4 lg:p-6 shadow-lg h-80 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-white space-y-3 lg:space-y-4">
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              <span className="font-semibold">Ritesh Verma,</span>,the visionary Founder of Riro Talehouse (powered by Anjpix Collectives LLP), is a two-decade architect of magic in the Hindi Film Industry's direction department, having shaped the success of countless celebrated box-office hits.
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              His core mission is a dramatic one: to <span className="font-semibold">shatter the constraints of budget and resource limitations </span>, that stifle brilliant cinematic concepts. Riro Talehouse is the dedicated stage for untapped talent, providing the essential catalyst to transform powerful, untold stories into breathtaking cinematic realities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
