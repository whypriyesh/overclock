import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { tripsState, fetchUserTrips, deleteTrip } from '../store/trips'
import { authState } from '../store/auth'
import { TripCard } from '../components/dashboard/TripCard'
import { Button, Spinner, EmptyState, TripCardSkeleton } from '../components/ui'

export function TripsPage() {
    const { trips, loading, error, initialized } = useSnapshot(tripsState)
    const { user } = useSnapshot(authState)
    const navigate = useNavigate()

    useEffect(() => {
        if (user && !initialized) {
            fetchUserTrips()
        }
    }, [user, initialized])

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            await deleteTrip(id)
        }
    }

    if (loading && !trips.length) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <TripCardSkeleton key={i} />)}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={() => fetchUserTrips()}>Try Again</Button>
            </div>
        )
    }

    if (!trips.length) {
        return (
            <EmptyState
                variant="trips"
                actionLabel="Plan Your First Trip"
                onAction={() => navigate('/')}
            />
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">
                    All Trips ({trips.length})
                </h2>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/planner')}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    New Trip
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(trip => (
                    <TripCard
                        key={trip.id}
                        trip={trip}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default TripsPage
