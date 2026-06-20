import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, themes } from '../themes';

type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: Mode; // keep for backward compatibility, although we stay in dark mostly
  toggleTheme: () => void;
  colorTheme: ThemeName;
  setColorTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Mode>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // defaulting to dark since we removed light
  });

  const [colorTheme, setColorThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('colorTheme') as ThemeName;
    if (saved && themes[saved]) return saved;
    return 'purple-night';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const themeDef = themes[colorTheme];
    
    // Set CSS variables for the color theme
    root.style.setProperty('--color-brand', themeDef.primary);
    root.style.setProperty('--color-brand-hover', themeDef.primaryHover);
    root.style.setProperty('--color-brand-light', themeDef.accent);
    root.style.setProperty('--border-glow', themeDef.glow);
    root.style.setProperty('--bg-gradient-layers', themeDef.bgGradient);
    
    // For convenience in some tailwind classes we might use these directly
    // root.style.setProperty('--accent-glow', themeDef.glow);
    
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorTheme = (newTheme: ThemeName) => {
    setColorThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
