import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    CreditCard,
    Plus,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import { authState } from '../store/auth'
import { tripsState, fetchUserTrips } from '../store/trips'
import { StatsCard } from '../components/dashboard/StatsCard'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { Button } from '../components/ui'

export function DashboardPage() {
    const { user } = useSnapshot(authState)
    const { trips } = useSnapshot(tripsState)
    const navigate = useNavigate()

    useEffect(() => {
        if (!tripsState.initialized) {
            fetchUserTrips()
        }
    }, [])

    const stats = [
        {
            title: 'Total Trips',
            value: trips.length,
            icon: MapPin,
            trend: { value: '+2 this month', positive: true }
        },
        {
            title: 'Planned Days',
            value: trips.reduce((acc, t) => acc + (t.days || 0), 0),
            icon: Calendar
        },
        {
            title: 'Total Budget',
            value: `$${trips.reduce((acc, t) => acc + (t.total_cost || 0), 0) / 1000}k`,
            icon: CreditCard
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Greeting */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.user_metadata?.name?.split(' ')[0] || 'Traveler'}!
                    </h1>
                    <p className="text-white/50">
                        Here's an overview of your travel plans.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/planner')}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    New Trip
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                        <ActivityFeed activities={[
                            { type: 'create', user: 'You', action: 'created a new trip to', target: 'Tokyo, Japan', time: '2 hours ago' },
                            { type: 'update', user: 'You', action: 'updated itinerary for', target: 'Paris Trip', time: 'Yesterday' },
                            { type: 'review', user: 'AI', action: 'generated suggestions for', target: 'Bali Adventure', time: '2 days ago' },
                        ]} />
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-4">
                        <Button
                            variant="secondary"
                            fullWidth
                            className="justify-between group"
                            onClick={() => navigate('/dashboard/trips')}
                        >
                            View All Trips
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        </Button>
                        <Button
                            variant="secondary"
                            fullWidth
                            className="justify-between group"
                            onClick={() => navigate('/dashboard/profile')}
                        >
                            Account Settings
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        </Button>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-black border border-white/20 rounded-2xl p-6">
                        <h4 className="font-bold text-white mb-2">Travel Tip</h4>
                        <p className="text-sm text-white/60">
                            Did you know? Booking flights 3 months in advance usually gets you the best rates.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default DashboardPage
