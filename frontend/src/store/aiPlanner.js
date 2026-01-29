import { proxy } from 'valtio'
import { locationState } from './location'
import { tripApi } from '../lib/api'
import { preferencesToBackendParams, backendDestinationToFrontend } from '../lib/adapters'
import { authState } from './auth'

export const aiPlannerState = proxy({
    isOpen: false,
    step: 'intro', // intro, questions, loading, results, itinerary
    preferences: {
        location: '',
        budget: '',
        duration: '',
        travelers: 2,
        tripType: '',
        terrain: ''
    },
    results: null,
    bookingDetails: null,
    error: null,
    isOffline: false,
    // Itinerary state
    selectedDestination: null,
    itinerary: null,
    itineraryLoading: false,
    itineraryError: null,
    itinerarySaving: false,
    itinerarySaved: false,
    savedItineraryId: null,
    isEditing: false,
    // AI Suggestions state
    suggestions: [],
    suggestionsLoading: false
})

export function openAIPlanner() {
    aiPlannerState.isOpen = true
    aiPlannerState.step = 'intro'
    aiPlannerState.error = null
    aiPlannerState.isOffline = false
}

export function closeAIPlanner() {
    aiPlannerState.isOpen = false
    resetPlanner()
}

export function goBackToQuestions() {
    aiPlannerState.step = 'questions'
    aiPlannerState.results = null
    aiPlannerState.error = null
}

export function goBackToResults() {
    aiPlannerState.step = 'results'
    aiPlannerState.itinerary = null
    aiPlannerState.itineraryError = null
    aiPlannerState.selectedDestination = null
}

export function resetPlanner() {
    aiPlannerState.step = 'intro'
    aiPlannerState.results = null
    aiPlannerState.error = null
    aiPlannerState.isOffline = false
    aiPlannerState.itinerary = null
    aiPlannerState.itineraryError = null
    aiPlannerState.selectedDestination = null
    aiPlannerState.preferences = {
        location: '',
        budget: '',
        duration: '',
        travelers: 2,
        tripType: '',
        terrain: ''
    }
}

export function setPreference(key, value) {
    aiPlannerState.preferences[key] = value
}

export function setBookingDetails(details) {
    aiPlannerState.bookingDetails = details
}

/**
 * Fetch AI suggestions based on current preferences
 */
export async function fetchSuggestions() {
    // Don't fetch if no preferences selected yet
    const { tripType, terrain, budget, duration, locationPref } = aiPlannerState.preferences
    if (!tripType && !terrain && !budget && !duration && !locationPref) {
        aiPlannerState.suggestions = []
        return
    }

    aiPlannerState.suggestionsLoading = true

    try {
        const response = await tripApi.getSuggestions({
            tripType,
            terrain,
            budget,
            duration,
            locationPref
        })
        aiPlannerState.suggestions = response.suggestions || []
    } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        // Keep existing suggestions on error
    } finally {
        aiPlannerState.suggestionsLoading = false
    }
}

export async function nextStep() {
    // State machine logic
    if (aiPlannerState.step === 'intro') {
        aiPlannerState.step = 'questions'
    } else if (aiPlannerState.step === 'questions') {
        aiPlannerState.step = 'loading'

        // Call backend API
        await generateTrip()

        aiPlannerState.step = 'results'
    }
}

/**
 * Generate full itinerary for a selected destination
 */
export async function generateItinerary(destination) {
    aiPlannerState.selectedDestination = destination
    aiPlannerState.itineraryLoading = true
    aiPlannerState.itineraryError = null
    aiPlannerState.step = 'itinerary'

    try {
        const params = preferencesToBackendParams(aiPlannerState.preferences)

        const response = await tripApi.generateItinerary({
            destination: destination.name,
            days: params.days,
            budget: params.budget,
            travel_type: params.travel_type,
            interest: params.interest,
            travelers: params.travelers || 2
        })

        aiPlannerState.itinerary = response
        aiPlannerState.itineraryError = null

    } catch (error) {
        console.error('Failed to generate itinerary:', error)
        aiPlannerState.itineraryError = 'Failed to generate itinerary. Please try again.'

        // Create a basic fallback itinerary from destination data
        aiPlannerState.itinerary = createFallbackItinerary(destination, aiPlannerState.preferences)
    } finally {
        aiPlannerState.itineraryLoading = false
    }
}

/**
 * Create a basic itinerary from destination data when API fails
 */
function createFallbackItinerary(destination, preferences) {
    const days = preferences.duration === 'weekend' ? 3 : preferences.duration === 'week' ? 6 : 12
    const dayPlans = []

    for (let i = 1; i <= days; i++) {
        dayPlans.push({
            day: i,
            title: i === 1 ? `Arrival in ${destination.name}` :
                i === days ? 'Departure Day' :
                    `Day ${i} - Explore ${destination.name}`,
            activities: [
                i === 1 ? 'Airport/Station pickup and transfer to hotel' : 'Morning breakfast at hotel',
                destination.highlights?.split(',')[i % 3]?.trim() || 'Local sightseeing',
                'Lunch at local restaurant',
                i === days ? 'Pack and checkout' : 'Evening leisure time'
            ],
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            accommodation: '3-4 Star Hotel',
            estimated_cost: Math.round(destination.estimatedCost / days),
            tips: null
        })
    }

    return {
        id: 'fallback-' + Date.now(),
        destination: destination.name,
        days: days,
        total_cost: destination.estimatedCost,
        day_plans: dayPlans,
        travel_tips: [
            'Book accommodations in advance for better rates',
            'Keep copies of important documents',
            'Try local cuisine for authentic experience',
            'Download offline maps before the trip'
        ],
        cost_breakdown: destination.costBreakdown || {
            accommodation: Math.round(destination.estimatedCost * 0.30),
            food: Math.round(destination.estimatedCost * 0.20),
            activities: Math.round(destination.estimatedCost * 0.15),
            transport: Math.round(destination.estimatedCost * 0.35)
        }
    }
}

async function generateTrip() {
    try {
        // Convert frontend preferences to backend format
        const params = preferencesToBackendParams(aiPlannerState.preferences)

        // Call backend API
        const response = await tripApi.getRecommendations(params)

        // Transform backend response to frontend format
        aiPlannerState.results = response.destinations.map((dest, i) => ({
            ...backendDestinationToFrontend(dest),
            id: i
        }))

        aiPlannerState.error = null
        aiPlannerState.isOffline = false

    } catch (error) {
        console.error('Failed to get recommendations from API:', error)

        // Fallback to offline data
        aiPlannerState.error = 'Using offline recommendations (backend unavailable)'
        aiPlannerState.isOffline = true

        // Dynamic import to keep offline data as fallback
        const { getFilteredDestinations } = await import('../data/destinations')
        const filtered = getFilteredDestinations(
            aiPlannerState.preferences,
            locationState.country || 'India',
            5
        )

        aiPlannerState.results = filtered.map((r, i) => ({ ...r, id: i }))
    }
}

/**
 * Save the current itinerary
 */
export async function saveItinerary() {
    if (!aiPlannerState.itinerary) return

    aiPlannerState.itinerarySaving = true

    try {
        const userId = authState.user?.id
        const response = await tripApi.saveItinerary(aiPlannerState.itinerary, userId)
        aiPlannerState.savedItineraryId = response.id
        aiPlannerState.itinerarySaved = true
        aiPlannerState.itinerarySaving = false

        // If saved successfully with user ID, add to local trips state if initialized
        if (userId) {
            import('./trips').then(({ addTripToState }) => {
                addTripToState({ ...aiPlannerState.itinerary, id: response.id })
            })
        }
    } catch (error) {
        console.error('Failed to save itinerary:', error)
        aiPlannerState.itinerarySaving = false
        // Still mark as saved locally
        aiPlannerState.savedItineraryId = 'local-' + Date.now()
        aiPlannerState.itinerarySaved = true
    }
}

/**
 * Regenerate the itinerary with current preferences
 */
export async function regenerateItinerary() {
    if (!aiPlannerState.selectedDestination) return

    aiPlannerState.itinerarySaved = false
    aiPlannerState.savedItineraryId = null
    aiPlannerState.isEditing = false

    await generateItinerary(aiPlannerState.selectedDestination)
}

/**
 * Toggle edit mode for itinerary
 */
export function toggleEditMode() {
    aiPlannerState.isEditing = !aiPlannerState.isEditing
}

/**
 * Update a specific activity in the itinerary
 */
export function updateActivity(dayIndex, activityIndex, newValue) {
    if (!aiPlannerState.itinerary?.day_plans) return

    const dayPlan = aiPlannerState.itinerary.day_plans[dayIndex]
    if (dayPlan && dayPlan.activities) {
        dayPlan.activities[activityIndex] = newValue
        aiPlannerState.itinerarySaved = false
    }
}

/**
 * Add a new activity to a day
 */
export function addActivity(dayIndex, activity) {
    if (!aiPlannerState.itinerary?.day_plans) return

    const dayPlan = aiPlannerState.itinerary.day_plans[dayIndex]
    if (dayPlan) {
        if (!dayPlan.activities) dayPlan.activities = []
        dayPlan.activities.push(activity)
        aiPlannerState.itinerarySaved = false
    }
}

/**
 * Remove an activity from a day
 */
export function removeActivity(dayIndex, activityIndex) {
    if (!aiPlannerState.itinerary?.day_plans) return

    const dayPlan = aiPlannerState.itinerary.day_plans[dayIndex]
    if (dayPlan && dayPlan.activities) {
        dayPlan.activities.splice(activityIndex, 1)
        aiPlannerState.itinerarySaved = false
    }
}

/**
 * Update day title
 */
export function updateDayTitle(dayIndex, newTitle) {
    if (!aiPlannerState.itinerary?.day_plans) return

    const dayPlan = aiPlannerState.itinerary.day_plans[dayIndex]
    if (dayPlan) {
        dayPlan.title = newTitle
        aiPlannerState.itinerarySaved = false
    }
}
