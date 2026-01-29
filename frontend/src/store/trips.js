import { proxy } from 'valtio'
import { tripApi } from '../lib/api'
import { authState } from './auth'

export const tripsState = proxy({
    trips: [],
    loading: false,
    error: null,
    initialized: false
})

/**
 * Fetch all trips for the current user
 */
export async function fetchUserTrips() {
    if (!authState.user) return

    tripsState.loading = true
    tripsState.error = null

    try {
        const userId = authState.user.id
        const trips = await tripApi.getUserTrips(userId)
        tripsState.trips = trips || []
        tripsState.initialized = true
    } catch (error) {
        console.error('Failed to fetch user trips:', error)
        tripsState.error = 'Failed to load your trips'
        // Fallback or empty if API not ready
        tripsState.trips = []
    } finally {
        tripsState.loading = false
    }
}

/**
 * Delete a trip
 */
export async function deleteTrip(tripId) {
    if (!tripId) return

    const previousTrips = [...tripsState.trips]
    // Optimistic update
    tripsState.trips = tripsState.trips.filter(t => t.id !== tripId)

    try {
        await tripApi.deleteTrip(tripId)
    } catch (error) {
        console.error('Failed to delete trip:', error)
        // Revert
        tripsState.trips = previousTrips
        throw error
    }
}

/**
 * Add a newly created trip to the list (after saving)
 */
export function addTripToState(trip) {
    if (!trip) return
    tripsState.trips.unshift(trip)
}
