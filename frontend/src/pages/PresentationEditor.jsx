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
};