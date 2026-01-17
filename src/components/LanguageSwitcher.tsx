import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language === 'he' ? 'he' : 'en';
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span>{currentLang === 'en' ? 'עב' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;
