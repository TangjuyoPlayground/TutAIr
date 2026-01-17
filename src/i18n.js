import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import fr from './locales/fr'
import en from './locales/en'
import es from './locales/es'

// Get saved language or detect from browser
const getSavedLanguage = () => {
    const saved = localStorage.getItem('tutair-lang')
    if (saved && ['fr', 'en', 'es'].includes(saved)) return saved

    const browserLang = navigator.language.split('-')[0]
    if (['fr', 'en', 'es'].includes(browserLang)) return browserLang

    return 'en'
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: fr },
            en: { translation: en },
            es: { translation: es }
        },
        lng: getSavedLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes
        }
    })

// Save language when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('tutair-lang', lng)
})

export default i18n
