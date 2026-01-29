/**
 * Authentication Service
 * 
 * Wrapper around Supabase auth methods with error handling
 */

import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Sign up with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {Object} metadata - Optional user metadata (name, etc.)
 */
export async function signUp(email, password, metadata = {}) {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please add your credentials to .env')
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    })

    if (error) throw error
    return data
}

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 */
export async function signIn(email, password) {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please add your credentials to .env')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

/**
 * Sign out the current user
 */
export async function signOut() {
    if (!isSupabaseConfigured()) return

    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

/**
 * Send password reset email
 * @param {string} email 
 */
export async function resetPassword(email) {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please add your credentials to .env')
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return data
}

/**
 * Update password (for logged-in users)
 * @param {string} newPassword 
 */
export async function updatePassword(newPassword) {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) throw error
    return data
}

/**
 * Get current session
 */
export async function getSession() {
    if (!isSupabaseConfigured()) return null

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    if (!isSupabaseConfigured()) return null

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Called with (event, session)
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
        return () => { } // No-op unsubscribe
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription?.unsubscribe()
}

/**
 * Update user profile
 * @param {Object} updates - { name, avatar_url, etc. }
 */
export async function updateProfile(updates) {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase.auth.updateUser({
        data: updates,
    })

    if (error) throw error
    return data
}
