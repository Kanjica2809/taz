
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { pt } from '../locales/pt';
import { it } from '../locales/it';

type Translations = typeof pt;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
}

const translations: Record<string, Translations> = {
  pt,
  it
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('pt');
  const [t, setT] = useState<Translations>(translations.pt);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      setT(translations[savedLanguage]);
    } else {
      // Se não houver idioma salvo, usar português como padrão
      setLanguage('pt');
      setT(translations.pt);
      localStorage.setItem('language', 'pt');
    }
  }, []);

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      setT(translations[lang]);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
