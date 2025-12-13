export default function PersonCard5() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-5xl mx-auto bg-white rounded-3xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Profile Card */}
      <div className="flex-shrink-0 w-full lg:w-64">
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl shadow-lg h-80 lg:h-80 flex flex-col overflow-hidden p-2 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white flex-1 flex items-center justify-center p-4 rounded-2xl relative overflow-hidden group">
            <img 
              src="src/assets/teampage/male3.png" 
              alt="Team Member 5"
              className="w-40 h-40 lg:w-48 lg:h-52 object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="text-center text-white p-4 transform transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg lg:text-xl font-bold mb-1">Krishnaa Kumar Shukla</h3>
            <p className="text-pink-100 text-sm">Creative Director</p>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-4 lg:p-6 shadow-lg h-80 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-white space-y-3 lg:space-y-4">
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              A burst of<span className="font-semibold">calm confidence</span>, who carries good vibes like a daily accessory. He turns filmmaking into a smooth, almost effortless art and has a soft spot for catching real, raw moments on the streets.
            </p>
            
            <p className="leading-relaxed text-sm lg:text-base transform transition-all duration-300 hover:translate-x-2">
              On set he’s all focus and warmth, and at parties he surprises everyone with those cool, carefree dance moves that somehow convince even the shyest uncle to join in..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
