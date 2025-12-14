export default function PersonCard3() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-5xl mx-auto rounded-3xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" style={{backgroundColor: '#f2f7f5'}}>
      {/* Profile Card */}
      <div className="flex-shrink-0 w-full lg:w-64">
        <div className="bg-gradient-to-br from-custom-800 to-custom-800 rounded-3xl shadow-lg h-80 lg:h-80 flex flex-col overflow-hidden p-2 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white flex-1 flex items-center justify-center p-4 rounded-2xl relative overflow-hidden group">
            <img 
              src="src/assets/teampage/female1.png" 
              alt="Team Member 3"
              className="w-40 h-40 lg:w-48 lg:h-52 object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-center text-white p-4 transform transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg lg:text-xl font-bold mb-1">ISHIKA VISHWAKARMA</h3>
            <p className="text-custom-800-100 text-sm">Visualiser</p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-custom-800 to-custom-800 rounded-3xl p-4 lg:p-6 shadow-lg h-80 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-white space-y-3 lg:space-y-4">
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
             Ishika is a<span className="font-semibold">powerful creative talent</span>, Working from her space in Mumbai, she seamlessly moves between art, design, and beautiful lettering. She’s always working on something cool. Whether she's helping a client clarify a new visual concept (visualiser).
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              Exploring feeling through a canvas (artist), or designing a thoughtful phrase with a unique letter form (typographer), she pours her true self into every project. She doesn't rush her work, she focuses on quality and honesty.
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              Ishika’s process is honest and intentional, focused on bringing true meaning to every design and piece of art she creates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
