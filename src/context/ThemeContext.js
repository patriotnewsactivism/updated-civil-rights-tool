import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
    
    if (savedHighContrast !== null) {
      setHighContrast(savedHighContrast === 'true');
    }
    
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Save theme preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
    
    // Apply theme to document body
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
  }, [darkMode, highContrast, fontSize]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    setHighContrast(prevContrast => !prevContrast);
  };

  // Change font size
  const changeFontSize = (size) => {
    if (['small', 'medium', 'large'].includes(size)) {
      setFontSize(size);
    }
  };

  const value = {
    darkMode,
    highContrast,
    fontSize,
    toggleDarkMode,
    toggleHighContrast,
    changeFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}