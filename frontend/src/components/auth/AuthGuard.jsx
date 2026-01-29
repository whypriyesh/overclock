/**
 * AuthGuard Component
 * 
 * Protects routes that require authentication
 * Redirects to login if not authenticated
 */

import { useSnapshot } from 'valtio'
import { Navigate, useLocation } from 'react-router-dom'
import { authState } from '../../store/auth'
import { LoadingScreen } from '../ui/Spinner'

/**
 * AuthGuard - Wrap protected routes with this component
 * 
 * Usage:
 * <Route path="/dashboard" element={
 *   <AuthGuard><DashboardPage /></AuthGuard>
 * } />
 */
export function AuthGuard({ children }) {
    const { user, initializing, isConfigured } = useSnapshot(authState)
    const location = useLocation()

    // Show loading during initial auth check
    if (initializing) {
        return <LoadingScreen message="Checking authentication..." />
    }

    // If Supabase isn't configured, allow access (development mode)
    if (!isConfigured) {
        console.warn('AuthGuard: Supabase not configured, allowing access in dev mode')
        return children
    }

    // Not authenticated - redirect to login
    if (!user) {
        // Save the attempted URL for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Authenticated - render children
    return children
}

/**
 * GuestGuard - Only allows unauthenticated users
 * Redirects to dashboard if already logged in
 * 
 * Usage:
 * <Route path="/login" element={
 *   <GuestGuard><LoginPage /></GuestGuard>
 * } />
 */
export function GuestGuard({ children }) {
    const { user, initializing, isConfigured } = useSnapshot(authState)
    const location = useLocation()

    // Show loading during initial auth check
    if (initializing) {
        return <LoadingScreen message="Loading..." />
    }

    // If Supabase isn't configured, allow access
    if (!isConfigured) {
        return children
    }

    // Already authenticated - redirect to intended destination or dashboard
    if (user) {
        const from = location.state?.from?.pathname || '/dashboard'
        return <Navigate to={from} replace />
    }

    // Not authenticated - render children (login/signup page)
    return children
}

export default AuthGuard
