import clsx from 'clsx'
import './Badge.css'

function Badge({
    children,
    variant = 'default',
    className,
    ...props
}) {
    return (
        <span
            className={clsx('badge', `badge-${variant}`, className)}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge
