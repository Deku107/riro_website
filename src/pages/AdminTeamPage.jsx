import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTeamPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  const [editingMember, setEditingMember] = useState(null);


  const [coreTeamMembers, setCoreTeamMembers] = useState(coreTeam);
  const [collaboratorMembers, setCollaboratorMembers] = useState({
  directors: [],
  dop: []
});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);


  useEffect(() => {
  fetch('http://localhost:5000/api/team')
    .then(res => res.json())
    .then(data => {
      setCoreTeamMembers(data.coreTeam);
      setCollaboratorMembers(data.collaborators);
      setIsLoading(false);
    });
}, []);

useEffect(() => {
  if (!isLoading) {
    saveToBackend(coreTeamMembers, collaboratorMembers);
  }
}, [coreTeamMembers, collaboratorMembers]);


  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleEditMember = (member, type) => {
    setEditingMember({ ...member, type });
  };



  const saveToBackend = (core, collaborators) => {
  fetch('http://localhost:5000/api/team/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coreTeam: core,
      collaborators
    })
  });
};


const handleSaveMember = () => {
  if (!editingMember) return;

  if (editingMember.type === 'core') {
    setCoreTeamMembers(prev =>
      prev.map(m => m.id === editingMember.id ? editingMember : m)
    );
  }

  if (editingMember.type === 'director') {
    setCollaboratorMembers(prev => ({
      ...prev,
      directors: prev.directors.map(m =>
        m.id === editingMember.id ? editingMember : m
      )
    }));
  }

  if (editingMember.type === 'dop') {
    setCollaboratorMembers(prev => ({
      ...prev,
      dop: prev.dop.map(m =>
        m.id === editingMember.id ? editingMember : m
      )
    }));
  }

  setEditingMember(null);
};



  const handleDeleteMember = (memberId, type) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      // In a real application, this would delete from database
      console.log('Deleting member:', memberId, type);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('core')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'core'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Core Team ({coreTeamMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('collaborators')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'collaborators'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Collaborators ({collaboratorMembers.directors.length + collaboratorMembers.dop.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'core' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Core Team Members</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add New Member
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreTeamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMember(member, 'core')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id, 'core')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm line-clamp-3">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div>
            {/* Directors */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Directors</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Add Director
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratorMembers.directors.map((director) => (
                  <div key={director.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{director.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMember(director, 'director')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(director.id, 'director')}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{director.role}</p>
                    <p className="text-gray-500 text-sm line-clamp-3">{director.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Directors of Photography */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Directors of Photography</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Add DoP
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratorMembers.dop.map((dop) => (
                  <div key={dop.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{dop.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMember(dop, 'dop')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(dop.id, 'dop')}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{dop.role}</p>
                    <p className="text-gray-500 text-sm line-clamp-3">{dop.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingMember.description}
                  onChange={(e) => setEditingMember({...editingMember, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;
