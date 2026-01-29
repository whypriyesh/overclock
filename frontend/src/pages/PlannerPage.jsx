import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import {
    Sparkles,
    MapPin,
    Globe,
    Mountain,
    Waves,
    Building,
    Trees,
    Calendar,
    Users,
    Wallet,
    Heart,
    Utensils,
    Plane,
    Hotel,
    ArrowRight,
    AlertCircle,
    Loader2
} from 'lucide-react'
import { aiPlannerState, setPreference } from '../store/aiPlanner'
import { locationState, currencies } from '../store/location'
import { tripApi } from '../lib/api'
import { preferencesToBackendParams, backendDestinationToFrontend } from '../lib/adapters'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
}

// Trip type options
const tripTypes = [
    { id: 'spiritual', label: 'Spiritual', icon: Sparkles, desc: 'Meditation & wellness retreats' },
    { id: 'adventure', label: 'Adventure', icon: Mountain, desc: 'Thrilling outdoor experiences' },
    { id: 'relaxation', label: 'Relaxation', icon: Waves, desc: 'Beach resorts & spa getaways' },
    { id: 'cultural', label: 'Cultural', icon: Building, desc: 'History, museums & heritage' },
    { id: 'romantic', label: 'Romantic', icon: Heart, desc: 'Couples & honeymoon trips' },
    { id: 'foodie', label: 'Food & Wine', icon: Utensils, desc: 'Culinary experiences' },
]

// Terrain options
const terrains = [
    { id: 'mountain', label: 'Mountains', icon: Mountain },
    { id: 'beach', label: 'Beach', icon: Waves },
    { id: 'city', label: 'City', icon: Building },
    { id: 'countryside', label: 'Countryside', icon: Trees },
]

// Location preference
const locationPrefs = [
    { id: 'domestic', label: 'Domestic', icon: MapPin, desc: 'Within my country' },
    { id: 'nearby', label: 'Nearby', icon: Globe, desc: 'Neighboring countries' },
    { id: 'international', label: 'International', icon: Plane, desc: 'Anywhere in the world' },
]

// Accommodation preferences
const accommodationTypes = [
    { id: 'budget', label: 'Budget-Friendly', desc: 'Hostels, B&Bs, 2-3 star hotels' },
    { id: 'mid-range', label: 'Mid-Range', desc: '3-4 star hotels, boutique stays' },
    { id: 'luxury', label: 'Luxury', desc: '5-star hotels, resorts, villas' },
]

export function PlannerPage() {
    const navigate = useNavigate()
    const { country, currency } = useSnapshot(locationState)
    const { preferences } = useSnapshot(aiPlannerState)

    // Form state
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 2,
        children: 0,
        tripType: '',
        terrain: '',
        locationPref: '',
        budget: '',
        accommodation: '',
        interests: '',
        dietaryRestrictions: '',
        mobilityNeeds: '',
        specialRequests: ''
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Currency symbol
    const currencySymbol = currencies[currency]?.symbol || '$'

    // Budget options with dynamic currency
    const budgets = [
        { id: 'budget', label: 'Budget', desc: `Under ${currencySymbol}50,000` },
        { id: 'moderate', label: 'Moderate', desc: `${currencySymbol}50,000 - ${currencySymbol}1,50,000` },
        { id: 'luxury', label: 'Luxury', desc: `${currencySymbol}1,50,000+` },
    ]

    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        setError(null)
    }

    const handleSubmit = async () => {
        // Validation
        if (!formData.tripType) {
            setError('Please select a trip type')
            return
        }
        if (!formData.terrain) {
            setError('Please select a preferred terrain')
            return
        }
        if (!formData.budget) {
            setError('Please select your budget')
            return
        }
        if (!formData.startDate || !formData.endDate) {
            setError('Please select your travel dates')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Update store preferences
            setPreference('tripType', formData.tripType)
            setPreference('terrain', formData.terrain)
            setPreference('budget', formData.budget)
            setPreference('locationPref', formData.locationPref)
            setPreference('travelers', formData.travelers)

            // Calculate duration from dates
            const start = new Date(formData.startDate)
            const end = new Date(formData.endDate)
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

            let duration = 'weekend'
            if (days >= 5 && days <= 7) duration = 'week'
            else if (days > 7) duration = 'twoWeeks'

            setPreference('duration', duration)
            setPreference('specificLocation', formData.destination)

            // Build API params with extra details
            const params = preferencesToBackendParams({
                ...formData,
                duration
            })

            // Add additional context for better AI recommendations
            params.additional_context = {
                accommodation: formData.accommodation,
                interests: formData.interests,
                dietary_restrictions: formData.dietaryRestrictions,
                mobility_needs: formData.mobilityNeeds,
                special_requests: formData.specialRequests,
                children: formData.children,
                exact_dates: {
                    start: formData.startDate,
                    end: formData.endDate
                }
            }

            // Call API
            const response = await tripApi.getRecommendations(params)

            // Store results
            aiPlannerState.results = response.destinations.map((dest, i) => ({
                ...backendDestinationToFrontend(dest),
                id: i
            }))
            aiPlannerState.step = 'results'
            aiPlannerState.error = null

            // Navigate to results page
            navigate('/planner/results')

        } catch (err) {
            console.error('Failed to get recommendations:', err)

            // Fallback to offline data
            const { getFilteredDestinations } = await import('../data/destinations')
            const filtered = getFilteredDestinations(
                { ...formData, duration: 'week' },
                country || 'India',
                5
            )

            aiPlannerState.results = filtered.map((r, i) => ({ ...r, id: i }))
            aiPlannerState.step = 'results'
            aiPlannerState.error = 'Using offline recommendations'

            navigate('/planner/results')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-16">
            {/* Header */}
            <motion.section
                className="px-8 py-12 text-center"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
                    variants={fadeUp}
                >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/80">AI-Powered Trip Planning</span>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white tracking-wider mb-4"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    variants={fadeUp}
                >
                    Plan Your Trip
                </motion.h1>

                <motion.p
                    className="text-white/60 text-lg max-w-2xl mx-auto"
                    variants={fadeUp}
                >
                    Tell us about your dream vacation and our AI will create the perfect itinerary for you.
                </motion.p>

                <motion.div
                    className="flex items-center justify-center gap-2 text-white/40 mt-4"
                    variants={fadeUp}
                >
                    <MapPin className="w-4 h-4" />
                    <span>Planning from {country || 'your location'} • Prices in {currency}</span>
                </motion.div>
            </motion.section>

            {/* Form */}
            <motion.section
                className="max-w-4xl mx-auto px-8"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-200"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Destination Input */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-white" />
                        Where do you want to go?
                    </h2>
                    <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => updateForm('destination', e.target.value)}
                        placeholder="e.g., Bali, Paris, Tokyo... (leave empty for AI suggestions)"
                        className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                    />
                </motion.div>

                {/* Location Preference */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4">Travel Distance</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {locationPrefs.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => updateForm('locationPref', loc.id)}
                                className={`p-4 rounded-xl border text-center transition-all ${formData.locationPref === loc.id
                                    ? '!bg-white !text-black !border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-zinc-900/40 border-white/30 hover:bg-white/10 hover:border-white/50 text-white'
                                    }`}
                            >
                                <loc.icon className={`w-5 h-5 mx-auto mb-2 ${formData.locationPref === loc.id ? '' : 'opacity-60'}`} />
                                <div className="font-medium text-sm">
                                    {loc.label}
                                </div>
                                <div className={`text-xs mt-1 ${formData.locationPref === loc.id ? 'opacity-60' : 'opacity-40'}`}>
                                    {loc.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Travel Dates */}
                <motion.div className="mb-8 grid md:grid-cols-2 gap-6" variants={fadeUp}>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white" />
                            Start Date
                        </h2>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => updateForm('startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white focus:border-white focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white" />
                            End Date
                        </h2>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => updateForm('endDate', e.target.value)}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white focus:border-white focus:outline-none transition-colors"
                        />
                    </div>
                </motion.div>

                {/* Travelers */}
                <motion.div className="mb-8 grid md:grid-cols-2 gap-6" variants={fadeUp}>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-white" />
                            Adults
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => updateForm('travelers', Math.max(1, formData.travelers - 1))}
                                className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white text-xl font-bold hover:bg-white/10"
                            >
                                −
                            </button>
                            <span className="text-2xl font-bold text-white w-12 text-center">{formData.travelers}</span>
                            <button
                                onClick={() => updateForm('travelers', Math.min(10, formData.travelers + 1))}
                                className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white text-xl font-bold hover:bg-white/10"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Children</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => updateForm('children', Math.max(0, formData.children - 1))}
                                className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white text-xl font-bold hover:bg-white/10"
                            >
                                −
                            </button>
                            <span className="text-2xl font-bold text-white w-12 text-center">{formData.children}</span>
                            <button
                                onClick={() => updateForm('children', Math.min(10, formData.children + 1))}
                                className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white text-xl font-bold hover:bg-white/10"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Trip Type */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-white" />
                        What kind of experience?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {tripTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => updateForm('tripType', type.id)}
                                className={`p-4 rounded-xl border text-left transition-all ${formData.tripType === type.id
                                    ? '!bg-white !text-black !border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-zinc-900/40 border-white/30 hover:bg-white/10 hover:border-white/50 text-white'
                                    }`}
                            >
                                <type.icon className={`w-5 h-5 mb-2 ${formData.tripType === type.id ? '' : 'opacity-60'}`} />
                                <div className="font-medium">
                                    {type.label}
                                </div>
                                <div className={`text-xs mt-1 ${formData.tripType === type.id ? 'opacity-60' : 'opacity-40'}`}>
                                    {type.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Terrain */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4">Preferred Terrain</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {terrains.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => updateForm('terrain', t.id)}
                                className={`p-4 rounded-xl border text-center transition-all ${formData.terrain === t.id
                                    ? '!bg-white !text-black !border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-zinc-900/40 border-white/30 hover:bg-white/10 hover:border-white/50 text-white'
                                    }`}
                            >
                                <t.icon className={`w-6 h-6 mx-auto mb-2 ${formData.terrain === t.id ? '' : 'opacity-60'}`} />
                                <div className="text-sm font-medium">
                                    {t.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Budget */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-white" />
                        Budget
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {budgets.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => updateForm('budget', b.id)}
                                className={`p-4 rounded-xl border text-center transition-all ${formData.budget === b.id
                                    ? '!bg-white !text-black !border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-zinc-900/40 border-white/30 hover:bg-white/10 hover:border-white/50 text-white'
                                    }`}
                            >
                                <div className="font-medium">
                                    {b.label}
                                </div>
                                <div className={`text-xs mt-1 ${formData.budget === b.id ? 'opacity-60' : 'opacity-40'}`}>
                                    {b.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Accommodation */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-white" />
                        Accommodation Preference
                    </h2>
                    <div className="grid md:grid-cols-3 gap-3">
                        {accommodationTypes.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => updateForm('accommodation', a.id)}
                                className={`p-4 rounded-xl border text-center transition-all ${formData.accommodation === a.id
                                    ? '!bg-white !text-black !border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-zinc-900/40 border-white/30 hover:bg-white/10 hover:border-white/50 text-white'
                                    }`}
                            >
                                <div className="font-medium">
                                    {a.label}
                                </div>
                                <div className={`text-xs mt-1 ${formData.accommodation === a.id ? 'opacity-60' : 'opacity-40'}`}>
                                    {a.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Additional Details */}
                <motion.div className="mb-8" variants={fadeUp}>
                    <h2 className="text-xl font-bold text-white mb-4">Additional Details (Optional)</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Specific Interests</label>
                            <input
                                type="text"
                                value={formData.interests}
                                onChange={(e) => updateForm('interests', e.target.value)}
                                placeholder="e.g., Photography, hiking, local markets, nightlife..."
                                className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Dietary Restrictions</label>
                            <input
                                type="text"
                                value={formData.dietaryRestrictions}
                                onChange={(e) => updateForm('dietaryRestrictions', e.target.value)}
                                placeholder="e.g., Vegetarian, vegan, gluten-free, allergies..."
                                className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Mobility/Accessibility Needs</label>
                            <input
                                type="text"
                                value={formData.mobilityNeeds}
                                onChange={(e) => updateForm('mobilityNeeds', e.target.value)}
                                placeholder="e.g., Wheelchair access, limited walking..."
                                className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Special Requests</label>
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => updateForm('specialRequests', e.target.value)}
                                placeholder="Anything else we should know? Anniversary celebrations, specific landmarks to visit, avoid crowded places..."
                                rows={3}
                                className="w-full p-4 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-white/30 focus:border-white focus:outline-none resize-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div className="pb-8" variants={fadeUp}>
                    <motion.button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-5 btn btn-primary bg-white text-black hover:bg-white/90 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Planning your trip...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>Generate My Trip</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </motion.section>
        </div>
    )
}

export default PlannerPage
