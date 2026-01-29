/**
 * Supabase Client Configuration
 * 
 * This initializes the Supabase client for authentication
 * and database operations.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    console.warn('⚠️ Supabase URL not configured. Auth features will be disabled.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('⚠️ Supabase Anon Key not configured. Auth features will be disabled.')
}

// Create client with options
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage: window.localStorage,
        },
    }
)

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
    return (
        supabaseUrl &&
        supabaseUrl !== 'your_supabase_project_url' &&
        supabaseAnonKey &&
        supabaseAnonKey !== 'your_supabase_anon_key'
    )
}

export default supabase
