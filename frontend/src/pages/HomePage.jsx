import { useNavigate } from 'react-router-dom'
import { LandingPage } from '../components/LandingPage'
import { Gallery } from '../components/Gallery'
import { BudgetOverlay } from '../components/BudgetOverlay'
import { LocationPrompt, CurrencySelector } from '../components/LocationPrompt'
import { AITripPlanner } from '../components/AITripPlanner'
import { TravelChatBot } from '../components/TravelChatBot'
import { state as galleryState } from '../components/Gallery'

export function HomePage() {
    const navigate = useNavigate()

    // Handle booking from any component
    const handleBook = (data) => {
        galleryState.clicked = null // Close gallery overlay
        navigate('/booking', { state: { bookingData: data } })
    }

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-black">
            {/* Location Prompt Modal */}
            <LocationPrompt />

            {/* AI Trip Planner Modal */}
            <AITripPlanner onBook={handleBook} />

            {/* Travel Chat Bot */}
            <TravelChatBot />

            {/* Currency Selector (fixed top right) */}
            <div className="fixed top-4 right-4 z-30">
                <CurrencySelector />
            </div>

            {/* Landing Section */}
            <section className="h-screen w-full relative">
                <LandingPage />
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="h-screen w-full relative bg-black">
                <div className="absolute top-8 left-8 z-10">
                    <h2 className="text-3xl font-bold text-white">Popular Destinations</h2>
                    <p className="text-white/50 mt-2">Click on any destination to view details</p>
                </div>
                <Gallery />
                <BudgetOverlay onBook={handleBook} />
            </section>
        </div>
    )
}

export default HomePage
