import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@/store/languageStore'

/**
 * Custom hook for using translations throughout the app
 * Returns both the translation function and language utilities
 */
export const useTranslate = () => {
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const isArabic = language === 'ar'
  const isEnglish = language === 'en'

  const changeLanguage = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return {
    t,
    language,
    isArabic,
    isEnglish,
    changeLanguage,
    i18n
  }
}

export default useTranslate
