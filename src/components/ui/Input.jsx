import { forwardRef } from 'react'
import clsx from 'clsx'
import './Input.css'

const Input = forwardRef(function Input({
    label,
    error,
    className,
    type = 'text',
    ...props
}, ref) {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input
                ref={ref}
                type={type}
                className={clsx('input', error && 'input-error', className)}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    )
})

export default Input
