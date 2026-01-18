import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { IconBook2, IconPlus, IconSun, IconMoon, IconLanguage, IconCheck, IconLogout, IconUser } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { useAuth } from '../hooks/useAuth'
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
    const { user, signOut } = useAuth()
    const [langMenuOpen, setLangMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const langMenuRef = useRef(null)
    const userMenuRef = useRef(null)

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setLangMenuOpen(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentLang = LANGUAGES.find(l => l.code === i18n.language)

    const handleLogout = async () => {
        await signOut()
        setUserMenuOpen(false)
    }

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

                        {/* User Menu */}
                        <div className="user-menu-container" ref={userMenuRef}>
                            <button
                                className="user-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                <IconUser size={20} />
                                {user?.name && <span className="user-name">{user.name}</span>}
                            </button>
                            {userMenuOpen && (
                                <div className="user-menu">
                                    {user?.email && (
                                        <div className="user-email">{user.email}</div>
                                    )}
                                    <button className="user-option logout" onClick={handleLogout}>
                                        <IconLogout size={16} />
                                        <span>{t('logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
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

