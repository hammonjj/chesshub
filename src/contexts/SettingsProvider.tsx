import React, { ReactNode, useEffect, useState } from 'react';
import SettingsContext, { SettingsContextType } from './SettingsContext';

interface SettingsProviderProps {
  children: ReactNode;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      setDarkMode(JSON.parse(darkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  };

  const value: SettingsContextType = {
    darkMode,
    toggleDarkMode
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
