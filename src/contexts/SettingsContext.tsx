import React from 'react';

export interface SettingsContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultSettings: SettingsContextType = {
  darkMode: false,
  toggleDarkMode: () => {},
};

const SettingsContext = React.createContext<SettingsContextType>(defaultSettings);

export default SettingsContext;
