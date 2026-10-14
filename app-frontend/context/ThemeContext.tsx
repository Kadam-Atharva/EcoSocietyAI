"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  const applyThemeClasses = (targetTheme: ThemeMode) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (targetTheme === "light") {
      root.classList.add("light-theme", "light");
      root.classList.remove("dark");
      body.classList.add("light-theme", "light");
      body.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light-theme", "light");
      root.classList.add("dark");
      body.classList.remove("light-theme", "light");
      body.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("ecosociety_theme") || localStorage.getItem("theme");
      const activeTheme: ThemeMode = stored === "light" ? "light" : "dark";
      setThemeState(activeTheme);
      applyThemeClasses(activeTheme);
    } catch (e) {
      console.warn("Theme initial read error:", e);
      applyThemeClasses("dark");
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" || e.key === "ecosociety_theme") {
        const newTheme = e.newValue === "light" ? "light" : "dark";
        setThemeState(newTheme);
        applyThemeClasses(newTheme);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    startTransition(() => {
      setThemeState(newTheme);
    });
    try {
      localStorage.setItem("theme", newTheme);
      localStorage.setItem("ecosociety_theme", newTheme);
    } catch {}
    applyThemeClasses(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
