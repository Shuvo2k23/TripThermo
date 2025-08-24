// contexts/ThemeContext.js
import { createContext, useContext, useState } from 'react';
import { darkTheme, lightTheme } from '../constants/theme'; // Check this path!

// 1. Create the Context with a default value.
// This helps in debugging if a component uses `useTheme` outside a Provider.
export const ThemeContext = createContext({
  theme: lightTheme, // Default to light theme
  toggleTheme: () => {
    console.warn('ToggleTheme function was called outside of a ThemeProvider');
  },
  isDark: false,
});

// 2. Create a custom hook for easy access
export const useTheme = () => useContext(ThemeContext);

// 3. Create the Provider Component that will wrap your app
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  
  // Determine which theme object to use
  const theme = isDark ? darkTheme : lightTheme;

  // 4. Provide the current value (theme, toggle function, state) to all children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};