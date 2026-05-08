import { useState, useEffect, useCallback } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('iss_dashboard_theme');
    if (stored !== null) return stored === 'dark';
    // Default to dark mode
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.add('light-mode');
    }
    localStorage.setItem('iss_dashboard_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}
