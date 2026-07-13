import React, { createContext, useContext, useState, useEffect } from 'react';
import { Colors, HighContrastColors } from '../theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const colors = isHighContrast ? HighContrastColors : Colors;

  return (
    <ThemeContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
