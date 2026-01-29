import axios from 'axios'

import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000 // 30s timeout for AI calls
})

// Request interceptor to add Auth token
api.interceptors.request.use(
    async config => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('API request timed out')
        } else if (!error.response) {
            console.error('Network error - backend may be offline')
        }
        throw error
    }
)

export const tripApi = {
    /**
     * Get AI-powered destination recommendations
     * @param {Object} params - { budget: number, days: number, travel_type: string, interest: string }
     * @returns {Promise<{ destinations: Array, query: Object }>}
     */
    getRecommendations: async (params) => {
        const response = await api.post('/recommendations', params)
        return response.data
    },

    /**
     * Generate a day-wise itinerary using Groq LLM
     * @param {Object} params - { destination, days, budget, travel_type, interest, travelers }
     * @returns {Promise<Object>} - Itinerary with day_plans, travel_tips, cost_breakdown
     */
    generateItinerary: async (params) => {
        const response = await api.post('/itinerary/generate', params)
        return response.data
    },

    /**
     * Save an itinerary to the database
     * @param {Object} itinerary - Full itinerary object
     * @param {string|null} userId - Optional user ID
     * @returns {Promise<{ success: boolean, id: string }>}
     */
    saveItinerary: async (itinerary, userId = null) => {
        const response = await api.post('/itinerary/save', {
            itinerary,
            user_id: userId
        })
        return response.data
    },

    /**
     * Fetch a saved itinerary by ID
     * @param {string} id - Itinerary ID
     * @returns {Promise<Object>}
     */
    getItinerary: async (id) => {
        const response = await api.get(`/itinerary/${id}`)
        return response.data
    },

    /**
     * List all available destinations
     * @returns {Promise<Array>}
     */
    getDestinations: async () => {
        const response = await api.get('/destinations')
        return response.data
    },

    /**
     * Chat with TripIT AI assistant
     * @param {string} message - User message
     * @returns {Promise<{ response: string }>}
     */
    chat: async (message) => {
        const response = await api.post('/chat', { message })
        return response.data
    },

    /**
     * Get AI-powered contextual suggestions based on current selections
     * @param {Object} preferences - Current user preferences
     * @returns {Promise<{ suggestions: string[] }>}
     */
    getSuggestions: async (preferences) => {
        const response = await api.post('/suggestions', preferences)
        return response.data
    },

    /**
     * Get all trips for a specific user
     * @param {string} userId 
     * @returns {Promise<Array>}
     */
    getUserTrips: async (userId) => {
        const response = await api.get(`/itinerary/user/${userId}`)
        return response.data
    },

    /**
     * Delete a trip by ID
     * @param {string} tripId 
     * @returns {Promise<{ success: boolean }>}
     */
    deleteTrip: async (tripId) => {
        const response = await api.delete(`/itinerary/${tripId}`)
        return response.data
    }
}

export default api
