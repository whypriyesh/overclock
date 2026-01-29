import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { LocationPrompt, CurrencySelector } from '../components/LocationPrompt'
import { TravelChatBot } from '../components/TravelChatBot'

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar />

            {/* Global Modals & Utilities */}
            <LocationPrompt />
            <TravelChatBot />

            {/* Currency Selector (fixed top right, offset for navbar) */}
            <div className="fixed top-24 right-4 z-30">
                <CurrencySelector />
            </div>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer - can be added later */}
        </div>
    )
}

export default PublicLayout
