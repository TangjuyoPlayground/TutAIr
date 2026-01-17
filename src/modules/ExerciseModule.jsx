import { useState } from 'react'
import { IconBulb, IconEye, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import Textarea from '../components/ui/Textarea'
import MarkdownRenderer from '../components/MarkdownRenderer'
import './ExerciseModule.css'

function ExerciseModule({ module, onComplete }) {
    const { content } = module
    const { t } = useTranslation()
    const [answer, setAnswer] = useState('')
    const [revealedHints, setRevealedHints] = useState(0)
    const [showSolution, setShowSolution] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const revealNextHint = () => {
        if (revealedHints < content.hints.length) {
            setRevealedHints(prev => prev + 1)
        }
    }

    const handleSubmit = () => {
        setSubmitted(true)
        onComplete()
    }

    const handleShowSolution = () => {
        setShowSolution(true)
        onComplete()
    }

    return (
        <div className="exercise-module">
            <div className="exercise-problem">
                <h4>{t('problemLabel')}</h4>
                <MarkdownRenderer content={content.problem} />
                {content.expectedFormat && (
                    <p className="expected-format">
                        <strong>{t('expectedFormat')}</strong> {content.expectedFormat}
                    </p>
                )}
            </div>

            <div className="exercise-answer">
                <Textarea
                    label={t('yourAnswer')}
                    placeholder={t('answerPlaceholder')}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={5}
                    disabled={submitted || showSolution}
                />
            </div>

            {/* Hints Section */}
            <div className="hints-section">
                <div className="hints-header">
                    <IconBulb size={18} />
                    <span>{t('hints')} ({revealedHints}/{content.hints.length})</span>
                    {revealedHints < content.hints.length && !showSolution && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={revealNextHint}
                        >
                            {t('revealHint')}
                        </Button>
                    )}
                </div>

                {revealedHints > 0 && (
                    <div className="hints-list">
                        {content.hints.slice(0, revealedHints).map((hint, index) => (
                            <div key={index} className="hint-item">
                                <span className="hint-number">{t('hint')} {index + 1}</span>
                                <p>{hint}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="exercise-actions">
                {!submitted && !showSolution && (
                    <>
                        <Button
                            variant="outline"
                            onClick={handleShowSolution}
                            icon={<IconEye size={18} />}
                        >
                            {t('showSolution')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!answer.trim()}
                            icon={<IconCheck size={18} />}
                        >
                            {t('validateAnswer')}
                        </Button>
                    </>
                )}

                {submitted && !showSolution && (
                    <div className="submitted-message">
                        <IconCheck size={20} />
                        <span>{t('answerSubmitted')}</span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowSolution(true)}
                        >
                            {t('showSolution')}
                        </Button>
                    </div>
                )}
            </div>

            {/* Solution */}
            {showSolution && (
                <div className="solution-section">
                    <h4>
                        <IconEye size={18} />
                        {t('solution')}
                    </h4>
                    <div className="solution-content">
                        <MarkdownRenderer content={content.solution} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExerciseModule
