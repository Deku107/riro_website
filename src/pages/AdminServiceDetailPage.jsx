import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVICES_DATA, MOCK_PROJECTS } from '../components/services/constants';

const AdminServiceDetailPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // Find service by ID
    const foundService = SERVICES_DATA.find(s => s.id === serviceId);
    if (!foundService) {
      navigate('/admin/service-cards');
      return;
    }

    setService(foundService);
    setProjects(MOCK_PROJECTS[serviceId] || []);
    setIsLoading(false);
  }, [serviceId, navigate]);

  const handleBackToServices = () => {
    navigate('/admin/service-cards');
  };

  const handleAddProject = () => {
    setEditingProject({
      id: `p${serviceId}-${projects.length + 1}`,
      title: '',
      director: '',
      year: new Date().getFullYear().toString(),
      description: '',
      thumbnailUrl: '',
      youtubeEmbedUrl: '',
      youtubeUrl: '',
      cast: [],
      crew: []
    });
    setIsAddingNew(true);
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
  };

  const handleSaveProject = () => {
    if (isAddingNew) {
      const newProjects = [...projects, editingProject];
      setProjects(newProjects);
      // In real app, save to database
      console.log('Adding new project:', editingProject);
    } else {
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id ? editingProject : p
      );
      setProjects(updatedProjects);
      // In real app, save to database
      console.log('Updating project:', editingProject);
    }
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      // In real app, save to database
      console.log('Deleting project:', projectId);
    }
  };

  const handleToggleProjectExpansion = (projectId) => {
    // This would be for preview purposes
    console.log('Toggle project:', projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Service not found</div>
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
                onClick={handleBackToServices}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Services
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                <p className="text-gray-600">Manage {service.title} Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Key Roles</h3>
              <div className="flex flex-wrap gap-1">
                {service.details.map((role, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Crew</h3>
              <div className="flex flex-wrap gap-1">
                {service.crew.map((role, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cast</h3>
              <div className="flex flex-wrap gap-1">
                {service.cast.map((role, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Projects ({projects.length})</h2>
            <button
              onClick={handleAddProject}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Project
            </button>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 rounded-lg border border-gray-200">
                  {/* Project Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-gray-600">{project.director} • {project.year}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Media</h4>
                      <div className="text-sm text-gray-600">
                        <div>Thumbnail: {project.thumbnailUrl || 'Not set'}</div>
                        <div>YouTube: {project.youtubeUrl ? '✓' : 'Not set'}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cast ({project.cast?.length || 0})</h4>
                      <div className="text-sm text-gray-600">
                        {project.cast?.slice(0, 3).join(', ')}
                        {project.cast?.length > 3 && ` +${project.cast.length - 3} more`}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Crew ({project.crew?.length || 0})</h4>
                      <div className="text-sm text-gray-600">
                        {project.crew?.slice(0, 3).join(', ')}
                        {project.crew?.length > 3 && ` +${project.crew.length - 3} more`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No projects found</div>
              <button
                onClick={handleAddProject}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Add Your First Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {isAddingNew ? 'Add New Project' : 'Edit Project'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                  <input
                    type="text"
                    value={editingProject.director}
                    onChange={(e) => setEditingProject({...editingProject, director: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={editingProject.thumbnailUrl}
                    onChange={(e) => setEditingProject({...editingProject, thumbnailUrl: e.target.value})}
                    placeholder="/src/assets/Services/thumbnail.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={editingProject.youtubeUrl}
                    onChange={(e) => setEditingProject({...editingProject, youtubeUrl: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Embed URL</label>
                  <input
                    type="text"
                    value={editingProject.youtubeEmbedUrl}
                    onChange={(e) => setEditingProject({...editingProject, youtubeEmbedUrl: e.target.value})}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cast (comma-separated)</label>
                <textarea
                  value={editingProject.cast?.join(', ') || ''}
                  onChange={(e) => setEditingProject({...editingProject, cast: e.target.value.split(', ').filter(Boolean)})}
                  rows={2}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crew (comma-separated)</label>
                <textarea
                  value={editingProject.crew?.join(', ') || ''}
                  onChange={(e) => setEditingProject({...editingProject, crew: e.target.value.split(', ').filter(Boolean)})}
                  rows={2}
                  placeholder="Role 1 - Name, Role 2 - Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {isAddingNew ? 'Add Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServiceDetailPage;
