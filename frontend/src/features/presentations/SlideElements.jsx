import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-javascript';

const getElementStyle = (element) => ({
  position: 'absolute',
  width: `${element.width}%`,
  height: `${element.height}%`,
  left: `${element.x}%`,
  top: `${element.y}%`,
  border: '1px solid #e5e7eb',
  backgroundColor: 'white', 
  padding: '8px', 
  overflow: 'hidden', 
  borderRadius: '4px', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
});

export const TextElement = ({ element, onDoubleClick, onContextMenu }) => {
  return (
    <div
      style={{
        ...getElementStyle(element),
        fontSize: `${element.fontSize}em`,
        color: element.color,
        overflow: 'hidden',
        textAlign: 'left',
      }}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="select-none"
    >
      {element.text}
    </div>
  );
};

export const ImageElement = ({ element, onDoubleClick, onContextMenu }) => {
  return (
    <div
      style={getElementStyle(element)}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="select-none"
    >
      <img
        src={element.src}
        alt={element.alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const VideoElement = ({ element, onDoubleClick, onContextMenu }) => {
  return (
    <div
      style={getElementStyle(element)}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="select-none"
    >
      <iframe
        src={`${element.url}${element.autoplay ? '&autoplay=1' : ''}`}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export const CodeElement = ({ element, onDoubleClick, onContextMenu }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [element.code, element.language]);

  return (
    <div
      style={getElementStyle(element)}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="select-none"
    >
      <pre
        style={{ fontSize: `${element.fontSize}em` }}
        className="h-full overflow-auto m-0"
      >
        <code
          ref={codeRef}
          className={`language-${element.language}`}
        >
          {element.code}
        </code>
      </pre>
    </div>
  );
};