import { motion } from 'framer-motion'
import { Plane, Sparkles, Stars, ChevronDown, Wand2, Calculator, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { openAIPlanner } from '../store/aiPlanner'

// Animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 }
    }
}

const letterAnimation = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: { opacity: 1, y: 0, rotateX: 0 }
}

const glowPulse = {
    animate: {
        textShadow: [
            '0 0 20px rgba(255,255,255,0)',
            '0 0 40px rgba(255,255,255,0.3)',
            '0 0 20px rgba(255,255,255,0)'
        ],
        transition: { duration: 2, repeat: Infinity }
    }
}

export function LandingPage() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const scrollToGallery = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }

    const title1 = "TripIt"
    const title2 = "AI Planner"

    return (
        <div className="relative h-full flex flex-col items-center justify-center px-4 bg-black overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Subtle glow orbs - Monochrome */}
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/4 -left-32 w-96 h-96 bg-white/5 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute bottom-1/4 -right-32 w-96 h-96 bg-white/5 rounded-full blur-[100px]"
            />

            <motion.div
                className="relative z-10 max-w-6xl mx-auto text-center"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={stagger}
            >
                {/* Badge */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
                >
                    <Wand2 className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white/80 tracking-wide">Intelligent Travel Agent</span>
                </motion.div>

                {/* Main Heading with letter animation - Bebas Neue font */}
                <div className="mb-6" style={{ perspective: '1000px' }}>
                    <motion.h1
                        className="text-8xl md:text-[10rem] font-black text-white leading-none tracking-wider"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        <motion.span
                            className="block overflow-hidden"
                            variants={stagger}
                        >
                            {title1.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    variants={letterAnimation}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: i * 0.04
                                    }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                        <motion.span
                            className="block text-white mt-2"
                            variants={stagger}
                            {...glowPulse}
                        >
                            {title2.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    variants={letterAnimation}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: 0.4 + i * 0.04
                                    }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </motion.span>
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                    className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-bold mb-12 leading-relaxed"
                >
                    Your personal AI travel genius.
                    <span className="block text-white/40 text-base mt-2">
                        Get day-wise itineraries, transparent cost breakdowns, and instant bookings in seconds.
                    </span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <motion.button
                        onClick={openAIPlanner}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative btn btn-primary px-10 py-5 text-xl overflow-hidden z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <Sparkles className="w-5 h-5 text-black" />
                        <span>Plan Trip Now</span>
                    </motion.button>

                    <motion.button
                        onClick={scrollToGallery}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-secondary px-10 py-5 text-xl z-20"
                    >
                        <span>Popular Destinations</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.button>
                </motion.div>

                {/* Feature Grid - Enhanced for PRD */}
                <motion.div
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 max-w-4xl mx-auto"
                >
                    {[
                        { icon: Calendar, title: 'Day-Wise Schedules', desc: 'Detailed schedules tailored to you' },
                        { icon: Calculator, title: 'Transparent Pricing', desc: 'No hidden costs, full breakdown' },
                        { icon: Plane, title: 'Instant Booking', desc: 'Seamless flights & hotels logic' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 + i * 0.1 }}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="p-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-left hover:border-white/40 transition-all cursor-default backdrop-blur-md shadow-xl"
                        >
                            <feature.icon className="w-8 h-8 text-white mb-4" />
                            <h3 className="font-bold text-white text-lg mb-1">{feature.title}</h3>
                            <p className="text-white/60 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToGallery}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors"
                >
                    <ChevronDown className="w-5 h-5 text-white/50" />
                </motion.div>
            </motion.button>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    )
}
