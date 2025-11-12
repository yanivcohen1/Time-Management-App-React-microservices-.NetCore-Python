import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const getCurrentTheme = (): ThemeMode => {
  const themeAttr = document.documentElement.getAttribute('data-bs-theme');
  return themeAttr === 'dark' ? 'dark' : 'light';
};

export const useTheme = (): ThemeMode => {
  const [theme, setTheme] = useState<ThemeMode>(getCurrentTheme);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
          setTheme(getCurrentTheme());
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
