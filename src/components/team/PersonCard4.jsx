export default function PersonCard4() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-5xl mx-auto bg-white rounded-3xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Profile Card */}
      <div className="flex-shrink-0 w-full lg:w-64">
        <div className="bg-gradient-to-br from-custom-900 to-custom-900 rounded-3xl shadow-lg h-80 lg:h-80 flex flex-col overflow-hidden p-2 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white flex-1 flex items-center justify-center p-4 rounded-2xl relative overflow-hidden group">
            <img 
              src="src/assets/teampage/male2.png" 
              alt="Team Member 4"
              className="w-40 h-40 lg:w-48 lg:h-52 object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-center text-white p-4 transform transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg lg:text-xl font-bold mb-1">Dheeraj Sirsat</h3>
            <p className="text-custom-900-100 text-sm">Editor & Colourist</p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-custom-900 to-custom-900 rounded-3xl p-4 lg:p-6 shadow-lg h-80 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-white space-y-3 lg:space-y-4">
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              Editor & Colourist<span className="font-semibold">finding the emotional throughline buried</span>, under all your takes and making it hit exactly how it's supposed to.
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              He's obsessively story-driven, the kind of editor who won't let a frame exist unless it earns its place in the narrative.
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              Color, rhythm, pacing—it all serves the feeling, the moment, the truth you're chasing. He doesn't just edit your project; he makes sure your story gets told the way it deserves to be told.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
