/**
 * Data Adapters for Frontend ↔ Backend transformation
 * 
 * The frontend uses different field names and value formats than the backend.
 * These adapters handle the conversion.
 */

// ============================================================================
// Frontend Preferences → Backend API Parameters
// ============================================================================

/**
 * Convert frontend UI preferences to backend API format
 * @param {Object} preferences - Frontend preferences from aiPlannerState
 * @returns {Object} - Backend-compatible request parameters
 */
export function preferencesToBackendParams(preferences) {
    // Budget: Frontend uses categories, backend expects INR number
    const budgetMap = {
        'budget': 30000,      // Under ₹50,000
        'moderate': 80000,    // ₹50,000 - ₹1,50,000
        'luxury': 200000      // ₹1,50,000+
    }

    // Duration: Frontend uses categories, backend expects days as number
    const daysMap = {
        'weekend': 3,
        'week': 6,
        'twoWeeks': 12
    }

    // Terrain → Interest mapping (backend uses different terminology)
    const terrainToInterest = {
        'mountain': 'mountains',
        'beach': 'beach',
        'city': 'heritage',
        'countryside': 'nature'
    }

    // Trip type mapping (frontend → backend)
    // Frontend: spiritual, adventure, relaxation, cultural, romantic, foodie
    // Backend scoring uses: adventure, relaxation, culture, party, romantic, family
    const tripTypeMap = {
        'spiritual': 'culture',     // Spiritual maps to culture (heritage/spiritual tags)
        'adventure': 'adventure',
        'relaxation': 'relaxation',
        'cultural': 'culture',
        'romantic': 'romantic',
        'foodie': 'culture'         // Food experiences often at cultural places
    }

    return {
        budget: budgetMap[preferences.budget] || 50000,
        days: daysMap[preferences.duration] || 5,
        travel_type: tripTypeMap[preferences.tripType] || preferences.tripType || 'adventure',
        interest: terrainToInterest[preferences.terrain] || preferences.terrain || 'nature',
        travelers: preferences.travelers || 2
    }
}

// ============================================================================
// Backend Response → Frontend Data Format
// ============================================================================

/**
 * Convert backend destination response to frontend format
 * @param {Object} dest - Backend destination object
 * @returns {Object} - Frontend-compatible destination object
 */
export function backendDestinationToFrontend(dest) {
    return {
        id: dest.id,
        name: dest.name,
        country: dest.country,
        description: dest.description,
        image: dest.image,
        estimatedCost: dest.estimated_cost,
        score: dest.score,
        reason: dest.reason,
        // Frontend expects comma-separated highlights string
        highlights: dest.tags?.join(', ') || dest.description?.substring(0, 50) || '',
        // Best time not provided by backend, use sensible default
        bestTime: 'October - March',
        tripType: mapBackendTagsToTripType(dest.tags),
        terrain: mapBackendTagsToTerrain(dest.tags),
        // Generate package options based on cost
        packages: generatePackages(dest.estimated_cost, dest.name),
        // Generate default itinerary structure
        itinerary: generateDefaultItinerary(dest.name, dest.tags),
        // Cost breakdown for UI
        costBreakdown: {
            flights: Math.round(dest.estimated_cost * 0.40),
            accommodation: Math.round(dest.estimated_cost * 0.30),
            food: Math.round(dest.estimated_cost * 0.20),
            activities: Math.round(dest.estimated_cost * 0.10)
        }
    }
}

/**
 * Map backend tags to frontend trip type
 */
function mapBackendTagsToTripType(tags) {
    if (!tags || !Array.isArray(tags)) return 'adventure'

    if (tags.includes('adventure')) return 'adventure'
    if (tags.includes('relaxation')) return 'relaxation'
    if (tags.includes('heritage') || tags.includes('culture')) return 'cultural'
    if (tags.includes('spiritual')) return 'spiritual'
    return 'adventure'
}

/**
 * Map backend tags to frontend terrain type
 */
function mapBackendTagsToTerrain(tags) {
    if (!tags || !Array.isArray(tags)) return 'city'

    if (tags.includes('mountains')) return 'mountain'
    if (tags.includes('beach')) return 'beach'
    if (tags.includes('heritage') || tags.includes('culture')) return 'city'
    if (tags.includes('nature') || tags.includes('backwaters')) return 'countryside'
    return 'city'
}

/**
 * Generate package options for booking UI
 */
function generatePackages(baseCost, destinationName) {
    const cost = baseCost || 2000
    return [
        {
            name: 'Standard',
            price: Math.round(cost * 0.8),
            duration: 5,
            includes: 'Flights, 3★ Hotel, Breakfast'
        },
        {
            name: 'Premium',
            price: cost,
            duration: 7,
            includes: 'Direct Flights, 4★ Hotel, Tours'
        },
        {
            name: 'Luxury',
            price: Math.round(cost * 1.5),
            duration: 10,
            includes: 'Business Class, 5★ Resort, All Inclusive'
        }
    ]
}

/**
 * Generate default itinerary array for display
 */
function generateDefaultItinerary(name, tags) {
    const activity = tags?.[0] || 'sightseeing'
    const highlight = tags?.[1] || 'local culture'

    return [
        `Day 1: Arrival in ${name}. Transfer to hotel. Evening leisure.`,
        `Day 2: Full day sightseeing: ${activity} and surrounds.`,
        `Day 3: Cultural immersion: explore ${highlight}.`,
        `Day 4: Free time for shopping or relaxation.`,
        `Day 5: Airport transfer and departure.`
    ]
}

// ============================================================================
// Itinerary Response Conversion
// ============================================================================

/**
 * Convert backend itinerary response to frontend format
 * @param {Object} itinerary - Backend itinerary response
 * @returns {Object} - Frontend-compatible itinerary
 */
export function backendItineraryToFrontend(itinerary) {
    return {
        id: itinerary.id,
        destination: itinerary.destination,
        days: itinerary.days,
        totalCost: itinerary.total_cost,
        dayPlans: itinerary.day_plans?.map(day => ({
            day: day.day,
            title: day.title,
            activities: day.activities,
            meals: day.meals,
            accommodation: day.accommodation,
            estimatedCost: day.estimated_cost,
            tips: day.tips
        })) || [],
        travelTips: itinerary.travel_tips || [],
        costBreakdown: itinerary.cost_breakdown || {}
    }
}
