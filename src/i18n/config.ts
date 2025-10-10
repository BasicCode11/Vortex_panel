import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import km from './locales/km.json';

const resources = {
  en: {
    translation: en,
  },
  km: {
    translation: km,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Update HTML lang attribute and font when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

// Set initial language on HTML element
document.documentElement.setAttribute('lang', i18n.language);

export default i18n;
