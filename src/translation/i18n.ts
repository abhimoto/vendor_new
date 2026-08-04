import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@translation/en.json';
import hi from '@translation/hi.json';
import gj from '@translation/gj.json';
import mr from '@translation/mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gj: { translation: gj },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
