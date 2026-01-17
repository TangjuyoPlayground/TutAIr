import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const AppContext = createContext()

const STORAGE_KEY_THEME = 'tutair-theme'

export function AppProvider({ children }) {
    const { i18n } = useTranslation()

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_THEME)
        return saved || 'light'
    })

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY_THEME, theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const setLang = (lang) => {
        i18n.changeLanguage(lang)
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
        lang: i18n.language,
        setLang
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within AppProvider')
    }
    return context
}

export default AppContext
