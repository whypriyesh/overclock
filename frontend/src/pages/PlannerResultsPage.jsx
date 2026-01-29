import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, DollarSign, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { aiPlannerState, generateItinerary, goBackToQuestions } from '../store/aiPlanner'
import { locationState, currencies } from '../store/location'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
}

export function PlannerResultsPage() {
    const navigate = useNavigate()
    const { results, error, isOffline } = useSnapshot(aiPlannerState)
    const { currency } = useSnapshot(locationState)

    // Redirect if no results
    useEffect(() => {
        if (!results || results.length === 0) {
            navigate('/planner')
        }
    }, [results, navigate])

    const currencySymbol = currencies[currency]?.symbol || '$'

    const handleSelectDestination = async (destination) => {
        await generateItinerary(destination)
        navigate('/planner/itinerary')
    }

    const handleBack = () => {
        goBackToQuestions()
        navigate('/planner')
    }

    if (!results || results.length === 0) {
        return null
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-16">
            {/* Header */}
            <motion.section
                className="px-8 py-8"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.div className="flex items-center gap-4 mb-6" variants={fadeUp}>
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1
                            className="text-4xl md:text-6xl font-black text-white tracking-wider"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            Your Destinations
                        </h1>
                        <p className="text-white/50 mt-1">
                            Select a destination to view detailed itinerary • Prices in {currency}
                        </p>
                    </div>
                </motion.div>

                {/* Warning if offline */}
                {(isOffline || error) && (
                    <motion.div
                        className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3 text-yellow-200"
                        variants={fadeUp}
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error || 'Using offline recommendations - API unavailable'}</span>
                    </motion.div>
                )}
            </motion.section>

            {/* Results Grid */}
            <motion.section
                className="px-8"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((destination, index) => (
                        <motion.div
                            key={destination.id || index}
                            variants={fadeUp}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            onClick={() => handleSelectDestination(destination)}
                            className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-900/80 border border-white/10 hover:border-white/50 transition-all"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={destination.image || `https://loremflickr.com/800/600/${destination.name},travel`}
                                    alt={destination.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                {/* Match badge */}
                                {destination.matchScore && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white text-black text-xs font-bold">
                                        {destination.matchScore}% Match
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                                        <div className="flex items-center gap-1 text-white/50 text-sm">
                                            <MapPin className="w-3 h-3" />
                                            <span>{destination.country}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                                    {destination.description || destination.highlights || 'An amazing destination waiting to be explored.'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-white/50">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{currencySymbol}{destination.estimatedCost?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-white/50">
                                            <Clock className="w-4 h-4" />
                                            <span>{destination.days || '5-7 days'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-white text-sm font-medium group-hover:text-white transition-colors">
                                        <span>View</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section
                className="px-8 py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-white/40 mb-4">Not finding what you're looking for?</p>
                <button
                    onClick={handleBack}
                    className="btn btn-secondary px-6 py-3"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Refine Your Search</span>
                </button>
            </motion.section>
        </div>
    )
}

export default PlannerResultsPage
