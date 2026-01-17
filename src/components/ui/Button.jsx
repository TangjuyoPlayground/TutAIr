import clsx from 'clsx'
import './Button.css'

function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    className,
    ...props
}) {
    return (
        <button
            className={clsx(
                'btn',
                `btn-${variant}`,
                `btn-${size}`,
                loading && 'btn-loading',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" />
            ) : icon ? (
                <span className="btn-icon">{icon}</span>
            ) : null}
            {children && <span>{children}</span>}
        </button>
    )
}

export default Button
