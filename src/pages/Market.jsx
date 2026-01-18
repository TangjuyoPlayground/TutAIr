import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSearch, IconTag, IconPlus, IconBook, IconClock, IconUser, IconCheck, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useMarketplace } from '../hooks/useCourses'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import './Market.css'

function Market() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [addedCourses, setAddedCourses] = useState(new Set())

    const { courses, popularTags, isLoading, cloneCourse } = useMarketplace({
        tags: selectedTags,
        search: searchQuery,
    })

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedTags([])
    }

    const handleAddCourse = async (courseId) => {
        try {
            const newCourseId = await cloneCourse(courseId)
            setAddedCourses(prev => new Set([...prev, courseId]))
            // Navigate to the new course after a short delay
            setTimeout(() => {
                navigate(`/course/${newCourseId}`)
            }, 1000)
        } catch (error) {
            console.error('Error cloning course:', error)
        }
    }

    const getLevelBadge = (level) => {
        const variants = {
            beginner: 'success',
            intermediate: 'warning',
            advanced: 'destructive'
        }
        return <Badge variant={variants[level] || 'default'}>{t(level)}</Badge>
    }

    const hasFilters = searchQuery || selectedTags.length > 0

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="market-page"
            >
                {/* Header */}
                <div className="market-header">
                    <h1>{t('marketplace')}</h1>
                    <p>{t('marketplaceDescription')}</p>
                </div>

                {/* Search and Filters */}
                <div className="market-filters">
                    <div className="search-box">
                        <IconSearch size={20} />
                        <input
                            type="text"
                            placeholder={t('searchCourses')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>
                                <IconX size={16} />
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    {popularTags.length > 0 && (
                        <div className="tags-section">
                            <div className="tags-header">
                                <IconTag size={18} />
                                <span>{t('filterByTags')}</span>
                                {hasFilters && (
                                    <button className="clear-filters" onClick={clearFilters}>
                                        {t('clearFilters')}
                                    </button>
                                )}
                            </div>
                            <div className="tags-list">
                                {popularTags.map(({ tag, count }) => (
                                    <button
                                        key={tag}
                                        className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                        <span className="tag-count">{count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="market-results">
                    {isLoading ? (
                        <div className="loading-state">{t('loading')}</div>
                    ) : courses.length === 0 ? (
                        <div className="empty-state">
                            <IconBook size={48} />
                            <h3>{t('noCoursesFound')}</h3>
                            <p>{t('noCoursesFoundDesc')}</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            <AnimatePresence mode="popLayout">
                                {courses.map((course, index) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: 0.05 * index }}
                                        layout
                                    >
                                        <Card hover className="market-course-card">
                                            <Card.Header>
                                                <Card.Title>{course.title}</Card.Title>
                                                <Card.Description>{course.description}</Card.Description>
                                            </Card.Header>
                                            <Card.Content>
                                                <div className="course-meta">
                                                    {getLevelBadge(course.level)}
                                                    {course.estimatedTime && (
                                                        <span className="course-time">
                                                            <IconClock size={14} />
                                                            {course.estimatedTime}
                                                        </span>
                                                    )}
                                                    <span className="course-modules">
                                                        <IconBook size={14} />
                                                        {course.modules?.length || 0} {t('modules')}
                                                    </span>
                                                </div>

                                                {course.tags && course.tags.length > 0 && (
                                                    <div className="course-tags">
                                                        {course.tags.slice(0, 3).map(tag => (
                                                            <span key={tag} className="course-tag">{tag}</span>
                                                        ))}
                                                        {course.tags.length > 3 && (
                                                            <span className="course-tag more">+{course.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="course-author">
                                                    <IconUser size={14} />
                                                    <span>{t('by')} {course.authorName || 'Anonymous'}</span>
                                                </div>
                                            </Card.Content>
                                            <Card.Footer>
                                                {addedCourses.has(course._id) ? (
                                                    <Button variant="success" disabled className="add-btn">
                                                        <IconCheck size={18} />
                                                        {t('added')}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleAddCourse(course._id)}
                                                        className="add-btn"
                                                    >
                                                        <IconPlus size={18} />
                                                        {t('addToMyCourses')}
                                                    </Button>
                                                )}
                                            </Card.Footer>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Results count */}
                {!isLoading && courses.length > 0 && (
                    <div className="results-count">
                        {courses.length} {t('coursesFound')}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default Market
