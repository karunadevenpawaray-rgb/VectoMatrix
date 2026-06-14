"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, mockTranslations, getTranslation, isRTL } from "@/utils/i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof mockTranslations['en']) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => mockTranslations['en'][key],
  isRtl: false
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  // Simple mock persist
  useEffect(() => {
    const saved = localStorage.getItem("mock_locale") as Locale;
    if (saved && mockTranslations[saved]) {
      setLocale(saved);
    }
  }, []);

  const changeLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem("mock_locale", l);
    // Apply RTL to root element
    document.documentElement.dir = isRTL(l) ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  const t = (key: keyof typeof mockTranslations['en']) => getTranslation(locale, key);

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t, isRtl: isRTL(locale) }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
