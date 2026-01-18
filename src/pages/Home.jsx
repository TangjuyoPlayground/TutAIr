import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconSparkles, IconBook, IconClock, IconChevronRight, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useCourses } from '../hooks/useCourses'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Progress from '../components/ui/Progress'
import Badge from '../components/ui/Badge'
import './Home.css'

function Home() {
    const { courses, isLoading, deleteCourse } = useCourses()
    const { t } = useTranslation()

    const handleDelete = async (e, courseId) => {
        e.preventDefault()
        e.stopPropagation()
        if (window.confirm(t('deleteConfirm'))) {
            await deleteCourse(courseId)
        }
    }

    const getLevelBadge = (level) => {
        switch (level) {
            case 'beginner':
                return <Badge variant="success">{t('beginner')}</Badge>
            case 'intermediate':
                return <Badge variant="warning">{t('intermediate')}</Badge>
            case 'advanced':
                return <Badge variant="destructive">{t('advanced')}</Badge>
            default:
                return <Badge variant="secondary">{level}</Badge>
        }
    }

    return (
        <div className="container">
            <motion.div
                className="home-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="hero-icon">
                    <IconSparkles size={48} stroke={1.5} />
                </div>
                <h1>{t('heroTitle')}</h1>
                <p className="hero-description">
                    {t('heroDescription')}
                </p>
                <Link to="/create">
                    <Button size="lg" icon={<IconSparkles size={20} />}>
                        {t('createCourse')}
                    </Button>
                </Link>
            </motion.div>

            {courses.length > 0 && (
                <motion.section
                    className="courses-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>{t('yourCourses')}</h2>
                    <div className="courses-grid">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Link to={`/course/${course._id}`} className="course-link">
                                    <Card hover className="course-card">
                                        <Card.Header>
                                            <div className="course-header-row">
                                                <Card.Title>{course.title}</Card.Title>
                                                <button
                                                    className="delete-btn"
                                                    onClick={(e) => handleDelete(e, course._id)}
                                                    aria-label={t('deleteCourse')}
                                                >
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                            <Card.Description>{course.description}</Card.Description>
                                        </Card.Header>
                                        <Card.Content>
                                            <div className="course-meta">
                                                {getLevelBadge(course.level)}
                                                <span className="course-time">
                                                    <IconClock size={14} />
                                                    {course.estimatedTime}
                                                </span>
                                                <span className="course-modules">
                                                    <IconBook size={14} />
                                                    {course.modules?.length || 0} {t('modules')}
                                                </span>
                                            </div>
                                            <div className="course-progress">
                                                <span className="progress-label">{t('progression')}</span>
                                                <Progress value={course.progress || 0} showLabel />
                                            </div>
                                        </Card.Content>
                                        <Card.Footer>
                                            <span className="continue-text">
                                                {t('continue')} <IconChevronRight size={16} />
                                            </span>
                                        </Card.Footer>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {courses.length === 0 && (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <IconBook size={64} stroke={1} className="empty-icon" />
                    <h3>{t('noCourses')}</h3>
                    <p>{t('noCoursesDesc')}</p>
                </motion.div>
            )}
        </div>
    )
}

export default Home
