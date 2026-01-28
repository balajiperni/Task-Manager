// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    bg: {
      primary: isDark ? "gray.900" : "gray.50",
      secondary: isDark ? "gray.800" : "white",
      tertiary: isDark ? "gray.700" : "gray.100",
      card: isDark ? "gray.800" : "white",
      hover: isDark ? "gray.700" : "gray.50",
    },
    text: {
      primary: isDark ? "gray.100" : "gray.800",
      secondary: isDark ? "gray.400" : "gray.600",
      tertiary: isDark ? "gray.500" : "gray.500",
    },
    border: {
      primary: isDark ? "gray.700" : "gray.200",
      secondary: isDark ? "gray.600" : "gray.300",
    },
    gradient: {
      primary: isDark
        ? "linear(to-br, blue.600, indigo.700)"
        : "linear(to-br, blue.500, indigo.600)",
      secondary: isDark
        ? "linear(to-br, purple.600, pink.700)"
        : "linear(to-br, purple.500, pink.600)",
      bg: isDark
        ? "linear(to-br, gray.900, gray.800)"
        : "linear(to-br, blue.50, purple.50)",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};