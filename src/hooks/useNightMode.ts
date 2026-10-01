import { useState, useEffect, useCallback } from 'react';

export type NightModePreference = 'auto' | 'dark' | 'light';

export function useNightMode() {
  const [preference, setPreference] = useState<NightModePreference>(() => {
    if (typeof window === 'undefined') return 'auto';
    return (localStorage.getItem('meteo_night_mode') as NightModePreference) || 'auto';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hour = new Date().getHours();
    const isNightTime = hour >= 18 || hour < 6;
    const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isNightTime || prefersDarkMedia;
  });

  const computeEffectiveTheme = useCallback((pref: NightModePreference): boolean => {
    if (pref === 'dark') return true;
    if (pref === 'light') return false;
    // Auto mode: check night time (18:00 to 06:00) or OS preference
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isNight || systemDark;
  }, []);

  const updateTheme = useCallback((pref: NightModePreference) => {
    setPreference(pref);
    localStorage.setItem('meteo_night_mode', pref);
    const activeDark = computeEffectiveTheme(pref);
    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [computeEffectiveTheme]);

  useEffect(() => {
    // Initial evaluation
    const activeDark = computeEffectiveTheme(preference);
    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Interval to re-evaluate auto night mode periodically (every minute)
    const interval = setInterval(() => {
      if (preference === 'auto') {
        const nextDark = computeEffectiveTheme('auto');
        setIsDark(nextDark);
        if (nextDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [preference, computeEffectiveTheme]);

  return {
    preference,
    isDark,
    setPreference: updateTheme,
  };
}
