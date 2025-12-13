import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/services/Services.jsx';
import ProcessPageHeader from '../components/process/ProcessPageHeader';
import ApproachSection from '../components/process/Approachsection';
import ProcessSection from '../components/process/Processsection';
import TeamHero from '../components/team/Hero';
import CardSection from '../components/team/CardSection';
import GallerySection from '../components/gallery/GallerySection';
import AboutUsSection from '../components/about/AboutUsSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <ProcessPageHeader />
      <ApproachSection />
      <ProcessSection />
      <TeamHero />
      <CardSection />
      <GallerySection />
      <AboutUsSection />
    </>
  );
};

export default HomePage;
