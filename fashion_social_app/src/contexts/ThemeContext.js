import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState({
    colors: {
      primary: '#1a1a2e',
      accent: '#E91E63',
      secondary: '#9C27B0',
      gold: '#FFD700',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      background: '#F8F9FA',
      card: '#FFFFFF',
      text: '#1A1A2E',
      textSecondary: '#666666',
      border: '#E0E0E0',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 28, fontWeight: 'bold' },
      h3: { fontSize: 24, fontWeight: '600' },
      h4: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
  });

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        updateTheme(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const updateTheme = (dark) => {
    const newTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        primary: dark ? '#F8F9FA' : '#1a1a2e',
        accent: '#E91E63',
        secondary: '#9C27B0',
        gold: '#FFD700',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        background: dark ? '#0F0F1E' : '#F8F9FA',
        card: dark ? '#1A1A2E' : '#FFFFFF',
        text: dark ? '#FFFFFF' : '#1A1A2E',
        textSecondary: dark ? '#CCCCCC' : '#666666',
        border: dark ? '#333333' : '#E0E0E0',
      },
    };
    setTheme(newTheme);
  };

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
    
    try {
      await AsyncStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};