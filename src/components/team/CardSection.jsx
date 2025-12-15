import React, { useState, useEffect } from 'react';
import PersonCard from './PersonCard';
import PersonCard2 from './PersonCard2';
import PersonCard3 from './PersonCard3';
import PersonCard4 from './PersonCard4';
import PersonCard5 from './PersonCard5';
import PersonCard6 from './PersonCard6';

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
  const [teamData, setTeamData] = useState({
    coreTeam: [],
    collaborators: { directors: [], dop: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/team')
      .then(res => res.json())
      .then(data => {
        setTeamData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch team data:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <section id="team" className="py-16 px-4 scroll-mt-20" style={{backgroundColor: '#f2f7f5'}}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-lg">Loading team data...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-16 px-4 scroll-mt-20" style={{backgroundColor: '#f2f7f5'}}>
      <div className="max-w-7xl mx-auto">
        
        {/* CORE TEAM Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-center mb-12" style={{color: '#00473e'}}>CORE TEAM</h2>
          <div className="space-y-12">
            {/* Dynamically render core team members */}
            {teamData.coreTeam.map((member, index) => {
              // Cycle through PersonCard components for more than 6 members
              const cardComponents = [PersonCard2, PersonCard, PersonCard3, PersonCard4, PersonCard5, PersonCard6];
              const PersonCardComponent = cardComponents[index % cardComponents.length];
              
              const alignment = index % 2 === 0 
                ? 'justify-center lg:justify-start lg:pl-[20%]' 
                : 'justify-center lg:justify-end lg:pr-[20%]';
              const delay = index * 200;
              
              return (
                <div key={member.id} className={`flex flex-col lg:flex-row items-center ${alignment} opacity-0 animate-fade-in-up`} style={{animationDelay: `${delay}ms`}}>
                  <PersonCardComponent member={member} />
                </div>
              );
            })}
          </div>
        </div>

        {/* COLLABORATORS Section */}
        <div>
          <h2 className="text-4xl font-black text-center mb-12" style={{color: '#00473e'}}>COLLABORATORS</h2>
          
          {/* Directors Subsection */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Director</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamData.collaborators.directors.map((director) => (
                <CollaboratorCard key={director.id} collaborator={director} />
              ))}
            </div>
          </div>

          {/* DoP Subsection */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">DoP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamData.collaborators.dop.map((dop) => (
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
