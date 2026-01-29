import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Clock, MapPin, Check, ChevronRight, Sparkles } from 'lucide-react'
import { useSnapshot } from 'valtio'
import { locationState, formatCurrency } from '../store/location'
import { ImageWithSkeleton } from './ui/ImageWithSkeleton'

export function ResultsGallery({ results, onBook, onGenerateItinerary }) {
    const { currency } = useSnapshot(locationState)
    const [selectedId, setSelectedId] = useState(null)

    const selectedResult = results.find(r => r.id === selectedId)

    return (
        <div className="w-full h-full px-4 md:px-8 pb-8 pt-32 overflow-y-auto">
            <AnimatePresence mode="wait">
                {selectedId === null ? (
                    // Grid View
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20"
                    >
                        {results.map((result, i) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedId(result.id)}
                                className="group relative aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                {/* Content */}
                                <ImageWithSkeleton
                                    src={result.image}
                                    alt={result.name}
                                    className="absolute inset-0 w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider">
                                            {formatCurrency(result.estimatedCost, currency)}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-4xl font-bold text-white mb-2 leading-none" style={{ fontFamily: 'Bebas Neue' }}>
                                            {result.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/60 text-sm font-medium uppercase tracking-wide">
                                            <MapPin className="w-3 h-3" />
                                            {result.country}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                                            {result.highlights.split(',').slice(0, 2).map((h, hi) => (
                                                <span key={hi} className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-2 py-1 rounded-full">
                                                    {h.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    // Detail View
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl mx-auto pb-20"
                    >
                        <button
                            onClick={() => setSelectedId(null)}
                            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-sm">Back to Results</span>
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Info */}
                            <div>
                                <h1 className="text-8xl font-black text-white mb-2 leading-none" style={{ fontFamily: 'Bebas Neue' }}>
                                    {selectedResult.name}
                                </h1>
                                <div className="flex items-center gap-2 text-xl text-white/60 mb-8 font-light">
                                    <MapPin className="w-5 h-5" />
                                    <span>{selectedResult.country}</span>
                                </div>

                                <p className="text-lg text-white/80 leading-relaxed mb-8 border-l-2 border-white/20 pl-4">
                                    {selectedResult.description}
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <Clock className="w-5 h-5 text-white/40" />
                                        <div>
                                            <div className="text-xs text-white/40 uppercase tracking-widest">Best Time</div>
                                            <div className="font-bold text-white">{selectedResult.bestTime}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <Check className="w-5 h-5 text-white/40 mt-1" />
                                        <div className="flex-1">
                                            <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Highlights</div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedResult.highlights.split(',').map((h, i) => (
                                                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white hover:text-black transition-colors">
                                                        {h.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Itinerary CTA */}
                                <button
                                    onClick={() => onGenerateItinerary?.(selectedResult)}
                                    className="w-full mt-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Generate AI Itinerary
                                </button>
                            </div>

                            {/* Right Packages */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Quick Book Packages</h3>
                                {selectedResult.packages.map((pkg, i) => (
                                    <div key={i} className="group p-5 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold">{pkg.name}</h4>
                                            <span className="font-mono font-bold opacity-60">{formatCurrency(pkg.price, currency)}</span>
                                        </div>
                                        <div className="text-sm opacity-60 mb-4 group-hover:text-black/60">
                                            {pkg.duration} Days • {pkg.includes}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onBook?.({
                                                    destination: selectedResult.name,
                                                    cost: pkg.price,
                                                    duration: pkg.duration,
                                                    type: pkg.name
                                                })
                                            }}
                                            className="w-full py-2 rounded-lg bg-white text-black font-bold uppercase text-xs tracking-widest group-hover:bg-black group-hover:text-white transition-colors"
                                        >
                                            Book This Trip
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
