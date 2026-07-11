import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");

      if (savedTheme === "dark") {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    } catch (err) {
      console.log("Failed to load theme");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTheme() {
    try {
      const next = !darkMode;

      setDarkMode(next);

      await AsyncStorage.setItem(
        "theme",
        next ? "dark" : "light"
      );
    } catch (err) {
      console.log("Failed to save theme");
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}