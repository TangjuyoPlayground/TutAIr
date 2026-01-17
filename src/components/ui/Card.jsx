import clsx from 'clsx'
import './Card.css'

function Card({ children, className, hover = false, ...props }) {
    return (
        <div
            className={clsx('card', hover && 'card-hover', className)}
            {...props}
        >
            {children}
        </div>
    )
}

function CardHeader({ children, className, ...props }) {
    return (
        <div className={clsx('card-header', className)} {...props}>
            {children}
        </div>
    )
}

function CardTitle({ children, className, as: Component = 'h3', ...props }) {
    return (
        <Component className={clsx('card-title', className)} {...props}>
            {children}
        </Component>
    )
}

function CardDescription({ children, className, ...props }) {
    return (
        <p className={clsx('card-description', className)} {...props}>
            {children}
        </p>
    )
}

function CardContent({ children, className, ...props }) {
    return (
        <div className={clsx('card-content', className)} {...props}>
            {children}
        </div>
    )
}

function CardFooter({ children, className, ...props }) {
    return (
        <div className={clsx('card-footer', className)} {...props}>
            {children}
        </div>
    )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
