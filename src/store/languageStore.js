import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',
      
      setLanguage: (lang) => {
        set({ language: lang })
        // Update document direction
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
      },

      isArabic: () => {
        const { language } = set.__state
        return language === 'ar'
      }
    }),
    {
      name: 'penguin-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr'
          document.documentElement.lang = state.language
        }
      }
    }
  )
)
