"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations, getTranslation, isRTL } from "@/utils/i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /* Original keyof type commented to preserve history:
  t: (key: keyof typeof mockTranslations['en']) => string;
  */
  t: (key: keyof typeof translations['en']) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  /* Original fallback commented to preserve history:
  t: (key) => mockTranslations['en'][key],
  */
  t: (key) => translations['en'][key],
  isRtl: false
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  // Simple mock persist
  useEffect(() => {
    const saved = localStorage.getItem("mock_locale") as Locale;
    /* Original check commented to preserve history:
    if (saved && mockTranslations[saved]) {
    */
    if (saved && translations[saved]) {
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

  /* Original function commented to preserve history:
  const t = (key: keyof typeof mockTranslations['en']) => getTranslation(locale, key);
  */
  const t = (key: keyof typeof translations['en']) => getTranslation(locale, key);

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t, isRtl: isRTL(locale) }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
