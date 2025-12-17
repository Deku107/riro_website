import React from 'react';
import aboutBoard from '../../assets/About us/WEB GRAPHICS_ABOUT US.png';
import couchImage from '../../assets/About us/WEB GRAPHICS_OUR MISSION.png';
import filmSetImage from '../../assets/About us/WEB GRAPHICS_OUR VISION.png';

const AboutUsSection = () => {
  return (
    <section id="about" className="section-padding section-y bg-white scroll-mt-20">
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Page header */}
        <header className="space-y-1 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold">
            RIRO <span className="text-primary">Talehouse</span>
          </h1>
        </header>

        {/* About board + copy frame */}
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 items-center rounded-3xl bg-[#FDFDFD] shadow-soft/40 p-6 md:p-8 ml-0 md:ml-[-20%] transform transition-all duration-300 hover:scale-[1.02] hover:shadow-soft/60">
          <div className="flex justify-center">
            <img
              src={aboutBoard}
              alt="About us board"
              className="w-64 sm:w-80 md:w-96 h-auto transform transition-all duration-500 hover:scale-110 hover:rotate-2"
            />
          </div>
          <div className="space-y-4 text-base md:text-lg lg:text-xl text-muted">
            <p className="transform transition-all duration-300 hover:translate-x-2 hover:text-primary">
              We are a next-gen studio delivering a streamlined script-to-screen experience for
              creators. We produce and distribute short films, music videos, and digital/vertical
              series, and champion select works at major film festivals worldwide.
            </p>
            <p className="transform transition-all duration-300 hover:translate-x-2 hover:text-primary">
              With a single-window model, we keep ideas moving smoothly from development through
              distribution—transparent, efficient, and creator-first.
            </p>
          </div>
        </div>

        {/* Simpsons couch + mission */}
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 items-center ml-0 md:ml-[20%] transform transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-center">
            <img
              src={couchImage}
              alt="Family watching TV on couch"
              className="w-96 sm:w-[32rem] md:w-[36rem] h-auto transform transition-all duration-500 hover:scale-110 hover:rotate-1"
            />
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="font-semibold text-2xl md:text-3xl lg:text-4xl transform transition-all duration-300 hover:scale-105">
              <span className="text-primary mr-1">"</span>Our Mission
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted transform transition-all duration-300 hover:translate-x-2 hover:text-primary">
              To simplify the journey for creators with a single roof for development, finance,
              production, post, digital distribution, and festival strategy—so bold ideas travel
              further.
            </p>
          </div>
        </div>

        {/* Vision + film set */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4 items-center ml-0 md:ml-[20%] transform transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-4 max-w-md md:pt-4">
            <h2 className="font-semibold text-2xl md:text-3xl lg:text-4xl transform transition-all duration-300 hover:scale-105">
              <span className="text-primary mr-1">"</span>Our Vision
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted transform transition-all duration-300 hover:translate-x-2 hover:text-primary">
              To transform RIRO Talehouse into a globally respected single-window hub where stories
              are born, nurtured, funded, and delivered across digital platforms and film festivals
              worldwide.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={filmSetImage}
              alt="Film set illustration"
              className="w-96 sm:w-[32rem] md:w-[40rem] h-auto transform transition-all duration-500 hover:scale-110 hover:-rotate-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
