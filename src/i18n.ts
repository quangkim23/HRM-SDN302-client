import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/locales/en';
import esp from './assets/locales/esp';
const resources = {
  en: {
    translation: en
  },
  esp: {
    translation: esp
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
