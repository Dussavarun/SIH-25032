'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'contrast' | 'system'
  language: 'en', // 'en' | 'hi'
  fontScale: 'md', // 'sm' | 'md' | 'lg' | 'xl'
  currency: 'INR', // 'INR' | 'USD' | 'EUR'
  isPanelOpen: false,
};

const STORAGE_KEY = 'app_settings_v1';

const SettingsContext = createContext({
  ...DEFAULT_SETTINGS,
  setTheme: () => {},
  setLanguage: () => {},
  setFontScale: () => {},
  setCurrency: () => {},
  openPanel: () => {},
  closePanel: () => {},
  togglePanel: () => {},
  t: (key) => key,
  formatCurrency: (value) => `${value}`,
});

const TRANSLATIONS = {
  en: {
    appName: 'Jharkhand Journeys',
    destinations: 'Destinations',
    'Explore Jharkhand': 'Discover waterfalls, hills, temples and forests across the state.',
    handicrafts: 'Handicrafts',
    plan: 'Plan',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    settings: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    contrast: 'High Contrast',
    language: 'Language',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xlarge: 'Extra Large',
    currency: 'Currency',
    close: 'Close',
  },
  hi: {
    appName: 'झारखंड जर्नीज़',
    destinations: 'गंतव्य',
    'Explore Jharkhand': 'राज्य भर में झरने, पहाड़ियाँ, मंदिर और वन खोजें।',
    handicrafts: 'हस्तशिल्प',
    plan: 'योजना',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    settings: 'सेटिंग्स',
    appearance: 'रूप',
    theme: 'थीम',
    system: 'सिस्टम',
    light: 'लाइट',
    dark: 'डार्क',
    contrast: 'हाई कॉन्ट्रास्ट',
    language: 'भाषा',
    fontSize: 'फॉन्ट आकार',
    small: 'छोटा',
    medium: 'मध्यम',
    large: 'बड़ा',
    xlarge: 'अत्यधिक बड़ा',
    currency: 'मुद्रा',
    close: 'बंद करें',
  },
};

function applyThemeToDocument(theme) {
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark', 'theme-contrast', 'dark');
  if (theme === 'light') {
    root.classList.add('theme-light');
  } else if (theme === 'dark') {
    root.classList.add('theme-dark', 'dark');
  } else if (theme === 'contrast') {
    root.classList.add('theme-contrast', 'dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.add('theme-dark', 'dark');
    else root.classList.add('theme-light');
  }
}

function applyFontScale(scale) {
  const root = document.documentElement;
  root.setAttribute('data-font-scale', scale);
}

function persist(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = loadPersisted();
    if (saved) setSettings((s) => ({ ...s, ...saved }));
  }, []);

  useEffect(() => {
    applyThemeToDocument(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    applyFontScale(settings.fontScale);
  }, [settings.fontScale]);

  // keep <html lang> in sync with language
  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', settings.language);
    } catch {}
  }, [settings.language]);

  useEffect(() => {
    persist({
      theme: settings.theme,
      language: settings.language,
      fontScale: settings.fontScale,
      currency: settings.currency,
    });
  }, [settings.theme, settings.language, settings.fontScale, settings.currency]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = () => settings.theme === 'system' && applyThemeToDocument('system');
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, [settings.theme]);

  const setTheme = useCallback((v) => setSettings((s) => ({ ...s, theme: v })), []);
  const setLanguage = useCallback((v) => setSettings((s) => ({ ...s, language: v })), []);
  const setFontScale = useCallback((v) => setSettings((s) => ({ ...s, fontScale: v })), []);
  const setCurrency = useCallback((v) => setSettings((s) => ({ ...s, currency: v })), []);
  const openPanel = useCallback(() => setSettings((s) => ({ ...s, isPanelOpen: true })), []);
  const closePanel = useCallback(() => setSettings((s) => ({ ...s, isPanelOpen: false })), []);
  const togglePanel = useCallback(() => setSettings((s) => ({ ...s, isPanelOpen: !s.isPanelOpen })), []);

  const t = useCallback(
    (key) => {
      const dict = TRANSLATIONS[settings.language] || TRANSLATIONS.en;
      return dict[key] ?? key;
    },
    [settings.language]
  );

  const formatCurrency = useCallback(
    (value) => {
      try {
        return new Intl.NumberFormat(settings.language, { style: 'currency', currency: settings.currency }).format(value);
      } catch {
        return `${value} ${settings.currency}`;
      }
    },
    [settings.language, settings.currency]
  );

  const api = useMemo(
    () => ({
      ...settings,
      setTheme,
      setLanguage,
      setFontScale,
      setCurrency,
      openPanel,
      closePanel,
      togglePanel,
      t,
      formatCurrency,
    }),
    [settings, setTheme, setLanguage, setFontScale, setCurrency, openPanel, closePanel, togglePanel, t, formatCurrency]
  );

  return <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}


