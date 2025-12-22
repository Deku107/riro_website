import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightbulbIcon, 
  PaletteIcon, 
  FileSignatureIcon, 
  WalletIcon, 
  ClapperboardIcon, 
  RocketIcon, 
  TrophyIcon 
} from './Icons';

// Step details data
const stepDetails = [
  {
    id: 1,
    title: "Idea Submission",
    headline: "Submit Your Creative Vision",
    image: "src/assets/process/Idea Submission.png",
    description: "Share your raw concept with our team. Every great story begins with an idea, and we're here to help you shape it into something extraordinary.",
    icon: <LightbulbIcon />
  },
  {
    id: 2,
    title: "Creative Selection",
    headline: "Expert Curation Process",
    image: "src/assets/process/Creative Selection.png",
    description: "Our creative experts review and select promising concepts. We look for originality, market potential, and storytelling excellence.",
    icon: <PaletteIcon />
  },
  {
    id: 3,
    title: "Agreement Signing",
    headline: "Professional Partnership",
    image: "src/assets/process/Agreement.png",
    description: "Our legal team ensures fair agreements that protect both creators and the platform. Clear terms, transparent process.",
    icon: <FileSignatureIcon />
  },
  {
    id: 4,
    title: "Remuneration Paid",
    headline: "Financial Support",
    image: "src/assets/process/Remuneration.png",
    description: "Our accounts team processes payments efficiently. No more waiting for funds - get the financial support you need when you need it.",
    icon: <WalletIcon />
  },
  {
    id: 5,
    title: "Production",
    headline: "From Concept to Reality",
    image: "src/assets/process/Production.png",
    description: "Complete production support from pre-production planning through post-production. Professional equipment, experienced crew.",
    icon: <ClapperboardIcon />
  },
  {
    id: 6,
    title: "Release",
    headline: "Distribution Excellence",
    image: "src/assets/process/Guaranteed Release.png",
    description: "Our distribution team ensures your content reaches the right audience. Strategic release planning and multi-platform distribution.",
    icon: <RocketIcon />
  },
  {
    id: 7,
    title: "Festival Submissions",
    headline: "Global Recognition",
    image: "src/assets/process/Festival Submissions.png",
    description: "Marketing and PR support for festival submissions. We help your work gain international recognition and awards.",
    icon: <TrophyIcon />
  }
];

const ProcessDetails = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % stepDetails.length);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => (prev - 1 + stepDetails.length) % stepDetails.length);
  };

  if (!isOpen) return null;

  const currentDetail = stepDetails[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute inset-0 flex items-start justify-center pt-8 lg:items-center z-50 bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white shadow-2xl max-w-4xl mx-auto rounded-2xl overflow-hidden"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-[#00473e]">Process Details</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentDetail.image}
                  alt={currentDetail.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='20'%3EImage Coming Soon%3C/text%3E%3C/svg%3E";
                  }}
                />
                {/* Step Number Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-[#00473e] text-white rounded-full flex items-center justify-center font-bold">
                  {currentDetail.id}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 flex flex-col justify-between">
              <div>
                <h4 className="text-3xl font-bold text-[#00473e] mb-2">
                  {currentDetail.headline}
                </h4>
                <h5 className="text-xl font-semibold text-gray-600 mb-4">
                  {currentDetail.title}
                </h5>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {currentDetail.description}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  className="p-3 rounded-full bg-[#00473e] text-white hover:bg-[#003d3a]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Progress Indicators */}
                <div className="flex gap-2">
                  {stepDetails.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-[#00473e]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-[#00473e] text-white hover:bg-[#003d3a]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessDetails;
