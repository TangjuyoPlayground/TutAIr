import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconMail, IconLock, IconUser } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import './Login.css' // Reuse login styles

function Register() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { signIn, isAuthenticated } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/')
        return null
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError(t('fillAllFields'))
            return
        }

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'))
            return
        }

        if (password.length < 6) {
            setError(t('passwordTooShort'))
            return
        }

        setLoading(true)
        setError('')

        try {
            await signIn('password', {
                email,
                password,
                name,
                flow: 'signUp'
            })
            navigate('/')
        } catch (err) {
            setError(t('registerError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-page"
            >
                <div className="auth-header">
                    <h1>{t('register')}</h1>
                    <p>{t('registerDescription')}</p>
                </div>

                <Card className="auth-card">
                    <Card.Content>
                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-group">
                                <Input
                                    type="text"
                                    label={t('name')}
                                    placeholder={t('namePlaceholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    icon={<IconUser size={18} />}
                                />
                            </div>

                            <div className="form-group">
                                <Input
                                    type="email"
                                    label={t('email')}
                                    placeholder={t('emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    icon={<IconMail size={18} />}
                                />
                            </div>

                            <div className="form-group">
                                <Input
                                    type="password"
                                    label={t('password')}
                                    placeholder={t('passwordPlaceholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    icon={<IconLock size={18} />}
                                />
                            </div>

                            <div className="form-group">
                                <Input
                                    type="password"
                                    label={t('confirmPassword')}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    icon={<IconLock size={18} />}
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <Button
                                type="submit"
                                size="lg"
                                loading={loading}
                                className="auth-btn"
                            >
                                {t('register')}
                            </Button>
                        </form>
                    </Card.Content>

                    <Card.Footer>
                        <p className="auth-footer-text">
                            {t('hasAccount')}{' '}
                            <Link to="/login">{t('login')}</Link>
                        </p>
                    </Card.Footer>
                </Card>
            </motion.div>
        </div>
    )
}

export default Register
