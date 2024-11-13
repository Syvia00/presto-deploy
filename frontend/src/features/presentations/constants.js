export const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  CODE: 'code'
};
  
export const PROGRAMMING_LANGUAGES = {
  C: 'c',
  PYTHON: 'python',
  JAVASCRIPT: 'javascript'
};
  
// Function to detect programming language from code
export const detectLanguage = (code) => {
  // Simple detection based on keywords and syntax
  if (code.includes('def ') || code.includes('import ') || 'print(' in code) {
    return PROGRAMMING_LANGUAGES.PYTHON;
  } else if (code.includes('function') || code.includes('const ') || code.includes('let ')) {
    return PROGRAMMING_LANGUAGES.JAVASCRIPT;
  } else if (code.includes('int main') || code.includes('#include')) {
    return PROGRAMMING_LANGUAGES.C;
  }
  return PROGRAMMING_LANGUAGES.JAVASCRIPT; // default
};