import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconArrowLeft, IconCheck, IconBook, IconPencil, IconQuestionMark, IconForms, IconGripVertical } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useCourse } from '../hooks/useCourses'
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
    const { course, isLoading, updateProgress } = useCourse(id)
    const [completedModules, setCompletedModules] = useState(new Set())
    const moduleRefs = useRef({})

    useEffect(() => {
        if (!isLoading && !course) {
            navigate('/')
            return
        }

        if (course && course.completedModules) {
            setCompletedModules(new Set(course.completedModules))
        }
    }, [course, isLoading, navigate])

    if (isLoading || !course) {
        return (
            <div className="container">
                <div className="loading-state">{t('loading') || 'Loading...'}</div>
            </div>
        )
    }

    const handleComplete = async (moduleId) => {
        await updateProgress(moduleId, true)
        setCompletedModules(prev => new Set([...prev, moduleId]))
    }

    const scrollToModule = (moduleId) => {
        if (moduleRefs.current[moduleId]) {
            moduleRefs.current[moduleId].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    const renderModule = (module) => {
        const isCompleted = completedModules.has(module.id)
        const props = {
            module,
            onComplete: () => handleComplete(module.id)
        }

        let ModuleComponent
        switch (module.type) {
            case 'explanation':
                ModuleComponent = ExplanationModule
                break
            case 'exercise':
                ModuleComponent = ExerciseModule
                break
            case 'quiz':
                ModuleComponent = QuizModule
                break
            case 'fillblank':
                ModuleComponent = FillBlankModule
                break
            case 'dragdrop':
                ModuleComponent = DragDropModule
                break
            default:
                ModuleComponent = ExplanationModule
        }

        return <ModuleComponent {...props} />
    }

    const getModuleTypeBadge = (type) => {
        const types = {
            explanation: { label: t('explanation'), variant: 'info', icon: IconBook },
            exercise: { label: t('exercise'), variant: 'warning', icon: IconPencil },
            quiz: { label: t('quiz'), variant: 'success', icon: IconQuestionMark },
            fillblank: { label: t('fillblank'), variant: 'secondary', icon: IconForms },
            dragdrop: { label: t('dragdrop'), variant: 'secondary', icon: IconGripVertical },
        }
        const config = types[type] || { label: type, variant: 'secondary', icon: IconBook }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const progressPercent = course.modules.length > 0
        ? Math.round((completedModules.size / course.modules.length) * 100)
        : 0

    return (
        <div className="container">
            <div className="course-page course-page-vertical">
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
                            <span>{completedModules.size} / {course.modules.length} {t('modules')}</span>
                            <span>{progressPercent}% {t('completed')}</span>
                        </div>
                        <Progress value={progressPercent} />
                    </div>
                </div>

                {/* Table of Contents - Sticky sidebar */}
                <div className="course-layout">
                    <aside className="course-toc">
                        <div className="toc-header">
                            <h3>{t('tableOfContents') || 'Sommaire'}</h3>
                        </div>
                        <nav className="toc-nav">
                            {course.modules.map((mod, index) => (
                                <button
                                    key={mod.id}
                                    className={`toc-item ${completedModules.has(mod.id) ? 'completed' : ''}`}
                                    onClick={() => scrollToModule(mod.id)}
                                >
                                    <span className="toc-number">
                                        {completedModules.has(mod.id) ? (
                                            <IconCheck size={14} />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    <span className="toc-title">{mod.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* All Modules - Vertical Layout */}
                    <div className="course-modules-vertical">
                        {course.modules.map((module, index) => {
                            const isCompleted = completedModules.has(module.id)

                            return (
                                <motion.div
                                    key={module.id}
                                    ref={el => moduleRefs.current[module.id] = el}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className={`module-section ${isCompleted ? 'completed' : ''}`}
                                >
                                    <div className="module-section-header">
                                        <div className="module-section-info">
                                            <span className="module-number">{t('module') || 'Module'} {index + 1}</span>
                                            {getModuleTypeBadge(module.type)}
                                            {isCompleted && (
                                                <span className="module-completed-badge">
                                                    <IconCheck size={14} />
                                                    {t('completed')}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="module-section-title">{module.title}</h2>
                                    </div>

                                    <div className="module-section-content">
                                        {renderModule(module)}
                                    </div>

                                    {!isCompleted && module.type === 'explanation' && (
                                        <div className="module-section-footer">
                                            <Button
                                                onClick={() => handleComplete(module.id)}
                                                icon={<IconCheck size={20} />}
                                            >
                                                {t('markAsRead')}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Separator between modules */}
                                    {index < course.modules.length - 1 && (
                                        <div className="module-separator" />
                                    )}
                                </motion.div>
                            )
                        })}

                        {/* Course Completion */}
                        {progressPercent === 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="course-completed-banner"
                            >
                                <IconCheck size={48} />
                                <h2>{t('courseCompleted') || 'Cours terminé !'}</h2>
                                <p>{t('courseCompletedDesc') || 'Félicitations, vous avez terminé ce cours.'}</p>
                                <Button onClick={() => navigate('/')}>
                                    {t('backToCourses')}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course
