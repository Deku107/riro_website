import React from 'react';
import PersonCard from './PersonCard';
import PersonCard2 from './PersonCard2';
import PersonCard3 from './PersonCard3';
import PersonCard4 from './PersonCard4';
import PersonCard5 from './PersonCard5';
import PersonCard6 from './PersonCard6';
import { collaborators } from '../../data/teamData';

const CollaboratorCard = ({ collaborator }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h4 className="text-lg font-semibold mb-2">{collaborator.name}</h4>
      <p className="text-gray-600 text-sm mb-2">{collaborator.role}</p>
      <p className="text-gray-700 text-sm">{collaborator.description}</p>
    </div>
  );
};

const CardSection = () => {
  return (
    <section id="team" className="py-16 px-4 scroll-mt-20" style={{backgroundColor: '#f2f7f5'}}>
      <div className="max-w-7xl mx-auto">
        
        {/* CORE TEAM Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-center mb-12" style={{color: '#00473e'}}>CORE TEAM</h2>
          <div className="space-y-12">
            {/* PersonCard2 - 20% left from center */}
            <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up">
              <PersonCard2 />
            </div>
            
            {/* PersonCard - 20% right from center */}
            <div className="flex justify-end pr-[20%] opacity-0 animate-fade-in-up animation-delay-200">
              <PersonCard />
            </div>
            
            {/* PersonCard3 - 20% left from center */}
            <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up animation-delay-400">
              <PersonCard3 />
            </div>
            
            {/* PersonCard4 - 20% right from center */}
            <div className="flex justify-end pr-[20%] opacity-0 animate-fade-in-up animation-delay-600">
              <PersonCard4 />
            </div>
            
            {/* PersonCard5 - 20% left from center */}
            <div className="flex justify-start pl-[20%] opacity-0 animate-fade-in-up animation-delay-800">
              <PersonCard5 />
            </div>
          </div>
        </div>

        {/* COLLABORATORS Section */}
        <div>
          <h2 className="text-4xl font-black text-center mb-12" style={{color: '#00473e'}}>COLLABORATORS</h2>
          
          {/* Directors Subsection */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Director</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborators.directors.map((director) => (
                <CollaboratorCard key={director.id} collaborator={director} />
              ))}
            </div>
          </div>

          {/* DoP Subsection */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">DoP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborators.dop.map((dop) => (
                <CollaboratorCard key={dop.id} collaborator={dop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardSection;
