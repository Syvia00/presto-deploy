import { useState, useCallback } from 'react';

export const DraggableElement = ({ element, onUpdatePosition }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [elementPos, setElementPos] = useState({ x: element.x, y: element.y });

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setElementPos({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    // Calculate the difference in position
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    // Convert pixel movement to percentage based on parent container
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    const deltaXPercent = (deltaX / parentRect.width) * 100;
    const deltaYPercent = (deltaY / parentRect.height) * 100;

    // Calculate new position
    let newX = elementPos.x + deltaXPercent;
    let newY = elementPos.y + deltaYPercent;

    // Constrain to slide boundaries
    newX = Math.max(0, Math.min(100 - element.width, newX));
    newY = Math.max(0, Math.min(100 - element.height, newY));

    onUpdatePosition(newX, newY);
  }, [isDragging, startPos, elementPos, element.width, element.height, onUpdatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  useState(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const cornerStyle = {
    position: 'absolute',
    width: '5px',
    height: '5px',
    backgroundColor: '#000',
    cursor: 'pointer',
  };

  return (
    <>
      {/* Top Left */}
      <div
        style={{
          ...cornerStyle,
          top: '-3px',
          left: '-3px',
        }}
        onMouseDown={handleMouseDown}
      />
      {/* Top Right */}
      <div
        style={{
          ...cornerStyle,
          top: '-3px',
          right: '-3px',
        }}
        onMouseDown={handleMouseDown}
      />
      {/* Bottom Left */}
      <div
        style={{
          ...cornerStyle,
          bottom: '-3px',
          left: '-3px',
        }}
        onMouseDown={handleMouseDown}
      />
      {/* Bottom Right */}
      <div
        style={{
          ...cornerStyle,
          bottom: '-3px',
          right: '-3px',
        }}
        onMouseDown={handleMouseDown}
      />
    </>
  );
};