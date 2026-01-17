import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { IconCheck, IconX, IconRefresh, IconGripVertical } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import './DragDropModule.css'

function DragDropModule({ module, onComplete }) {
    const { content } = module
    const { t } = useTranslation()

    // Shuffle items initially
    const shuffledItems = useMemo(() => {
        return [...content.items].sort(() => Math.random() - 0.5)
    }, [content.items])

    const [categoryItems, setCategoryItems] = useState(() => {
        const initial = {}
        content.categories.forEach(cat => {
            initial[cat] = []
        })
        return initial
    })
    const [unassigned, setUnassigned] = useState(shuffledItems)
    const [showResults, setShowResults] = useState(false)

    const handleDragEnd = (item, targetCategory) => {
        // Remove from unassigned
        setUnassigned(prev => prev.filter(i => i.id !== item.id))

        // Remove from any other category
        setCategoryItems(prev => {
            const newState = { ...prev }
            Object.keys(newState).forEach(cat => {
                newState[cat] = newState[cat].filter(i => i.id !== item.id)
            })
            // Add to target category
            if (targetCategory) {
                newState[targetCategory] = [...newState[targetCategory], item]
            }
            return newState
        })
    }

    const handleRemoveFromCategory = (item) => {
        setCategoryItems(prev => {
            const newState = { ...prev }
            Object.keys(newState).forEach(cat => {
                newState[cat] = newState[cat].filter(i => i.id !== item.id)
            })
            return newState
        })
        setUnassigned(prev => [...prev, item])
    }

    const handleSubmit = () => {
        setShowResults(true)
        onComplete()
    }

    const handleReset = () => {
        const reshuffled = [...content.items].sort(() => Math.random() - 0.5)
        setUnassigned(reshuffled)
        setCategoryItems(() => {
            const initial = {}
            content.categories.forEach(cat => {
                initial[cat] = []
            })
            return initial
        })
        setShowResults(false)
    }

    const isItemCorrect = (item, category) => {
        return item.category === category
    }

    const allAssigned = unassigned.length === 0

    const correctCount = Object.entries(categoryItems).reduce((count, [cat, items]) => {
        return count + items.filter(item => isItemCorrect(item, cat)).length
    }, 0)

    return (
        <div className="dragdrop-module">
            {content.instruction && (
                <p className="dragdrop-instruction">{content.instruction}</p>
            )}

            {/* Unassigned Items */}
            {unassigned.length > 0 && (
                <div className="unassigned-items">
                    <p className="section-label">{t('elementsToSort')}</p>
                    <div className="items-pool">
                        {unassigned.map(item => (
                            <div key={item.id} className="draggable-item">
                                <IconGripVertical size={16} className="grip-icon" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="categories-grid">
                {content.categories.map(category => (
                    <div key={category} className="category-zone">
                        <div className="category-header">{category}</div>
                        <div
                            className="category-dropzone"
                            onClick={() => {
                                if (unassigned.length > 0) {
                                    handleDragEnd(unassigned[0], category)
                                }
                            }}
                        >
                            {categoryItems[category].length === 0 ? (
                                <p className="dropzone-placeholder">{t('clickToAdd')}</p>
                            ) : (
                                <div className="category-items">
                                    {categoryItems[category].map(item => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            className={`category-item ${showResults ? (isItemCorrect(item, category) ? 'correct' : 'incorrect') : ''}`}
                                        >
                                            <span>{item.text}</span>
                                            {!showResults && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveFromCategory(item)
                                                    }}
                                                >
                                                    <IconX size={14} />
                                                </button>
                                            )}
                                            {showResults && (
                                                <span className="result-icon">
                                                    {isItemCorrect(item, category) ? (
                                                        <IconCheck size={16} />
                                                    ) : (
                                                        <IconX size={16} />
                                                    )}
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showResults && (
                <div className={`dragdrop-results ${correctCount === content.items.length ? 'success' : 'partial'}`}>
                    <div className="results-icon">
                        {correctCount === content.items.length ? <IconCheck size={20} /> : <IconX size={20} />}
                    </div>
                    <span>
                        {correctCount} / {content.items.length} {t('elementsCorrect')}
                    </span>
                </div>
            )}

            <div className="dragdrop-actions">
                {!showResults ? (
                    <Button onClick={handleSubmit} disabled={!allAssigned}>
                        {t('checkAnswers')}
                    </Button>
                ) : (
                    <Button variant="outline" onClick={handleReset} icon={<IconRefresh size={18} />}>
                        {t('restart')}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default DragDropModule
