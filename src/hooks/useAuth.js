import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useAuth() {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const { signIn, signOut } = useAuthActions()
    const user = useQuery(api.users.currentUser)
    const updateSettings = useMutation(api.users.updateSettings)

    return {
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        updateSettings,
    }
}
