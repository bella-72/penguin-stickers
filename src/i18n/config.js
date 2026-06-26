import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import arTranslations from './locales/ar.json'

// Get saved language or default to English
const savedLanguage = localStorage.getItem('penguin-language')
let defaultLanguage = 'en'
if (savedLanguage) {
  const parsed = JSON.parse(savedLanguage)
  defaultLanguage = parsed.state?.language || 'en'
}

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n
