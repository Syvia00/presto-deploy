import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditTitleModal, DeleteConfirmModal, SlideControls } from '../features/presentations';

export const PresentationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showError, setShowError] = useState('');
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

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleNewSlide = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const newSlide = {
        id: Date.now().toString(),
        content: [],
      };

      const updatedPresentation = {
        ...presentation,
        slides: [...presentation.slides, newSlide],
      };

      const updatedPresentations = data.store.presentations.map(p => 
        p.id === id ? updatedPresentation : p
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

      setPresentation(updatedPresentation);
      setCurrentSlideIndex(updatedPresentation.slides.length - 1); // Navigate to new slide
    } catch (error) {
      console.error('Failed to create new slide:', error);
    }
  };

  const handleDeleteSlide = async () => {
    if (presentation.slides.length <= 1) {
      setShowError('Cannot delete the only slide. Delete the presentation instead.');
      setTimeout(() => setShowError(''), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
      const updatedPresentation = {
        ...presentation,
        slides: updatedSlides,
      };

      const updatedPresentations = data.store.presentations.map(p => 
        p.id === id ? updatedPresentation : p
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

      setPresentation(updatedPresentation);
      // Navigate to previous slide or stay at current index if it's the first slide
      setCurrentSlideIndex(prev => Math.min(prev, updatedSlides.length - 1));
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  useEffect(() => {
    fetchPresentation();
  }, [id]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!presentation) return;
      
      if (e.key === 'ArrowLeft') {
        handlePreviousSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentation, currentSlideIndex]);

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

        {/* Slide Display */}
        <div className="bg-white rounded-lg shadow-md p-8 min-h-[400px] relative mb-8">
          {/* Slide number */}
          <div className="absolute bottom-4 left-4 w-[50px] h-[50px] flex items-center justify-center text-gray-500">
            {currentSlideIndex + 1}
          </div>
          
          {/* Slide content placeholder */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Slide {currentSlideIndex + 1}</p>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="flex flex-col items-center space-y-4">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousSlide}
              disabled={currentSlideIndex === 0}
              className={`p-2 rounded-full ${
                currentSlideIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              ←
            </button>
            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === presentation.slides.length - 1}
              className={`p-2 rounded-full ${
                currentSlideIndex === presentation.slides.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              →
            </button>
          </div>

          {/* Slide Management Controls */}
          <div className="flex space-x-4">
            <button
              onClick={handleNewSlide}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add New Slide
            </button>
            <button
              onClick={handleDeleteSlide}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Slide
            </button>
          </div>
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

      {/* Error Message */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>{showError}</span>
            <button 
              onClick={() => setShowError('')}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};