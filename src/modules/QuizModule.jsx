import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconCheck, IconX, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import MarkdownRenderer from '../components/MarkdownRenderer'
import './QuizModule.css'

function QuizModule({ module, onComplete }) {
    const { content } = module
    const { t } = useTranslation()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)

    const question = content.questions[currentQuestion]
    const totalQuestions = content.questions.length
    const isLast = currentQuestion === totalQuestions - 1

    const handleAnswer = (optionIndex) => {
        if (showResults) return

        setAnswers(prev => ({
            ...prev,
            [question.id]: optionIndex
        }))
    }

    const handleNext = () => {
        if (isLast) {
            setShowResults(true)
            onComplete()
        } else {
            setCurrentQuestion(prev => prev + 1)
        }
    }

    const handleReset = () => {
        setCurrentQuestion(0)
        setAnswers({})
        setShowResults(false)
    }

    const calculateScore = () => {
        let correct = 0
        content.questions.forEach(q => {
            if (answers[q.id] === q.correctIndex) {
                correct++
            }
        })
        return correct
    }

    if (showResults) {
        const score = calculateScore()
        const percentage = Math.round((score / totalQuestions) * 100)

        return (
            <div className="quiz-results">
                <div className="results-header">
                    <div className={`results-score ${percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'}`}>
                        {percentage}%
                    </div>
                    <h3>
                        {percentage >= 70 ? t('excellentWork') : percentage >= 50 ? t('notBad') : t('keepPracticing')}
                    </h3>
                    <p>{score} / {totalQuestions} {t('correctAnswers')}</p>
                </div>

                <div className="results-details">
                    {content.questions.map((q) => {
                        const userAnswer = answers[q.id]
                        const isCorrect = userAnswer === q.correctIndex

                        return (
                            <div key={q.id} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="result-icon">
                                    {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
                                </div>
                                <div className="result-content">
                                    <p className="result-question">{q.question}</p>
                                    <p className="result-answer">
                                        {t('yourAnswerWas')} <span>{q.options[userAnswer]}</span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="result-correct">
                                            {t('correctAnswer')} <span>{q.options[q.correctIndex]}</span>
                                        </p>
                                    )}
                                    {q.explanation && (
                                        <div className="result-explanation">
                                            <MarkdownRenderer content={q.explanation} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Button variant="outline" onClick={handleReset} icon={<IconRefresh size={18} />}>
                    {t('restartQuiz')}
                </Button>
            </div>
        )
    }

    const selectedAnswer = answers[question.id]

    return (
        <div className="quiz-module">
            <div className="quiz-progress">
                <span>{t('question')} {currentQuestion + 1} / {totalQuestions}</span>
                <div className="quiz-progress-bar">
                    <div
                        className="quiz-progress-fill"
                        style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="quiz-question"
            >
                <h3>{question.question}</h3>

                <div className="quiz-options">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                            onClick={() => handleAnswer(index)}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="quiz-actions">
                <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === undefined}
                >
                    {isLast ? t('seeResults') : t('nextQuestion')}
                </Button>
            </div>
        </div>
    )
}

export default QuizModule
