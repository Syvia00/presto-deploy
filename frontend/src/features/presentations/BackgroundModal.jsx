import { useState } from 'react';
import { BACKGROUND_TYPES, GRADIENT_DIRECTIONS } from './constants';

export const BackgroundModal = ({ 
  isOpen, 
  onClose, 
  currentSlideBackground,
  defaultBackground,
  onUpdateSlideBackground,
  onUpdateDefaultBackground 
}) => {
  const [activeTab, setActiveTab] = useState('slide'); // 'slide' or 'default'
  const [backgroundType, setBackgroundType] = useState(
    activeTab === 'slide' 
      ? currentSlideBackground?.type || BACKGROUND_TYPES.SOLID 
      : defaultBackground?.type || BACKGROUND_TYPES.SOLID
  );
  const [background, setBackground] = useState(
    activeTab === 'slide' ? currentSlideBackground : defaultBackground
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'slide') {
      onUpdateSlideBackground(background);
    } else {
      onUpdateDefaultBackground(background);
    }
    onClose();
  };

  const renderBackgroundFields = () => {
    switch (backgroundType) {
    case BACKGROUND_TYPES.SOLID:
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            value={background?.color || '#FFFFFF'}
            onChange={(e) => setBackground({
              type: BACKGROUND_TYPES.SOLID,
              color: e.target.value
            })}
            className="mt-1 block w-full"
          />
        </div>
      );

    case BACKGROUND_TYPES.GRADIENT:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Color</label>
            <input
              type="color"
              value={background?.startColor || '#FFFFFF'}
              onChange={(e) => setBackground(prev => ({
                ...prev,
                type: BACKGROUND_TYPES.GRADIENT,
                startColor: e.target.value
              }))}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Color</label>
            <input
              type="color"
              value={background?.endColor || '#000000'}
              onChange={(e) => setBackground(prev => ({
                ...prev,
                type: BACKGROUND_TYPES.GRADIENT,
                endColor: e.target.value
              }))}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Direction</label>
            <select
              value={background?.direction || GRADIENT_DIRECTIONS.TOP_BOTTOM}
              onChange={(e) => setBackground(prev => ({
                ...prev,
                direction: e.target.value
              }))}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value={GRADIENT_DIRECTIONS.TOP_BOTTOM}>Top to Bottom</option>
              <option value={GRADIENT_DIRECTIONS.LEFT_RIGHT}>Left to Right</option>
              <option value={GRADIENT_DIRECTIONS.DIAGONAL}>Diagonal</option>
            </select>
          </div>
        </div>
      );

    case BACKGROUND_TYPES.IMAGE:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={background?.url || ''}
              onChange={(e) => setBackground({
                type: BACKGROUND_TYPES.IMAGE,
                url: e.target.value
              })}
              placeholder="Enter image URL"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Or Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBackground({
                      type: BACKGROUND_TYPES.IMAGE,
                      url: reader.result
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      );

    default:
      return null;
    }
  };

  if (!isOpen) return null;
};