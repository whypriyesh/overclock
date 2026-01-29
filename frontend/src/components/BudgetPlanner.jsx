import { useSnapshot } from 'valtio'
import { state } from './Gallery'
import { X, Calendar, DollarSign, Users, MapPin, Star, Plane, Hotel, Camera } from 'lucide-react'
import { cn } from '../lib/utils'
import { useState } from 'react'

export function BudgetPlanner() {
    const { clicked, destinations } = useSnapshot(state)
    const [travelers, setTravelers] = useState(2)
    const [duration, setDuration] = useState(7)

    if (clicked === null) return null

    const destination = destinations[clicked]

    // Parse budget range
    const budgetMatch = destination.budget.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/)
    const minBudget = budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : 2000
    const maxBudget = budgetMatch ? parseInt(budgetMatch[2].replace(',', '')) : 4000

    // Calculate estimated costs
    const avgBudget = (minBudget + maxBudget) / 2
    const perPersonPerDay = avgBudget / 7
    const estimatedTotal = Math.round(perPersonPerDay * duration * travelers)

    const breakdown = {
        flights: Math.round(estimatedTotal * 0.35),
        accommodation: Math.round(estimatedTotal * 0.30),
        food: Math.round(estimatedTotal * 0.20),
        activities: Math.round(estimatedTotal * 0.15)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm pointer-events-auto animate-fadeIn"
                onClick={() => state.clicked = null}
            />

            {/* Budget Planner Card */}
            <div className="relative z-10 w-full max-w-2xl m-4 bg-black rounded-3xl border border-white/10 shadow-2xl pointer-events-auto overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                    <button
                        onClick={() => state.clicked = null}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white/5">
                            <MapPin className="w-6 h-6 text-white/60" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{destination.name}</h2>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-white/60 text-white/60" />
                                ))}
                                <span className="text-sm text-white/40 ml-2">4.8 (2,341 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 budget-overlay max-h-[60vh] overflow-y-auto">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <Calendar className="w-5 h-5 text-white/50 mb-2" />
                            <div className="text-sm text-white/40">Recommended</div>
                            <div className="text-lg font-semibold text-white">{destination.days}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <DollarSign className="w-5 h-5 text-white/50 mb-2" />
                            <div className="text-sm text-white/40">Budget Range</div>
                            <div className="text-lg font-semibold text-white">{destination.budget}</div>
                        </div>
                    </div>

                    {/* Trip Customization */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-white/50" />
                            Customize Your Trip
                        </h3>

                        {/* Travelers */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <label className="text-sm text-white/40 block mb-2">Number of Travelers</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={travelers}
                                onChange={(e) => setTravelers(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-white font-semibold">{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                                <span className="text-white/40 text-sm">Per person: ${Math.round(estimatedTotal / travelers).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <label className="text-sm text-white/40 block mb-2">Trip Duration (Days)</label>
                            <input
                                type="range"
                                min="3"
                                max="14"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-white font-semibold">{duration} Days</span>
                                <span className="text-white/40 text-sm">Per day: ${Math.round(estimatedTotal / duration).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Total */}
                    <div className="p-6 rounded-xl bg-white/5 border border-white/20 mb-6">
                        <div className="text-sm text-white/40 mb-1">Estimated Total Cost</div>
                        <div className="text-4xl font-bold text-white mb-2">${estimatedTotal.toLocaleString()}</div>
                        <div className="text-sm text-white/60">For {travelers} {travelers === 1 ? 'traveler' : 'travelers'} × {duration} days</div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-semibold text-white">Cost Breakdown</h3>
                        {[
                            { icon: Plane, label: 'Flights', amount: breakdown.flights },
                            { icon: Hotel, label: 'Accommodation', amount: breakdown.accommodation },
                            { icon: DollarSign, label: 'Food & Dining', amount: breakdown.food },
                            { icon: Camera, label: 'Activities & Tours', amount: breakdown.activities }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-white/50" />
                                    <span className="text-white">{item.label}</span>
                                </div>
                                <span className="text-white font-semibold">${item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="flex-1 py-4 px-6 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all duration-300">
                            Book Now
                        </button>
                        <button className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10">
                            Save for Later
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/50">
                            💡 <strong className="text-white/70">Smart Tip:</strong> Book 2-3 months in advance for best prices. Prices may vary based on season and availability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
