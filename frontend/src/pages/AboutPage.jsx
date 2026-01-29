import { motion } from 'framer-motion'
import { Heart, Users, Globe, Sparkles, Target, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'

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

const values = [
    {
        icon: Heart,
        title: 'Passion for Travel',
        description: 'We believe travel transforms lives. Our mission is to make extraordinary experiences accessible to everyone.'
    },
    {
        icon: Lightbulb,
        title: 'Innovation First',
        description: 'We leverage cutting-edge AI to solve real travel problems and create seamless planning experiences.'
    },
    {
        icon: Target,
        title: 'Transparency',
        description: 'No hidden fees, no surprises. We believe in honest pricing and clear communication at every step.'
    }
]

const stats = [
    { value: '50K+', label: 'Trips Planned' },
    { value: '120+', label: 'Countries Covered' },
    { value: '4.9', label: 'User Rating' },
    { value: '24/7', label: 'AI Availability' }
]

export function AboutPage() {
    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <motion.section
                className="px-8 py-20 text-center"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white tracking-wider mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    variants={fadeUp}
                >
                    About TripIt
                </motion.h1>

                <motion.p
                    className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    variants={fadeUp}
                >
                    We're on a mission to revolutionize travel planning with artificial intelligence.
                    No more hours of research, comparison shopping, or uncertainty.
                    Just tell us where you want to go, and we'll handle the rest.
                </motion.p>
            </motion.section>

            {/* Mission Section */}
            <motion.section
                className="px-8 py-20 border-t border-white/10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
            >
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div variants={fadeUp}>
                        <h2
                            className="text-4xl md:text-5xl font-black text-white tracking-wider mb-6"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            Our Mission
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed mb-6">
                            Travel planning should be exciting, not exhausting. We built TripIt to be your
                            intelligent travel companion—one that understands your preferences, respects your
                            budget, and creates personalized itineraries in seconds.
                        </p>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Powered by advanced AI, our platform learns from millions of trips to recommend
                            the best experiences, optimal routes, and hidden gems you'd never find on your own.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="grid grid-cols-2 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 text-center"
                            >
                                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-white/60 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Values Section */}
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
                    Our Values
                </motion.h2>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    {values.map((value, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="p-8 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/30 transition-all text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                <value.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Team Section (Placeholder) */}
            <motion.section
                className="px-8 py-20 border-t border-white/10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
            >
                <motion.div className="max-w-4xl mx-auto text-center" variants={fadeUp}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-sm text-white/80">The Team</span>
                    </div>

                    <h2
                        className="text-4xl font-black text-white tracking-wider mb-6"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        Built by Travelers, for Travelers
                    </h2>

                    <p className="text-white/60 text-lg leading-relaxed mb-8">
                        Our team of AI researchers, travel enthusiasts, and design experts work together
                        to create the best travel planning experience possible. We've traveled to over
                        50 countries combined and understand what makes a trip truly memorable.
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <Globe className="w-8 h-8 text-white/30" />
                        <Sparkles className="w-8 h-8 text-white" />
                        <Globe className="w-8 h-8 text-white/30" />
                    </div>
                </motion.div>
            </motion.section>

            {/* CTA */}
            <motion.section
                className="px-8 py-20 border-t border-white/10 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2
                    className="text-3xl font-black text-white tracking-wider mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                    Ready to Explore?
                </h2>
                <Link
                    to="/destinations"
                    className="btn btn-primary px-8 py-4 text-lg inline-flex"
                >
                    <span>View Destinations</span>
                </Link>
            </motion.section>
        </div>
    )
}

export default AboutPage
