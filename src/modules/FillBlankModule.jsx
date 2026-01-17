import { useState, useMemo } from 'react'
import { IconCheck, IconX, IconRefresh, IconBulb } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import './FillBlankModule.css'

function FillBlankModule({ module, onComplete }) {
    const { content } = module
    const { t } = useTranslation()
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [showHints, setShowHints] = useState({})

    // Parse text to find blanks
    const parsedContent = useMemo(() => {
        const parts = []
        let lastIndex = 0
        const regex = /\{\{blank:([^}]+)\}\}/g
        let match

        while ((match = regex.exec(content.text)) !== null) {
            // Add text before the blank
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: content.text.slice(lastIndex, match.index)
                })
            }

            // Add blank
            const blankId = match[1]
            parts.push({
                type: 'blank',
                id: blankId
            })

            lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < content.text.length) {
            parts.push({
                type: 'text',
                content: content.text.slice(lastIndex)
            })
        }

        return parts
    }, [content.text])

    const handleInputChange = (blankId, value) => {
        setAnswers(prev => ({
            ...prev,
            [blankId]: value
        }))
    }

    const toggleHint = (blankId) => {
        setShowHints(prev => ({
            ...prev,
            [blankId]: !prev[blankId]
        }))
    }

    const handleSubmit = () => {
        setShowResults(true)
        onComplete()
    }

    const handleReset = () => {
        setAnswers({})
        setShowResults(false)
        setShowHints({})
    }

    const getBlankInfo = (blankId) => {
        return content.blanks?.find(b => b.id === blankId) || { answer: blankId }
    }

    const isCorrect = (blankId) => {
        const blank = getBlankInfo(blankId)
        const userAnswer = (answers[blankId] || '').trim().toLowerCase()
        const correctAnswer = blank.answer.trim().toLowerCase()
        return userAnswer === correctAnswer
    }

    const allAnswered = content.blanks?.every(b => answers[b.id]?.trim()) ?? false
    const correctCount = content.blanks?.filter(b => isCorrect(b.id)).length ?? 0
    const totalBlanks = content.blanks?.length ?? 0

    return (
        <div className="fillblank-module">
            <div className="fillblank-content">
                {parsedContent.map((part, index) => {
                    if (part.type === 'text') {
                        return <span key={index}>{part.content}</span>
                    }

                    const blank = getBlankInfo(part.id)
                    const isAnswerCorrect = isCorrect(part.id)

                    return (
                        <span key={index} className="blank-wrapper">
                            <input
                                type="text"
                                className={`blank-input ${showResults ? (isAnswerCorrect ? 'correct' : 'incorrect') : ''}`}
                                value={answers[part.id] || ''}
                                onChange={(e) => handleInputChange(part.id, e.target.value)}
                                disabled={showResults}
                                placeholder="..."
                                style={{ width: `${Math.max(blank.answer.length * 10, 60)}px` }}
                            />
                            {!showResults && blank.hint && (
                                <button
                                    className="hint-toggle"
                                    onClick={() => toggleHint(part.id)}
                                    title={t('hint')}
                                >
                                    <IconBulb size={14} />
                                </button>
                            )}
                            {showHints[part.id] && blank.hint && (
                                <span className="blank-hint">{blank.hint}</span>
                            )}
                            {showResults && !isAnswerCorrect && (
                                <span className="correct-answer">{blank.answer}</span>
                            )}
                        </span>
                    )
                })}
            </div>

            {showResults && (
                <div className={`fillblank-results ${correctCount === totalBlanks ? 'success' : 'partial'}`}>
                    <div className="results-icon">
                        {correctCount === totalBlanks ? <IconCheck size={20} /> : <IconX size={20} />}
                    </div>
                    <span>
                        {correctCount} / {totalBlanks} {t('correctAnswers')}
                    </span>
                </div>
            )}

            <div className="fillblank-actions">
                {!showResults ? (
                    <Button onClick={handleSubmit} disabled={!allAnswered}>
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

export default FillBlankModule
