/**
 * Authentication State Store
 * 
 * Manages auth state with Valtio for reactive updates
 */

import { proxy, subscribe } from 'valtio'
import {
    signIn as authSignIn,
    signUp as authSignUp,
    signOut as authSignOut,
    resetPassword as authResetPassword,
    getCurrentUser,
    getSession,
    onAuthStateChange,
    updateProfile as authUpdateProfile
} from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'

/**
 * Auth State
 */
export const authState = proxy({
    // User data
    user: null,
    session: null,

    // Loading states
    initializing: true,  // True until first auth check completes
    loading: false,      // True during auth operations

    // Error state
    error: null,

    // Supabase configuration status
    isConfigured: isSupabaseConfigured(),
})

/**
 * Initialize auth state on app load
 */
export async function initAuth() {
    if (!isSupabaseConfigured()) {
        authState.initializing = false
        console.log('Auth disabled: Supabase not configured')
        return
    }

    try {
        const session = await getSession()

        // Only try to get user if we have a session
        if (session) {
            const user = await getCurrentUser()
            authState.session = session
            authState.user = user
        } else {
            // No session - this is normal for logged-out users
            authState.session = null
            authState.user = null
        }
    } catch (error) {
        // Only log as error if it's not the expected "no session" error
        if (error?.name !== 'AuthSessionMissingError' &&
            !error?.message?.includes('Auth session missing')) {
            console.error('Auth initialization error:', error)
        }
        // User is not logged in - this is expected, not an error
        authState.session = null
        authState.user = null
    } finally {
        authState.initializing = false
    }

    // Subscribe to auth changes
    onAuthStateChange((event, session) => {
        // Only log meaningful auth events, not initial state
        if (event !== 'INITIAL_SESSION') {
            console.log('Auth state change:', event)
        }
        authState.session = session
        authState.user = session?.user || null

        if (event === 'SIGNED_OUT') {
            authState.user = null
            authState.session = null
        }
    })
}

/**
 * Sign in with email and password
 */
export async function login(email, password) {
    authState.loading = true
    authState.error = null

    try {
        const { user, session } = await authSignIn(email, password)
        authState.user = user
        authState.session = session
        return { success: true }
    } catch (error) {
        authState.error = getAuthErrorMessage(error)
        return { success: false, error: authState.error }
    } finally {
        authState.loading = false
    }
}

/**
 * Sign up with email and password
 */
export async function signup(email, password, name = '') {
    authState.loading = true
    authState.error = null

    try {
        const { user } = await authSignUp(email, password, { name })

        // Note: User might need to verify email before being fully signed in
        if (user && !user.email_confirmed_at) {
            return {
                success: true,
                message: 'Please check your email to verify your account.',
                needsVerification: true
            }
        }

        authState.user = user
        return { success: true }
    } catch (error) {
        authState.error = getAuthErrorMessage(error)
        return { success: false, error: authState.error }
    } finally {
        authState.loading = false
    }
}

/**
 * Sign out
 */
export async function logout() {
    authState.loading = true
    authState.error = null

    try {
        await authSignOut()
        authState.user = null
        authState.session = null
        return { success: true }
    } catch (error) {
        authState.error = getAuthErrorMessage(error)
        return { success: false, error: authState.error }
    } finally {
        authState.loading = false
    }
}

/**
 * Reset password
 */
export async function resetPassword(email) {
    authState.loading = true
    authState.error = null

    try {
        await authResetPassword(email)
        return {
            success: true,
            message: 'Password reset link sent to your email.'
        }
    } catch (error) {
        authState.error = getAuthErrorMessage(error)
        return { success: false, error: authState.error }
    } finally {
        authState.loading = false
    }
}

/**
 * Update user profile
 */
export async function updateProfile(updates) {
    authState.loading = true
    authState.error = null

    try {
        const { user } = await authUpdateProfile(updates)
        authState.user = user
        return { success: true }
    } catch (error) {
        authState.error = getAuthErrorMessage(error)
        return { success: false, error: authState.error }
    } finally {
        authState.loading = false
    }
}

/**
 * Clear auth error
 */
export function clearAuthError() {
    authState.error = null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!authState.user && !!authState.session
}

/**
 * Get user display name
 */
export function getUserDisplayName() {
    if (!authState.user) return null
    return authState.user.user_metadata?.name ||
        authState.user.email?.split('@')[0] ||
        'User'
}

/**
 * Get user initials for avatar
 */
export function getUserInitials() {
    const name = getUserDisplayName()
    if (!name) return 'U'

    const parts = name.split(' ')
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
}

/**
 * Convert Supabase auth errors to user-friendly messages
 */
function getAuthErrorMessage(error) {
    const message = error?.message || error?.error_description || 'An error occurred'

    // Map common Supabase errors to friendly messages
    const errorMap = {
        'Invalid login credentials': 'Invalid email or password. Please try again.',
        'Email not confirmed': 'Please verify your email before signing in.',
        'User already registered': 'An account with this email already exists.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Unable to validate email address': 'Please enter a valid email address.',
        'Email rate limit exceeded': 'Too many attempts. Please try again later.',
    }

    return errorMap[message] || message
}
