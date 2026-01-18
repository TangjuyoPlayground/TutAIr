import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconSparkles, IconArrowLeft } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { generateCourse } from '../services/aiService'
import { useCourses } from '../hooks/useCourses'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Card from '../components/ui/Card'
import './CreateCourse.css'

function CreateCourse() {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { createCourse } = useCourses()
    const [subject, setSubject] = useState('')
    const [details, setDetails] = useState('')
    const [level, setLevel] = useState('beginner')
    const [publishToMarket, setPublishToMarket] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const LEVELS = [
        { value: 'beginner', label: t('beginner'), description: t('beginnerDesc') },
        { value: 'intermediate', label: t('intermediate'), description: t('intermediateDesc') },
        { value: 'advanced', label: t('advanced'), description: t('advancedDesc') },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!subject.trim()) {
            setError(t('subjectLabel').replace(' *', ''))
            return
        }

        setLoading(true)
        setError('')

        try {
            const fullSubject = details ? `${subject}. ${details}` : subject
            const course = await generateCourse(fullSubject, level, i18n.language)

            // Save to Convex database
            const courseId = await createCourse({
                title: course.title,
                description: course.description,
                level: course.level,
                estimatedTime: course.estimatedTime,
                modules: course.modules,
                lang: course.lang || i18n.language,
                tags: course.tags || [],
                isPublic: publishToMarket,
            })

            navigate(`/course/${courseId}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="create-page"
            >
                <button className="back-btn" onClick={() => navigate('/')}>
                    <IconArrowLeft size={20} />
                    <span>{t('backBtn')}</span>
                </button>

                <div className="create-header">
                    <h1>{t('createTitle')}</h1>
                    <p>{t('createDescription')}</p>
                </div>

                <form onSubmit={handleSubmit} className="create-form">
                    <Card>
                        <Card.Content>
                            <div className="form-group">
                                <Input
                                    label={t('subjectLabel')}
                                    placeholder={t('subjectPlaceholder')}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <Textarea
                                    label={t('detailsLabel')}
                                    placeholder={t('detailsPlaceholder')}
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={3}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('levelLabel')}</label>
                                <div className="level-options">
                                    {LEVELS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`level-option ${level === opt.value ? 'active' : ''}`}
                                            onClick={() => setLevel(opt.value)}
                                            disabled={loading}
                                        >
                                            <span className="level-label">{opt.label}</span>
                                            <span className="level-desc">{opt.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group publish-option">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={publishToMarket}
                                        onChange={(e) => setPublishToMarket(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span>{t('publishToMarket')}</span>
                                </label>
                                <p className="publish-hint">{t('publishToMarketHint')}</p>
                            </div>

                            {error && <div className="error-message">{error}</div>}
                        </Card.Content>

                        <Card.Footer>
                            <Button
                                type="submit"
                                size="lg"
                                loading={loading}
                                icon={!loading && <IconSparkles size={20} />}
                                className="submit-btn"
                            >
                                {loading ? t('generating') : t('generateBtn')}
                            </Button>
                        </Card.Footer>
                    </Card>
                </form>

                {loading && (
                    <motion.div
                        className="loading-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="loading-spinner" />
                        <p>{t('generatingDesc')}</p>
                        <p className="loading-hint">{t('generatingHint')}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default CreateCourse
