import { useState, useEffect } from 'react';
import { detectLanguage } from './constants';

export const TextElementModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [data, setData] = useState({
    width: initialData?.width || '30',
    height: initialData?.height || '20',
    text: initialData?.text || '',
    fontSize: initialData?.fontSize || '1',
    color: initialData?.color || '#000000',
    x: initialData?.x || '0',
    y: initialData?.y || '0'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Add Text Element</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(data);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Width (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={data.width}
              onChange={(e) => setData({ ...data, width: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={data.height}
              onChange={(e) => setData({ ...data, height: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Text</label>
            <textarea
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size (em)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={data.fontSize}
              onChange={(e) => setData({ ...data, fontSize: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={data.color}
              onChange={(e) => setData({ ...data, color: e.target.value })}
              className="mt-1 block w-full"
              required
            />
          </div>
          {initialData && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.x}
                  onChange={(e) => setData({ ...data, x: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.y}
                  onChange={(e) => setData({ ...data, y: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
            </>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
