import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { signIn, isAuthenticated } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/')
        return null
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            setError(t('fillAllFields'))
            return
        }

        setLoading(true)
        setError('')

        try {
            await signIn('password', { email, password, flow: 'signIn' })
            navigate('/')
        } catch (err) {
            setError(t('loginError'))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            await signIn('google')
        } catch (err) {
            setError(t('loginError'))
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
                    <h1>{t('login')}</h1>
                    <p>{t('loginDescription')}</p>
                </div>

                <Card className="auth-card">
                    <Card.Content>
                        <form onSubmit={handleEmailLogin} className="auth-form">
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

                            {error && <div className="error-message">{error}</div>}

                            <Button
                                type="submit"
                                size="lg"
                                loading={loading}
                                className="auth-btn"
                            >
                                {t('login')}
                            </Button>
                        </form>

                        <div className="auth-divider">
                            <span>{t('or')}</span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            icon={<IconBrandGoogle size={20} />}
                            className="google-btn"
                        >
                            {t('loginWithGoogle')}
                        </Button>
                    </Card.Content>

                    <Card.Footer>
                        <p className="auth-footer-text">
                            {t('noAccount')}{' '}
                            <Link to="/register">{t('register')}</Link>
                        </p>
                    </Card.Footer>
                </Card>
            </motion.div>
        </div>
    )
}

export default Login
