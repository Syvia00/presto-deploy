import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditTitleModal, DeleteConfirmModal } from '../features/presentations';

export const PresentationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPresentation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const found = data.store.presentations?.find(p => p.id === id);
      if (found) {
        setPresentation(found);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async (newTitle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const updatedPresentations = data.store.presentations.map(p => 
        p.id === id ? { ...p, name: newTitle } : p
      );

      await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store: {
            ...data.store,
            presentations: updatedPresentations,
          },
        }),
      });

      setPresentation(prev => ({ ...prev, name: newTitle }));
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  const handleUpdateThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5005/store', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        const updatedPresentations = data.store.presentations.map(p => 
          p.id === id ? { ...p, thumbnail: base64String } : p
        );

        await fetch('http://localhost:5005/store', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            store: {
              ...data.store,
              presentations: updatedPresentations,
            },
          }),
        });

        setPresentation(prev => ({ ...prev, thumbnail: base64String }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to update thumbnail:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const updatedPresentations = data.store.presentations.filter(p => p.id !== id);

      await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store: {
            ...data.store,
            presentations: updatedPresentations,
          },
        }),
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  useEffect(() => {
    fetchPresentation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading presentation...</p>
      </div>
    );
  }

  if (!presentation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{presentation.name}</h1>
              <button
                onClick={() => setShowEditTitle(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                ✎
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Thumbnail upload button */}
            <label className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Update Thumbnail
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpdateThumbnail}
              />
            </label>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Presentation
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 min-h-[400px]">
          <p className="text-gray-500 text-center">First slide</p>
        </div>
      </div>

      {/* Modals */}
      <EditTitleModal
        isOpen={showEditTitle}
        onClose={() => setShowEditTitle(false)}
        currentTitle={presentation.name}
        onSubmit={handleUpdateTitle}
      />
      
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};