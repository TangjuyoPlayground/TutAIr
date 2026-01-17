import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { getCourse, updateCourseProgress } from '../services/aiService'
import Progress from '../components/ui/Progress'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ExplanationModule from '../modules/ExplanationModule'
import ExerciseModule from '../modules/ExerciseModule'
import QuizModule from '../modules/QuizModule'
import FillBlankModule from '../modules/FillBlankModule'
import DragDropModule from '../modules/DragDropModule'
import './Course.css'

function Course() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [course, setCourse] = useState(null)
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
    const [moduleCompleted, setModuleCompleted] = useState(false)

    useEffect(() => {
        const courseData = getCourse(id)
        if (!courseData) {
            navigate('/')
            return
        }
        setCourse(courseData)

        // Find first incomplete module
        const firstIncomplete = courseData.modules.findIndex(
            m => !courseData.completedModules?.includes(m.id)
        )
        if (firstIncomplete >= 0) {
            setCurrentModuleIndex(firstIncomplete)
        }
    }, [id, navigate])

    useEffect(() => {
        if (course) {
            const currentModule = course.modules[currentModuleIndex]
            setModuleCompleted(course.completedModules?.includes(currentModule?.id) || false)
        }
    }, [course, currentModuleIndex])

    if (!course) {
        return (
            <div className="container">
                <div className="loading-state">Loading...</div>
            </div>
        )
    }

    const currentModule = course.modules[currentModuleIndex]
    const isFirst = currentModuleIndex === 0
    const isLast = currentModuleIndex === course.modules.length - 1

    const handlePrevious = () => {
        if (!isFirst) {
            setCurrentModuleIndex(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (!isLast) {
            setCurrentModuleIndex(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        const updated = updateCourseProgress(course.id, currentModule.id, true)
        setCourse(updated)
        setModuleCompleted(true)
    }

    const renderModule = () => {
        const props = {
            module: currentModule,
            onComplete: handleComplete
        }

        switch (currentModule.type) {
            case 'explanation':
                return <ExplanationModule {...props} />
            case 'exercise':
                return <ExerciseModule {...props} />
            case 'quiz':
                return <QuizModule {...props} />
            case 'fillblank':
                return <FillBlankModule {...props} />
            case 'dragdrop':
                return <DragDropModule {...props} />
            default:
                return <ExplanationModule {...props} />
        }
    }

    const getModuleTypeBadge = (type) => {
        const types = {
            explanation: { label: t('explanation'), variant: 'info' },
            exercise: { label: t('exercise'), variant: 'warning' },
            quiz: { label: t('quiz'), variant: 'success' },
            fillblank: { label: t('fillblank'), variant: 'secondary' },
            dragdrop: { label: t('dragdrop'), variant: 'secondary' },
            graph: { label: t('graph'), variant: 'info' },
        }
        const config = types[type] || { label: type, variant: 'secondary' }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    return (
        <div className="container">
            <div className="course-page">
                {/* Header */}
                <div className="course-header">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <IconArrowLeft size={20} />
                        <span>{t('backToCourses')}</span>
                    </button>

                    <div className="course-info">
                        <h1>{course.title}</h1>
                        <p>{course.description}</p>
                    </div>

                    <div className="course-progress-bar">
                        <div className="progress-info">
                            <span>{t('moduleOf')} {currentModuleIndex + 1} / {course.modules.length}</span>
                            <span>{course.progress || 0}% {t('completed')}</span>
                        </div>
                        <Progress value={course.progress || 0} />
                    </div>
                </div>

                {/* Module Navigation */}
                <div className="modules-nav">
                    {course.modules.map((mod, index) => (
                        <button
                            key={mod.id}
                            className={`module-nav-item ${index === currentModuleIndex ? 'active' : ''} ${course.completedModules?.includes(mod.id) ? 'completed' : ''}`}
                            onClick={() => setCurrentModuleIndex(index)}
                            title={mod.title}
                        >
                            {course.completedModules?.includes(mod.id) ? (
                                <IconCheck size={14} />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Current Module */}
                <div className="module-container">
                    <div className="module-header">
                        {getModuleTypeBadge(currentModule.type)}
                        <h2>{currentModule.title}</h2>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentModule.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="module-content"
                        >
                            {renderModule()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="module-navigation">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirst}
                            icon={<IconChevronLeft size={20} />}
                        >
                            {t('previous')}
                        </Button>

                        {!moduleCompleted && currentModule.type === 'explanation' && (
                            <Button onClick={handleComplete} icon={<IconCheck size={20} />}>
                                {t('markAsRead')}
                            </Button>
                        )}

                        <Button
                            variant={isLast ? 'secondary' : 'primary'}
                            onClick={isLast ? () => navigate('/') : handleNext}
                            disabled={!moduleCompleted && currentModule.type !== 'explanation'}
                        >
                            {isLast ? t('finishCourse') : t('next')}
                            {!isLast && <IconChevronRight size={20} />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course
