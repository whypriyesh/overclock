import { useSnapshot } from 'valtio'
import { state } from './Gallery'
import { locationState, formatCurrency } from '../store/location'
import { MapPin, Plane, Hotel, Camera, X, Utensils } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'

export function BudgetOverlay({ onBook }) {
    const { clicked, destinations } = useSnapshot(state)
    const { currency } = useSnapshot(locationState)
    const [travelers, setTravelers] = useState(2)
    const [duration, setDuration] = useState(7)

    if (clicked === null) return null

    const destination = destinations[clicked]
    if (!destination) return null

    // Use numeric budget from destination data
    const minBudgetUSD = destination.minBudget || 2000
    const maxBudgetUSD = destination.maxBudget || 4000

    const avgBudgetUSD = (minBudgetUSD + maxBudgetUSD) / 2
    const perPersonPerDay = avgBudgetUSD / 7
    const estimatedTotalUSD = Math.round(perPersonPerDay * duration * travelers)

    const breakdownUSD = {
        flights: Math.round(estimatedTotalUSD * 0.35),
        accommodation: Math.round(estimatedTotalUSD * 0.30),
        food: Math.round(estimatedTotalUSD * 0.20),
        activities: Math.round(estimatedTotalUSD * 0.15)
    }

    const handleBook = () => {
        if (onBook) onBook({
            destination: destination.name,
            cost: estimatedTotalUSD,
            duration: duration,
            travelers: travelers,
            type: 'Custom Trip'
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
            <div
                className="pointer-events-auto h-full w-full max-w-md bg-black/95 backdrop-blur-md border-l border-white/10 overflow-y-auto"
            >
                {/* Close button */}
                <button
                    onClick={() => state.clicked = null}
                    className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors z-10 border border-white/20"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/10 mt-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-white">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{destination.name}</h2>
                            <p className="text-sm text-white/50">{destination.country}</p>
                        </div>
                    </div>

                    <div className="text-sm text-white/60">
                        <span>{destination.days}</span> • <span>{formatCurrency(minBudgetUSD, currency)} - {formatCurrency(maxBudgetUSD, currency)}</span>
                    </div>
                </div>

                {/* Calculator */}
                <div className="p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
                        Trip Calculator
                    </h3>

                    {/* Travelers */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/50">Travelers</span>
                            <span className="text-sm font-semibold text-white">{travelers}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={travelers}
                            onChange={(e) => setTravelers(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Duration */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/50">Days</span>
                            <span className="text-sm font-semibold text-white">{duration}</span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="14"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Total */}
                    <div className="p-4 rounded-xl bg-zinc-800 border border-white/20">
                        <div className="text-xs text-white/40 mb-1">Estimated Total</div>
                        <div className="text-3xl font-bold text-white">
                            {formatCurrency(estimatedTotalUSD, currency)}
                        </div>
                        <div className="text-xs text-white/40 mt-1">{travelers} travelers × {duration} days</div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2">
                        <div className="text-xs text-white/40 uppercase tracking-wide">Breakdown</div>
                        {[
                            { icon: Plane, label: 'Flights', amount: breakdownUSD.flights },
                            { icon: Hotel, label: 'Stay', amount: breakdownUSD.accommodation },
                            { icon: Utensils, label: 'Food', amount: breakdownUSD.food },
                            { icon: Camera, label: 'Activities', amount: breakdownUSD.activities }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-white/40" />
                                    <span className="text-sm text-white/70">{item.label}</span>
                                </div>
                                <span className="text-sm text-white font-medium">{formatCurrency(item.amount, currency)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4">
                        <Button
                            onClick={handleBook}
                            fullWidth
                            variant="primary"
                            className="py-6 text-lg"
                        >
                            Book Now
                        </Button>
                        <Button
                            onClick={() => state.clicked = null}
                            fullWidth
                            variant="secondary"
                            className="py-6"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
