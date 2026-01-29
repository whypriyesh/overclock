import { motion } from 'framer-motion'
import {
    Wand2,
    Calculator,
    Plane,
    Calendar,
    MapPin,
    CreditCard,
    Globe,
    Sparkles,
    Clock,
    Shield
} from 'lucide-react'
import { openAIPlanner } from '../store/aiPlanner'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 }
    }
}

const features = [
    {
        icon: Wand2,
        title: 'AI-Powered Itineraries',
        description: 'Our AI analyzes your preferences, budget, and travel dates to create personalized day-by-day itineraries tailored just for you.',
        color: 'white'
    },
    {
        icon: Calculator,
        title: 'Transparent Pricing',
        description: 'No hidden fees or surprise costs. Get a complete breakdown of flights, hotels, activities, and meals before you book.',
        color: 'blue'
    },
    {
        icon: Plane,
        title: 'Instant Booking',
        description: 'Seamlessly book flights, hotels, and experiences with just a few clicks. All integrated into one smooth process.',
        color: 'green'
    },
    {
        icon: Calendar,
        title: 'Day-Wise Schedules',
        description: 'Detailed daily schedules with timings, locations, and recommendations so you never miss a moment of your trip.',
        color: 'orange'
    },
    {
        icon: Globe,
        title: 'Multi-Currency Support',
        description: 'View prices in your local currency with real-time exchange rates. Support for USD, EUR, GBP, INR, and more.',
        color: 'teal'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your travel data is encrypted and protected. We never share your personal information with third parties.',
        color: 'red'
    }
]

const howItWorks = [
    {
        step: 1,
        icon: MapPin,
        title: 'Choose Your Destination',
        description: 'Select from popular destinations or tell our AI where you want to go.'
    },
    {
        step: 2,
        icon: Clock,
        title: 'Set Your Preferences',
        description: 'Enter your travel dates, budget, and the type of experiences you prefer.'
    },
    {
        step: 3,
        icon: Sparkles,
        title: 'Get Your Itinerary',
        description: 'Our AI generates a complete itinerary with daily plans and cost breakdown.'
    },
    {
        step: 4,
        icon: CreditCard,
        title: 'Book & Travel',
        description: 'Book everything in one place and get ready for your adventure!'
    }
]

export function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <motion.section
                className="px-8 py-20 text-center"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    variants={fadeUp}
                >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/80">Powered by Advanced AI</span>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white tracking-wider mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    variants={fadeUp}
                >
                    Features That Make<br />Travel Effortless
                </motion.h1>

                <motion.p
                    className="text-white/60 text-lg max-w-2xl mx-auto mb-12"
                    variants={fadeUp}
                >
                    Experience the future of travel planning with our intelligent platform
                    that handles everything from itinerary creation to booking.
                </motion.p>
            </motion.section>

            {/* Features Grid */}
            <motion.section
                className="px-8 pb-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
            >
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* How It Works */}
            <motion.section
                className="px-8 py-20 border-t border-white/10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
            >
                <motion.h2
                    className="text-4xl md:text-5xl font-black text-white text-center tracking-wider mb-16"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    variants={fadeUp}
                >
                    How It Works
                </motion.h2>

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                className="text-center relative"
                            >
                                {/* Connector Line */}
                                {i < howItWorks.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                                )}

                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4 relative">
                                    <item.icon className="w-7 h-7 text-white" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full text-xs font-bold flex items-center justify-center">
                                        {item.step}
                                    </span>
                                </div>
                                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-white/60 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="px-8 py-20 text-center border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2
                    className="text-3xl md:text-4xl font-black text-white tracking-wider mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                    Ready to Start Planning?
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    Let our AI create your perfect trip itinerary in seconds.
                </p>
                <motion.button
                    onClick={openAIPlanner}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary px-8 py-4 text-lg"
                >
                    <Wand2 className="w-5 h-5" />
                    <span>Plan My Trip</span>
                </motion.button>
            </motion.section>
        </div>
    )
}

export default FeaturesPage
