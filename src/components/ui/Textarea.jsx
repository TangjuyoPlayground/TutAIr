import { forwardRef } from 'react'
import clsx from 'clsx'
import './Textarea.css'

const Textarea = forwardRef(function Textarea({
    label,
    error,
    className,
    rows = 4,
    ...props
}, ref) {
    return (
        <div className="textarea-wrapper">
            {label && <label className="textarea-label">{label}</label>}
            <textarea
                ref={ref}
                rows={rows}
                className={clsx('textarea', error && 'textarea-error', className)}
                {...props}
            />
            {error && <span className="textarea-error-message">{error}</span>}
        </div>
    )
})

export default Textarea
