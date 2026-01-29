import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { detectLocation } from './store/location'
import { initAuth } from './store/auth'

// Pages
import { LandingPage } from './pages/LandingPage'
import { DestinationsPage } from './pages/DestinationsPage'
import { FeaturesPage } from './pages/FeaturesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PlannerPage } from './pages/PlannerPage'
import { PlannerResultsPage } from './pages/PlannerResultsPage'
import { PlannerItineraryPage } from './pages/PlannerItineraryPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { TripsPage } from './pages/TripsPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { BookingPage } from './components/BookingPage'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// Guards
import { AuthGuard, GuestGuard } from './components/auth/AuthGuard'

export function App() {
    // Initialize services on mount
    useEffect(() => {
        detectLocation()
        initAuth()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes with Navbar */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/destinations" element={<DestinationsPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/planner" element={<PlannerPage />} />
                    <Route path="/planner/results" element={<PlannerResultsPage />} />
                    <Route path="/planner/itinerary" element={<PlannerItineraryPage />} />
                    <Route path="/booking" element={<BookingPage />} />
                </Route>

                {/* Auth Routes (Guest Only - No Navbar) */}
                <Route path="/login" element={
                    <GuestGuard>
                        <LoginPage />
                    </GuestGuard>
                } />
                <Route path="/signup" element={
                    <GuestGuard>
                        <SignupPage />
                    </GuestGuard>
                } />
                <Route path="/reset-password" element={
                    <GuestGuard>
                        <ResetPasswordPage />
                    </GuestGuard>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <AuthGuard>
                        <DashboardLayout />
                    </AuthGuard>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="trips" element={<TripsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
