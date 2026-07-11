import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "./colors";

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
      setDarkMode(savedTheme === "dark");
    } catch (err) {
      console.log("Failed to load theme:", err);
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
      console.log("Failed to save theme:", err);
    }
  }

  const colors = useMemo(
    () => (darkMode ? darkColors : lightColors),
    [darkMode]
  );

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        colors,
        loading,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}