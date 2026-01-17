import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { IconBook2, IconPlus, IconSun, IconMoon, IconLanguage, IconCheck } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import './Layout.css'

const LANGUAGES = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
]

function Layout() {
    const location = useLocation()
    const { t, i18n } = useTranslation()
    const { theme, toggleTheme, setLang } = useApp()
    const [langMenuOpen, setLangMenuOpen] = useState(false)
    const langMenuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setLangMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentLang = LANGUAGES.find(l => l.code === i18n.language)

    return (
        <div className="layout">
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <IconBook2 size={28} stroke={1.5} />
                        <span>{t('appName')}</span>
                    </Link>
                    <nav className="nav">
                        {/* Language Selector */}
                        <div className="lang-selector" ref={langMenuRef}>
                            <button
                                className="icon-btn"
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                aria-label="Select language"
                            >
                                <span className="lang-flag">{currentLang?.flag}</span>
                                <IconLanguage size={18} />
                            </button>
                            {langMenuOpen && (
                                <div className="lang-menu">
                                    {LANGUAGES.map(language => (
                                        <button
                                            key={language.code}
                                            className={`lang-option ${i18n.language === language.code ? 'active' : ''}`}
                                            onClick={() => {
                                                setLang(language.code)
                                                setLangMenuOpen(false)
                                            }}
                                        >
                                            <span className="lang-flag">{language.flag}</span>
                                            <span>{language.label}</span>
                                            {i18n.language === language.code && <IconCheck size={16} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            className="icon-btn"
                            onClick={toggleTheme}
                            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
                            title={theme === 'light' ? t('darkMode') : t('lightMode')}
                        >
                            {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
                        </button>

                        {/* New Course Button */}
                        <Link
                            to="/create"
                            className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
                        >
                            <IconPlus size={20} stroke={1.5} />
                            <span>{t('newCourse')}</span>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="main">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">
                    <p>{t('footer')}</p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
