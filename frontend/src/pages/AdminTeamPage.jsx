import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTeamPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  const [editingMember, setEditingMember] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });

  const [coreTeamMembers, setCoreTeamMembers] = useState([]);
  const [collaboratorMembers, setCollaboratorMembers] = useState({
    directors: [],
    dop: []
  });

  const normalizeTeamData = (data) => {
  const coreTeam = [];
  const collaborators = {
    directors: [],
    dop: []
  };

  data.forEach(item => {
    const normalized = {
      id: Number(item.id),
      name: item.name || '',
      role: item.role || '',
      description: item.description || '',
      imageAlt: item.imageAlt || item.name || '',
      bgColor: item.bgColor || 'bg-blue-100',
      type:
        item.type === 'directors'
          ? 'director'
          : item.type,
      image: item.image || '',
      imageZoom: item.imageZoom ? Number(item.imageZoom) : 1,
      imagePosition: {
        x: item.image_position_x ? Number(item.image_position_x) : 50,
        y: item.image_position_y ? Number(item.image_position_y) : 50
      }
    };

    if (item.type === 'core') {
      coreTeam.push(normalized);
    }

    if (item.type === 'directors') {
      collaborators.directors.push(normalized);
    }

    if (item.type === 'dop') {
      collaborators.dop.push(normalized);
    }
  });

  return { coreTeam, collaborators };
};

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);


  const [isUploading, setIsUploading] = useState(false);

useEffect(() => {
  fetch('/api/team')
    .then(res => res.json())
    .then(rawData => {
      const { coreTeam, collaborators } = normalizeTeamData(rawData);
      setCoreTeamMembers(coreTeam);
      setCollaboratorMembers(collaborators);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Failed to load team:', err);
      setIsLoading(false);
    });
}, []);


useEffect(() => {
  if (!isLoading && !isUploading) {
    saveToBackend(coreTeamMembers, collaboratorMembers);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [coreTeamMembers, collaboratorMembers, isUploading]);


  const handleBackToDashboard = () => {
    console.log('Navigating to dashboard...');
    try {
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = '/admin/dashboard';
    }
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member});
  };

  const handleAddNewMember = (type) => {
    const newMember = {
      name: '',
      role: '',
      description: '',
      imageAlt: '',
      image: '',
      bgColor: type === 'core' ? 'bg-blue-100' : undefined,
      type: type 

    };
    setEditingMember(newMember);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('/api/team/upload', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          setEditingMember(prev => ({
            ...prev,
            image: result.imageUrl,
            imageAlt: prev.name || 'Team member image',
            imageZoom: 1,
            imagePosition: { x: 50, y: 50 }
          }));
          setImageZoom(1);
          setImagePosition({ x: 50, y: 50 });
          
          // Refresh team data from backend after upload
          fetch('/api/team')
            .then(res => res.json())
            .then(rawData => {
              const { coreTeam, collaborators } = normalizeTeamData(rawData);
              setCoreTeamMembers(coreTeam);
              setCollaboratorMembers(collaborators);
            });

        } else {
          console.error('Upload failed:', result.error);
          alert('Upload failed: ' + result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload error: ' + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...imagePosition, [axis]: value };
    setImagePosition(newPosition);
    setEditingMember(prev => ({ ...prev, imagePosition: newPosition }));
  };

  const handleZoomChange = (value) => {
    setImageZoom(value);
    setEditingMember(prev => ({ ...prev, imageZoom: value }));
  };



 const saveToBackend = (core, collaborators) => {
  const flattened = [
    ...core,
    ...collaborators.directors.map(m => ({ ...m, type: 'directors' })),
    ...collaborators.dop.map(m => ({ ...m, type: 'dop' }))
  ].map(m => ({
    ...m,
    imageZoom: String(m.imageZoom),
    image_position_x: String(m.imagePosition?.x ?? 50),
    image_position_y: String(m.imagePosition?.y ?? 50)
  }));

  fetch('/api/team/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flattened)
  });
};



const handleSaveMember = () => {
  if (!editingMember) return;

  if (editingMember.type === 'core') {
    const existingMember = coreTeamMembers.find(m => m.id === editingMember.id);
    if (existingMember) {
      // Update existing member
      setCoreTeamMembers(prev =>
        prev.map(m => m.id === editingMember.id ? editingMember : m)
      );
    } else {
      // Add new member
      setCoreTeamMembers(prev => [...prev, editingMember]);
    }
  }

  if (editingMember.type === 'director') {
    const existingMember = collaboratorMembers.directors.find(m => m.id === editingMember.id);
    if (existingMember) {
      // Update existing director
      setCollaboratorMembers(prev => ({
        ...prev,
        directors: prev.directors.map(m =>
          m.id === editingMember.id ? editingMember : m
        )
      }));
    } else {
      // Add new director
      setCollaboratorMembers(prev => ({
        ...prev,
        directors: [...prev.directors, editingMember]
      }));
    }
  }

  if (editingMember.type === 'dop') {
    const existingMember = collaboratorMembers.dop.find(m => m.id === editingMember.id);
    if (existingMember) {
      // Update existing DOP
      setCollaboratorMembers(prev => ({
        ...prev,
        dop: prev.dop.map(m =>
          m.id === editingMember.id ? editingMember : m
        )
      }));
    } else {
      // Add new DOP
      setCollaboratorMembers(prev => ({
        ...prev,
        dop: [...prev.dop, editingMember]
      }));
    }
  }

  setEditingMember(null);
};



  const handleDeleteMember = async (memberId, type) => {
  if (!window.confirm('Are you sure you want to delete this member?')) return;

  try {
    
    const res = await fetch('/api/team/delete',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ id: memberId })
    }
);

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Delete failed');
    }

    // ✅ Update frontend state ONLY after backend delete succeeds
    if (type === 'core') {
      setCoreTeamMembers(prev => prev.filter(m => m.id !== memberId));
    }

    if (type === 'director') {
      setCollaboratorMembers(prev => ({
        ...prev,
        directors: prev.directors.filter(m => m.id !== memberId)
      }));
    }

    if (type === 'dop') {
      setCollaboratorMembers(prev => ({
        ...prev,
        dop: prev.dop.filter(m => m.id !== memberId)
      }));
    }

  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete member. Please try again.');
  }
};


  const handleMoveMember = (memberId, type, direction) => {
    if (type === 'core') {
      const members = [...coreTeamMembers];
      const index = members.findIndex(m => m.id === memberId);
      
      if (direction === 'up' && index > 0) {
        // Move up
        [members[index - 1], members[index]] = [members[index], members[index - 1]];
        setCoreTeamMembers(members);
      } else if (direction === 'down' && index < members.length - 1) {
        // Move down
        [members[index], members[index + 1]] = [members[index + 1], members[index]];
        setCoreTeamMembers(members);
      }
    }
    
    if (type === 'director') {
      const members = [...collaboratorMembers.directors];
      const index = members.findIndex(m => m.id === memberId);
      
      if (direction === 'up' && index > 0) {
        [members[index - 1], members[index]] = [members[index], members[index - 1]];
        setCollaboratorMembers(prev => ({
          ...prev,
          directors: members
        }));
      } else if (direction === 'down' && index < members.length - 1) {
        [members[index], members[index + 1]] = [members[index + 1], members[index]];
        setCollaboratorMembers(prev => ({
          ...prev,
          directors: members
        }));
      }
    }
    
    if (type === 'dop') {
      const members = [...collaboratorMembers.dop];
      const index = members.findIndex(m => m.id === memberId);
      
      if (direction === 'up' && index > 0) {
        [members[index - 1], members[index]] = [members[index], members[index - 1]];
        setCollaboratorMembers(prev => ({
          ...prev,
          dop: members
        }));
      } else if (direction === 'down' && index < members.length - 1) {
        [members[index], members[index + 1]] = [members[index + 1], members[index]];
        setCollaboratorMembers(prev => ({
          ...prev,
          dop: members
        }));
      }
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log('Button clicked!');
                  handleBackToDashboard();
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 relative z-50 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
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
              <button 
                onClick={() => handleAddNewMember('core')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Member
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreTeamMembers.map((member, index) => (
                <div key={member.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMoveMember(member.id, 'core', 'up')}
                        disabled={index === 0}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveMember(member.id, 'core', 'down')}
                        disabled={index === coreTeamMembers.length - 1}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id,'core')}
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
                <button 
                  onClick={() => handleAddNewMember('director')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Director
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratorMembers.directors.map((director, index) => (
                  <div key={director.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{director.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoveMember(director.id, 'director', 'up')}
                          disabled={index === 0}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveMember(director.id, 'director', 'down')}
                          disabled={index === collaboratorMembers.directors.length - 1}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditMember(director)}
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
                <button 
                  onClick={() => handleAddNewMember('dop')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add DoP
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratorMembers.dop.map((dop, index) => (
                  <div key={dop.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{dop.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoveMember(dop.id, 'dop', 'up')}
                          disabled={index === 0}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveMember(dop.id, 'dop', 'down')}
                          disabled={index === collaboratorMembers.dop.length - 1}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ↓
                        </button>
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
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingMember.name ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                {isUploading && (
                  <div className="mt-2 text-sm text-blue-600">Uploading image...</div>
                )}
                {editingMember.image && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Adjustment</label>
                    <div className="flex gap-4">
                      {/* PersonCard Frame Preview */}
                      <div className="flex-shrink-0">
                        <div className="text-xs text-gray-600 mb-1 text-center">Card Preview</div>
                        <div className="bg-gradient-to-br from-custom-400 to-custom-500 rounded-3xl shadow-lg p-2" style={{ width: '120px', height: '150px' }}>
                          <div className="bg-white rounded-2xl relative overflow-hidden" style={{ height: '110px' }}>
                            <img 
                              src={editingMember.image} 
                              alt="Card Preview" 
                              className="w-full h-full object-cover"
                              style={{
                                transform: `scale(${editingMember.imageZoom || 1}) translate(-${(editingMember.imagePosition?.x || 50) - 50}%, -${(editingMember.imagePosition?.y || 50) - 50}%)`,
                                transformOrigin: 'center'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex-1 space-y-3">
                        {/* Zoom Control */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Zoom</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={editingMember.imageZoom || 1}
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0.5x</span>
                            <span>{(editingMember.imageZoom || 1).toFixed(1)}x</span>
                            <span>2x</span>
                          </div>
                        </div>
                        
                        {/* Position Controls */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Horizontal</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editingMember.imagePosition?.x || 50}
                                onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Vertical</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editingMember.imagePosition?.y || 50}
                                onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                {editingMember.name ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;
