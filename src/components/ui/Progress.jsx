import clsx from 'clsx'
import './Progress.css'

function Progress({ value = 0, max = 100, className, showLabel = false }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className={clsx('progress-wrapper', className)}>
            <div className="progress">
                <div
                    className="progress-bar"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
            {showLabel && (
                <span className="progress-label">{Math.round(percentage)}%</span>
            )}
        </div>
    )
}

export default Progress
