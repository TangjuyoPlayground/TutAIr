import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AuthGuard({ children }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default AuthGuard
