import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLanguage } from '../services/data/dataService';

// English translations
const enTranslations = {
  common: {
    home: 'Home',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    portfolio: 'Portfolio',
    quote: 'Get a Quote',
    learnMore: 'Learn More',
    viewAll: 'View All',
    submit: 'Submit',
    send: 'Send',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'Error',
    noResults: 'No results found',
    readMore: 'Read More',
    contactUs: 'Contact Us',
    getQuote: 'Get a Quote',
    exploreServices: 'Explore Services',
    products: 'Products',
    categories: 'Categories',
    features: 'Features',
    specifications: 'Specifications',
    relatedProducts: 'Related Products',
    requestQuote: 'Request Quote',
    viewDetails: 'View Details',
    allServices: 'All Services',
    ourServices: 'Our Services',
    whatsNext: "What's Next",
    recentProjects: 'Recent Projects',
    industrialCarpentry: 'Industrial Carpentry & CNC Production',
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    nav: {
      industries: 'Industries',
      technology: 'Technology',
      company: 'Company',
    },
  },
};

// Hebrew translations
const heTranslations = {
  common: {
    home: 'בית',
    services: 'שירותים',
    about: 'אודות',
    contact: 'צור קשר',
    portfolio: 'תיק עבודות',
    quote: 'קבל הצעת מחיר',
    learnMore: 'למידע נוסף',
    viewAll: 'צפה בהכל',
    submit: 'שלח',
    send: 'שלח',
    back: 'חזרה',
    next: 'הבא',
    loading: 'טוען...',
    error: 'שגיאה',
    noResults: 'לא נמצאו תוצאות',
    readMore: 'קרא עוד',
    contactUs: 'צור קשר',
    getQuote: 'קבל הצעת מחיר',
    exploreServices: 'חקור שירותים',
    products: 'מוצרים',
    categories: 'קטגוריות',
    features: 'תכונות',
    specifications: 'מפרט טכני',
    relatedProducts: 'מוצרים קשורים',
    requestQuote: 'בקש הצעת מחיר',
    viewDetails: 'צפה בפרטים',
    allServices: 'כל השירותים',
    ourServices: 'השירותים שלנו',
    whatsNext: 'מה חדש',
    recentProjects: 'פרויקטים אחרונים',
    industrialCarpentry: 'נגרות תעשייתית ועיבוד CNC',
    footer: {
      rights: 'כל הזכויות שמורות',
      privacy: 'מדיניות פרטיות',
      terms: 'תנאי שימוש',
    },
    nav: {
      industries: 'תעשיות',
      technology: 'טכנולוגיה',
      company: 'חברה',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      he: heTranslations,
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Sync language with dataService
i18n.on('languageChanged', (lng) => {
  const lang = lng === 'he' ? 'he' : 'en';
  setLanguage(lang);
  
  // Update document direction
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
});

// Set initial language
const initialLang = i18n.language === 'he' ? 'he' : 'en';
setLanguage(initialLang);
document.documentElement.dir = initialLang === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;

