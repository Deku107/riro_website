import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES_DATA } from '../components/services/constants';

const AdminServiceCardsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceCards] = useState(SERVICES_DATA);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

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

  const handleManageService = (serviceId) => {
    navigate(`/admin/service/${serviceId}`);
  };

  const handleEditCard = (card) => {
    setEditingCard({ ...card });
    setIsAddingNew(false);
  };

  const handleAddNewCard = () => {
    setEditingCard({
      title: '',
      description: '',
      image: '',
      category: 'production',
      active: true
    });
    setIsAddingNew(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('http://localhost:5000/api/team/upload', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          setEditingCard(prev => ({
            ...prev,
            image: result.imageUrl
          }));
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

  const handleSaveCard = () => {
    // In a real application, this would save to a database
    console.log('Saving card:', editingCard);
    setEditingCard(null);
    setIsAddingNew(false);
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this service card?')) {
      console.log('Deleting card:', cardId);
    }
  };

  const handleToggleActive = (cardId) => {
    console.log('Toggling active status for:', cardId);
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
                  console.log('Back to dashboard button clicked!');
                  handleBackToDashboard();
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 relative z-50 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Service Cards Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">All Service Cards</h2>
            <p className="text-gray-600 mt-1">
              {serviceCards.length} services available
            </p>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg p-4">
                <div className="text-white">
                  <div className="text-3xl font-bold mb-2">{card.number}</div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Roles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {card.details.slice(0, 3).map((role, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {role}
                      </span>
                    ))}
                    {card.details.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{card.details.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Crew & Cast:</h4>
                  <div className="text-sm text-gray-600">
                    {card.crew.length} crew roles • {card.cast.length} cast roles
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleManageService(card.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium"
                  >
                    Manage Content
                  </button>
                  <button
                    onClick={() => handleEditCard(card)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {serviceCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No service cards found</div>
            <button
              onClick={handleAddNewCard}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Create Your First Service Card
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {isAddingNew ? 'Add New Service Card' : 'Edit Service Card'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingCard.category}
                    onChange={(e) => setEditingCard({...editingCard, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="production">Production</option>
                    <option value="commercial">Commercial</option>
                    <option value="corporate">Corporate</option>
                    <option value="music">Music</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({...editingCard, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
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
                {editingCard.image && (
                  <div className="mt-2">
                    <img 
                      src={editingCard.image} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (alternative)</label>
                <input
                  type="text"
                  value={editingCard.image}
                  onChange={(e) => setEditingCard({...editingCard, image: e.target.value})}
                  placeholder="/images/services/example.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingCard.active}
                  onChange={(e) => setEditingCard({...editingCard, active: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingCard(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCard}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {isAddingNew ? 'Add Card' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServiceCardsPage;
