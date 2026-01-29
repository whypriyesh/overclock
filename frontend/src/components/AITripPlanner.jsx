import { useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Mountain, Waves, Building, Trees, ArrowRight, MapPin, Globe, Search, AlertCircle, Plane, Lightbulb } from 'lucide-react'
import { aiPlannerState, closeAIPlanner, setPreference, nextStep, goBackToQuestions, goBackToResults, generateItinerary, fetchSuggestions } from '../store/aiPlanner'
import { locationState, currencies } from '../store/location'
import { ResultsGallery } from './ResultsGallery'
import { ItineraryView } from './ItineraryView'
import { useState, useEffect, useRef } from 'react'

const tripTypes = [
    { id: 'spiritual', label: 'Spiritual', icon: Sparkles, desc: 'Meditation & wellness' },
    { id: 'adventure', label: 'Adventure', icon: Mountain, desc: 'Thrilling experiences' },
    { id: 'relaxation', label: 'Relaxation', icon: Waves, desc: 'Peace & tranquility' },
    { id: 'cultural', label: 'Cultural', icon: Building, desc: 'History & heritage' },
]

const terrains = [
    { id: 'mountain', label: 'Mountains', icon: Mountain },
    { id: 'beach', label: 'Beach', icon: Waves },
    { id: 'city', label: 'City', icon: Building },
    { id: 'countryside', label: 'Countryside', icon: Trees },
]

const durations = [
    { id: 'weekend', label: '2-3 Days' },
    { id: 'week', label: '5-7 Days' },
    { id: 'twoWeeks', label: '10-14 Days' },
]

const locationPrefs = [
    { id: 'domestic', label: 'Domestic', icon: MapPin, desc: 'Within my country' },
    { id: 'nearby', label: 'Nearby', icon: Globe, desc: 'Neighboring regions' },
    { id: 'international', label: 'International', icon: Globe, desc: 'Anywhere in the world' },
]

export function AITripPlanner({ onBook }) {
    const { isOpen, step, preferences, results, error, itinerary, itineraryLoading, itineraryError, selectedDestination, suggestions, suggestionsLoading } = useSnapshot(aiPlannerState)
    const { country, currency } = useSnapshot(locationState)
    const [specificLocation, setSpecificLocation] = useState('')
    const [validationError, setValidationError] = useState(null)
    const debounceRef = useRef(null)

    // Debounced suggestion fetching when preferences change
    useEffect(() => {
        if (step !== 'questions') return

        // Clear previous timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        // Debounce API call by 600ms
        debounceRef.current = setTimeout(() => {
            fetchSuggestions()
        }, 600)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [preferences.tripType, preferences.terrain, preferences.budget, preferences.duration, preferences.locationPref, step])

    if (!isOpen) return null

    const handleSpecificLocationSubmit = () => {
        if (specificLocation.trim()) {
            setPreference('specificLocation', specificLocation.trim())
        }
    }

    const handleGenerate = () => {
        // Validation
        if (!preferences.locationPref && !specificLocation) {
            setValidationError('Please select where you want to travel')
            return
        }
        if (!preferences.tripType) {
            setValidationError('Please select a trip type')
            return
        }
        if (!preferences.terrain) {
            setValidationError('Please select a preferred terrain')
            return
        }
        if (!preferences.budget) {
            setValidationError('Please select your budget')
            return
        }
        if (!preferences.duration) {
            setValidationError('Please select a duration')
            return
        }

        setValidationError(null)
        nextStep()
    }

    // Get currency symbol for budget display
    const currencySymbol = currencies[currency]?.symbol || '$'

    // Budget options with dynamic currency
    const budgets = [
        { id: 'budget', label: 'Budget', desc: `Under ${currencySymbol}50,000` },
        { id: 'moderate', label: 'Moderate', desc: `${currencySymbol}50,000 - ${currencySymbol}1,50,000` },
        { id: 'luxury', label: 'Luxury', desc: `${currencySymbol}1,50,000+` },
    ]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black"
            >
                {/* Close Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={closeAIPlanner}
                    className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </motion.button>

                {/* Intro Step */}
                {step === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full flex flex-col items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="p-4 rounded-full bg-white/10 mb-8"
                        >
                            <Sparkles className="w-12 h-12 text-white" />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                            className="text-5xl md:text-7xl font-normal text-white text-center mb-4"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
                        >
                            AI Travel Planner
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/50 text-lg mb-8 text-center max-w-md"
                        >
                            Let our AI craft the perfect journey tailored to your preferences
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.45 }}
                            className="flex items-center gap-2 text-white/40 mb-8"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>Planning from {country || 'your location'} • Prices in {currency}</span>
                        </motion.div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextStep}
                            className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg flex items-center gap-2"
                        >
                            Start Planning
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}

                {/* Questions Step */}
                {step === 'questions' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full overflow-y-auto py-20 px-4"
                    >
                        <div className="max-w-2xl mx-auto space-y-10 pb-20">
                            {/* Validation Error */}
                            <AnimatePresence>
                                {validationError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-200"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{validationError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Specific Location Search */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-semibold text-white mb-4">Have a specific place in mind?</h2>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        value={specificLocation}
                                        onChange={(e) => setSpecificLocation(e.target.value)}
                                        onBlur={handleSpecificLocationSubmit}
                                        placeholder="e.g., Bali, Paris, Tokyo... (optional)"
                                        className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                                <p className="text-white/30 text-sm mt-2">Leave empty for AI recommendations</p>
                            </motion.div>

                            {/* Location Preference */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <h2 className="text-2xl font-semibold text-white mb-4">Where do you want to travel?</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {locationPrefs.map((loc, i) => (
                                        <motion.button
                                            key={loc.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + i * 0.05 }}
                                            onClick={() => {
                                                setPreference('locationPref', loc.id)
                                                setValidationError(null)
                                            }}
                                            className={`p-4 rounded-xl border text-center transition-all ${preferences.locationPref === loc.id
                                                ? 'bg-white text-black border-white'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <loc.icon className={`w-5 h-5 mx-auto mb-2 ${preferences.locationPref === loc.id ? 'text-black' : 'text-white/60'}`} />
                                            <div className={`font-medium text-sm ${preferences.locationPref === loc.id ? 'text-black' : 'text-white'}`}>{loc.label}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Trip Type */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <h2 className="text-2xl font-semibold text-white mb-4">What kind of experience?</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {tripTypes.map((type, i) => (
                                        <motion.button
                                            key={type.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            onClick={() => {
                                                setPreference('tripType', type.id)
                                                setValidationError(null)
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${preferences.tripType === type.id
                                                ? 'bg-white text-black border-white'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <type.icon className={`w-5 h-5 mb-2 ${preferences.tripType === type.id ? 'text-black' : 'text-white/60'}`} />
                                            <div className={`font-medium ${preferences.tripType === type.id ? 'text-black' : 'text-white'}`}>{type.label}</div>
                                            <div className={`text-xs ${preferences.tripType === type.id ? 'text-black/60' : 'text-white/40'}`}>{type.desc}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Terrain */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <h2 className="text-2xl font-semibold text-white mb-4">Preferred terrain?</h2>
                                <div className="grid grid-cols-4 gap-3">
                                    {terrains.map((t, i) => (
                                        <motion.button
                                            key={t.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.05 }}
                                            onClick={() => {
                                                setPreference('terrain', t.id)
                                                setValidationError(null)
                                            }}
                                            className={`p-3 rounded-xl border text-center transition-all ${preferences.terrain === t.id
                                                ? 'bg-white text-black border-white'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <t.icon className={`w-5 h-5 mx-auto mb-1 ${preferences.terrain === t.id ? 'text-black' : 'text-white/60'}`} />
                                            <div className={`text-xs font-medium ${preferences.terrain === t.id ? 'text-black' : 'text-white'}`}>{t.label}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Budget & Duration Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="grid grid-cols-2 gap-6"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-3">Budget?</h2>
                                    <div className="space-y-2">
                                        {budgets.map((b, i) => (
                                            <motion.button
                                                key={b.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.05 }}
                                                onClick={() => {
                                                    setPreference('budget', b.id)
                                                    setValidationError(null)
                                                }}
                                                className={`w-full p-3 rounded-xl border text-left transition-all ${preferences.budget === b.id
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className={`font-medium text-sm ${preferences.budget === b.id ? 'text-black' : 'text-white'}`}>{b.label}</div>
                                                <div className={`text-xs ${preferences.budget === b.id ? 'text-black/60' : 'text-white/40'}`}>{b.desc}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-3">Duration?</h2>
                                    <div className="space-y-2">
                                        {durations.map((d, i) => (
                                            <motion.button
                                                key={d.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.05 }}
                                                onClick={() => {
                                                    setPreference('duration', d.id)
                                                    setValidationError(null)
                                                }}
                                                className={`w-full p-3 rounded-xl border text-center transition-all ${preferences.duration === d.id
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className={`font-medium text-sm ${preferences.duration === d.id ? 'text-black' : 'text-white'}`}>{d.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* AI Suggestion Panel */}
                            <AnimatePresence>
                                {(suggestions.length > 0 || suggestionsLoading) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                                            <span className="text-white/80 text-sm font-medium">TripIt Suggests</span>
                                            {suggestionsLoading && (
                                                <div className="ml-auto flex gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {suggestions.map((suggestion, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="text-white/70 text-sm leading-relaxed"
                                                >
                                                    {suggestion}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Generate Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate My Trip
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Loading Step - Animated Icons */}
                {step === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
                    >
                        {/* Animated preference icons */}
                        <div className="flex items-center gap-6 mb-10">
                            <motion.div
                                animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <Sparkles className="w-8 h-8 text-white" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <Globe className="w-8 h-8 text-white" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <Plane className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-normal text-white mb-4 text-center"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
                        >
                            TripIt is Planning...
                        </motion.h2>

                        <p className="text-white/40 text-sm animate-pulse">Consulting the travel oracle for best prices</p>

                        {/* Preference tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-2 mt-8"
                        >
                            {preferences.tripType && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs uppercase tracking-widest border border-white/5">
                                    {preferences.tripType}
                                </span>
                            )}
                            {preferences.terrain && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs uppercase tracking-widest border border-white/5">
                                    {preferences.terrain}
                                </span>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {/* Results Step - 3D Frame Gallery */}
                {step === 'results' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-white/10 rounded-lg text-white/70 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-6 left-6 z-40 flex items-center gap-4"
                        >
                            <button
                                onClick={goBackToQuestions}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 text-white rotate-180" />
                            </button>
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
                                    YOUR DESTINATIONS
                                </h2>
                                <p className="text-white/40 text-sm mt-1">Click a frame for details • {currency}</p>
                            </div>
                        </motion.div>
                        {results.length > 0 ? (
                            <ResultsGallery
                                results={results}
                                onBook={onBook}
                                onGenerateItinerary={(dest) => generateItinerary(dest)}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-white/50">No destinations found. Try different preferences.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Itinerary Step */}
                {step === 'itinerary' && (
                    <ItineraryView
                        itinerary={itinerary}
                        destination={selectedDestination}
                        loading={itineraryLoading}
                        error={itineraryError}
                        onBack={goBackToResults}
                        onBook={onBook}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    )
}
