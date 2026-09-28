import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageConfig } from '../shared/types.js';
import { DICTIONARIES, TranslationsDict } from '../lib/i18n.js';

interface LanguageContextType {
  lang: SupportedLanguage;
  config: LanguageConfig;
  dict: TranslationsDict;
  isRtl: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>('en');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check path prefix: /ar, /bn, /de, /es, /fr, /en
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code as string);

    let initialLang: SupportedLanguage | null = null;

    if (supportedCodes.includes(firstPart)) {
      initialLang = firstPart as SupportedLanguage;
    } else {
      const stored = localStorage.getItem('cryptova_lang') as SupportedLanguage;
      if (stored && supportedCodes.includes(stored)) {
        initialLang = stored;
      }
    }

    if (initialLang) {
      setLangState(initialLang);
      applyLanguageDirection(initialLang);
    } else {
      // First visit: show the beautiful language selector modal!
      setShowLanguageModal(true);
    }
  }, []);

  const applyLanguageDirection = (targetLang: SupportedLanguage) => {
    const isArabic = targetLang === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = targetLang;
  };

  const setLanguage = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    localStorage.setItem('cryptova_lang', newLang);
    applyLanguageDirection(newLang);

    // Update URL prefix without reloading
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code as string);

    let remaining = pathParts;
    if (pathParts.length > 0 && supportedCodes.includes(pathParts[0])) {
      remaining = pathParts.slice(1);
    }

    const newPath = `/${newLang}${remaining.length > 0 ? '/' + remaining.join('/') : ''}${window.location.search}`;
    window.history.pushState({}, '', newPath);
  };

  const getLocalizedPath = (path: string): string => {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code as string);
    const parts = clean.split('/');
    if (parts.length > 0 && supportedCodes.includes(parts[0])) {
      return `/${lang}/${parts.slice(1).join('/')}`;
    }
    return `/${lang}/${clean}`;
  };

  const config = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  const isRtl = config.dir === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        lang,
        config,
        dict,
        isRtl,
        setLanguage,
        showLanguageModal,
        setShowLanguageModal,
        getLocalizedPath,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
