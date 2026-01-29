import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, MoreVertical, Trash2, Edit, Share2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../store/location'
import { useState } from 'react'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

export function TripCard({ trip, onDelete }) {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)

    // Fallback data if trip is incomplete
    const destination = trip.destination || 'Unknown Destination'
    const days = trip.days || 3
    const cost = trip.total_cost || 0
    const image = trip.image || '/placeholder-destination.jpg' // We should link to real images

    // Calculate date relative to now (mocked for now as we don't save dates yet)
    const date = new Date(trip.created_at || Date.now()).toLocaleDateString()

    const handleView = () => {
        navigate('/booking', { state: { bookingData: trip } })
    }

    return (
        <Card className="group overflow-hidden bg-[#111] border-white/5 hover:border-white/10 transition-all">
            {/* Image Header */}
            <div className="h-48 relative overflow-hidden bg-white/5">
                {/* Fallback pattern or image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <ImageWithSkeleton
                    src={image}
                    alt={destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                // error fallback handled inside component, but we can pass custom logic if needed
                />

                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                        className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-10 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(trip.id) }} // Fixed: pass ID
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-bold text-white mb-1">{destination}</h3>
                    <div className="flex items-center text-white/60 text-xs gap-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {days} Days
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {trip.travel_type || 'Leisure'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-white/40">Estimated Cost</div>
                    <div className="font-mono text-white font-bold">
                        {formatCurrency(cost, 'USD')}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={handleView}
                    >
                        View Plan
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default TripCard
