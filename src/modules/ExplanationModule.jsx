import { IconBook } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import './ExplanationModule.css'

function ExplanationModule({ module }) {
    const { content } = module
    const { t } = useTranslation()

    // Simple markdown-like rendering
    const renderText = (text) => {
        if (!text) return null

        // Split by code blocks first
        const parts = text.split(/(```[\s\S]*?```)/g)

        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                // Code block
                const lines = part.split('\n')
                const language = lines[0].replace('```', '').trim()
                const code = lines.slice(1, -1).join('\n')
                return (
                    <pre key={index} className="code-block">
                        {language && <span className="code-lang">{language}</span>}
                        <code>{code}</code>
                    </pre>
                )
            }

            // Regular text with inline formatting
            return (
                <div key={index} className="text-content">
                    {part.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('### ')) {
                            return <h4 key={lineIndex}>{line.slice(4)}</h4>
                        }
                        if (line.startsWith('## ')) {
                            return <h3 key={lineIndex}>{line.slice(3)}</h3>
                        }
                        if (line.startsWith('# ')) {
                            return <h2 key={lineIndex}>{line.slice(2)}</h2>
                        }
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                            return <li key={lineIndex}>{renderInline(line.slice(2))}</li>
                        }
                        if (line.match(/^\d+\. /)) {
                            return <li key={lineIndex}>{renderInline(line.replace(/^\d+\. /, ''))}</li>
                        }
                        if (line.trim() === '') {
                            return <br key={lineIndex} />
                        }
                        return <p key={lineIndex}>{renderInline(line)}</p>
                    })}
                </div>
            )
        })
    }

    // Render inline formatting (bold, italic, code)
    const renderInline = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index}>{part.slice(1, -1)}</em>
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="inline-code">{part.slice(1, -1)}</code>
            }
            return part
        })
    }

    return (
        <div className="explanation-module">
            <div className="explanation-content">
                {renderText(content.text)}
            </div>

            {content.keyPoints && content.keyPoints.length > 0 && (
                <div className="key-points">
                    <div className="key-points-header">
                        <IconBook size={18} />
                        <span>{t('keyPoints')}</span>
                    </div>
                    <ul>
                        {content.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ExplanationModule
