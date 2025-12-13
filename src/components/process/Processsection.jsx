import React, { useState } from 'react';
import { StepCard } from './StepCard';
import { MobileArrow } from './ProcessArrows';
import { ProcessStep, ArrowDirection } from './types';
import { 
  LightbulbIcon, 
  PaletteIcon, 
  FileSignatureIcon, 
  WalletIcon, 
  ClapperboardIcon, 
  RocketIcon, 
  TrophyIcon 
} from './Icons';
import ProcessDetails from './ProcessDetails';

const steps = [
  {
    id: 1,
    title: "Idea Submission",
    description: "Submit your raw concept.",
    icon: <LightbulbIcon />
  },
  {
    id: 2,
    title: "Creative Selection",
    description: "Curated by our experts.",
    icon: <PaletteIcon />
  },
  {
    id: 3,
    title: "Agreement Signing",
    description: "Legal Team review.",
    icon: <FileSignatureIcon />
  },
  {
    id: 4,
    title: "Remuneration Paid",
    description: "Accounts processing.",
    icon: <WalletIcon />
  },
  {
    id: 5,
    title: "Production",
    description: "Pre-Production & Post.",
    icon: <ClapperboardIcon />
  },
  {
    id: 6,
    title: "Release",
    description: "Distribution Team.",
    icon: <RocketIcon />
  },
  {
    id: 7,
    title: "Festival Submissions",
    description: "Marketing & PR.",
    icon: <TrophyIcon />
  }
];

// Configuration for desktop snake layout
// We manually assign positioning styles for the 'snake' effect
const getStepConfig = (index) => {
  const isLast = index === steps.length - 1;
  
  // Mapping based on the specific 3-column snake layout:
  // [1] -> [2] -> [3]
  //               |
  // [6] <- [5] <- [4]
  //  |
  // [7] 
  
  let gridClass = "";
  let direction = ArrowDirection.None;

  switch (index) {
    case 0: // Step 1
      gridClass = "lg:col-start-1 lg:row-start-1";
      direction = ArrowDirection.Right;
      break;
    case 1: // Step 2
      gridClass = "lg:col-start-2 lg:row-start-1";
      direction = ArrowDirection.Right;
      break;
    case 2: // Step 3
      gridClass = "lg:col-start-3 lg:row-start-1";
      direction = ArrowDirection.Down;
      break;
    case 3: // Step 4
      gridClass = "lg:col-start-3 lg:row-start-2";
      direction = ArrowDirection.Left;
      break;
    case 4: // Step 5
      gridClass = "lg:col-start-2 lg:row-start-2";
      direction = ArrowDirection.Left;
      break;
    case 5: // Step 6
      gridClass = "lg:col-start-1 lg:row-start-2";
      direction = ArrowDirection.Down;
      break;
    case 6: // Step 7
      gridClass = "lg:col-start-1 lg:row-start-3";
      direction = ArrowDirection.None;
      break;
    default:
      break;
  }

  return { gridClass, direction };
};

export const ProcessSection = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section id="process" className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#00473e] overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#fffffe] tracking-tight">
            How it works
            <span className="block h-1.5 w-24 bg-brand-accent mt-4 rounded-full"></span>
          </h2>
        </div>
        
        {/* Header Content */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start mb-24">
          <div className="lg:col-span-4 space-y-8 flex flex-col justify-start min-h-[400px]">
            <div className="prose prose-lg text-slate-600">
              <h3 className="text-4xl md:text-5xl font-black text-[#fffffe] mb-8">Single Window System</h3>
              <p className="leading-relaxed text-lg text-[#f2f7f5] mb-6">
                At <span className="font-bold text-[#f2f7f5]">RIRO TALEHOUSE</span><sup>®</sup>, we believe that great stories shouldn't die in notebooks just because of budget constraints.
              </p>
              <p className="leading-relaxed text-lg text-[#f2f7f5]">
                That's why we've built a <span className="font-semibold text-brand-accent">Single Window System</span> — a one-stop platform where passionate storytellers can turn their vision into reality without worrying about finances, resources, or reach.
              </p>
              
              {/* Process Details Modal - Above Show Details button on mobile */}
              <div className="lg:hidden">
                <ProcessDetails 
                  isOpen={showDetails} 
                  onClose={() => setShowDetails(false)} 
                />
              </div>
              
              {/* Show Details Button */}
              <button
                onClick={() => setShowDetails(true)}
                className="mt-6 px-6 py-3 bg-[#f2f7f5] text-[#00473e] font-bold rounded-lg hover:bg-[#e8f0ed] transition-colors duration-300"
              >
                Show Details
              </button>
            </div>
          </div>

          {/* Process Flow Visualization */}
          <div className="lg:col-span-8 relative">
            
            {/* Desktop Grid Layout (The Snake) */}
            <div className="hidden lg:grid grid-cols-3 gap-x-16 gap-y-16 relative">
              {steps.map((step, index) => {
                const { gridClass, direction } = getStepConfig(index);
                return (
                  <StepCard 
                    key={step.id} 
                    step={step} 
                    direction={direction}
                    gridArea={gridClass} 
                  />
                );
              })}
            </div>

            {/* Mobile/Tablet Layout (Vertical Stack) */}
            <div className="flex flex-col lg:hidden space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="w-full">
                  <StepCard 
                    step={step} 
                    direction={ArrowDirection.None} // We handle mobile arrows externally
                    gridArea="" 
                  />
                  {index < steps.length - 1 && <MobileArrow />}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      
      {/* Process Details Modal - Desktop version (hidden on mobile) */}
      <div className="hidden lg:block">
        <ProcessDetails 
          isOpen={showDetails} 
          onClose={() => setShowDetails(false)} 
        />
      </div>
    </section>
  );
};

export default ProcessSection;
