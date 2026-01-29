import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gallery } from '../components/Gallery'
import { BudgetOverlay } from '../components/BudgetOverlay'
import { state as galleryState } from '../components/Gallery'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

export function DestinationsPage() {
    const navigate = useNavigate()

    // Handle booking from gallery
    const handleBook = (data) => {
        galleryState.clicked = null // Close gallery overlay
        navigate('/booking', { state: { bookingData: data } })
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Header Section */}
            <motion.div
                className="px-8 py-12"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.6 }}
            >
                <h1
                    className="text-5xl md:text-7xl font-black text-white tracking-wider mb-4"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                    Popular Destinations
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">
                    Explore our curated collection of breathtaking destinations around the world.
                    Click on any destination to view details and plan your trip.
                </p>
            </motion.div>

            {/* Gallery Section - Full Height */}
            <section id="gallery" className="h-[80vh] w-full relative">
                <Gallery />
                <BudgetOverlay onBook={handleBook} />
            </section>

            {/* Info Section */}
            <motion.div
                className="px-8 py-16 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">12+</h3>
                        <p className="text-white/60">Destinations</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">100k+</h3>
                        <p className="text-white/60">Happy Travelers</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">4.9★</h3>
                        <p className="text-white/60">Average Rating</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default DestinationsPage
