import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
    ArrowLeft, Calendar, MapPin, Utensils, Hotel,
    Lightbulb, Wallet, Clock, ChevronDown, ChevronUp,
    Sparkles, Loader2, AlertCircle, Edit3, Save, RefreshCw,
    Plus, Trash2, Check, X
} from 'lucide-react'
import { useSnapshot } from 'valtio'
import { locationState, formatCurrency } from '../store/location'
import {
    aiPlannerState,
    saveItinerary,
    regenerateItinerary,
    toggleEditMode,
    updateActivity,
    addActivity,
    removeActivity,
    updateDayTitle
} from '../store/aiPlanner'

export function ItineraryView({ itinerary, destination, onBack, onBook, loading, error }) {
    const { currency } = useSnapshot(locationState)
    const { isEditing, itinerarySaving, itinerarySaved } = useSnapshot(aiPlannerState)
    const [expandedDay, setExpandedDay] = useState(0)
    const [editingActivity, setEditingActivity] = useState(null) // {dayIndex, activityIndex}
    const [editValue, setEditValue] = useState('')
    const [newActivity, setNewActivity] = useState({ dayIndex: null, value: '' })

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                >
                    <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Crafting Your Itinerary...</h2>
                <p className="text-white/60">Our AI is planning the perfect trip</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                <p className="text-white/60 mb-6 text-center max-w-md">{error}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (!itinerary) return null

    const toggleDay = (index) => {
        setExpandedDay(expandedDay === index ? -1 : index)
    }

    const startEditActivity = (dayIndex, activityIndex, currentValue) => {
        setEditingActivity({ dayIndex, activityIndex })
        setEditValue(currentValue)
    }

    const saveEditActivity = () => {
        if (editingActivity && editValue.trim()) {
            updateActivity(editingActivity.dayIndex, editingActivity.activityIndex, editValue.trim())
        }
        setEditingActivity(null)
        setEditValue('')
    }

    const cancelEditActivity = () => {
        setEditingActivity(null)
        setEditValue('')
    }

    const handleAddActivity = (dayIndex) => {
        if (newActivity.value.trim()) {
            addActivity(dayIndex, newActivity.value.trim())
            setNewActivity({ dayIndex: null, value: '' })
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold">{itinerary.destination || destination?.name}</h1>
                        <p className="text-white/60 text-sm">{itinerary.days} Days Itinerary</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {itinerarySaved && (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                                <Check className="w-3 h-3" /> Saved
                            </span>
                        )}
                        <button
                            onClick={() => onBook?.({
                                destination: itinerary.destination || destination?.name,
                                cost: itinerary.total_cost,
                                duration: itinerary.days,
                                type: 'AI Generated'
                            })}
                            className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mb-6"
                >
                    <button
                        onClick={toggleEditMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        {isEditing ? 'Editing' : 'Edit'}
                    </button>
                    <button
                        onClick={regenerateItinerary}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                    </button>
                    <button
                        onClick={saveItinerary}
                        disabled={itinerarySaving || itinerarySaved}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${itinerarySaved
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50`}
                    >
                        {itinerarySaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : itinerarySaved ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {itinerarySaving ? 'Saving...' : itinerarySaved ? 'Saved' : 'Save'}
                    </button>
                </motion.div>

                {/* Cost Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 mb-8 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/60 text-sm uppercase tracking-wider">Total Estimated Cost</p>
                            <p className="text-4xl font-bold">{formatCurrency(itinerary.total_cost, currency)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Per Day</p>
                            <p className="text-xl font-semibold">
                                {formatCurrency(Math.round(itinerary.total_cost / itinerary.days), currency)}
                            </p>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    {itinerary.cost_breakdown && (
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                            {Object.entries(itinerary.cost_breakdown).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                                        {key}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {formatCurrency(value, currency)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Day-wise Itinerary */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-white/60" />
                        Day-by-Day Plan
                        {isEditing && <span className="text-xs text-white ml-2">(Click activities to edit)</span>}
                    </h2>

                    {itinerary.day_plans?.map((day, dayIndex) => (
                        <motion.div
                            key={dayIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIndex * 0.1 }}
                            className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                        >
                            {/* Day Header */}
                            <button
                                onClick={() => toggleDay(dayIndex)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        {day.day}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-lg">{day.title}</h3>
                                        <p className="text-white/60 text-sm">
                                            {day.activities?.length || 0} activities • {formatCurrency(day.estimated_cost, currency)}
                                        </p>
                                    </div>
                                </div>
                                {expandedDay === dayIndex ? (
                                    <ChevronUp className="w-5 h-5 text-white/40" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-white/40" />
                                )}
                            </button>

                            {/* Day Details */}
                            <AnimatePresence>
                                {expandedDay === dayIndex && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 space-y-6">
                                            {/* Activities */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    Activities
                                                </h4>
                                                <ul className="space-y-2">
                                                    {day.activities?.map((activity, activityIndex) => (
                                                        <li key={activityIndex} className="flex items-start gap-3 group">
                                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                                                {activityIndex + 1}
                                                            </div>

                                                            {editingActivity?.dayIndex === dayIndex && editingActivity?.activityIndex === activityIndex ? (
                                                                <div className="flex-1 flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-white"
                                                                        autoFocus
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') saveEditActivity()
                                                                            if (e.key === 'Escape') cancelEditActivity()
                                                                        }}
                                                                    />
                                                                    <button onClick={saveEditActivity} className="p-1 text-green-400 hover:bg-green-400/20 rounded">
                                                                        <Check className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={cancelEditActivity} className="p-1 text-red-400 hover:bg-red-400/20 rounded">
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        className={`text-white/80 flex-1 ${isEditing ? 'cursor-pointer hover:text-white hover:bg-white/5 px-2 py-1 -mx-2 rounded' : ''}`}
                                                                        onClick={() => isEditing && startEditActivity(dayIndex, activityIndex, activity)}
                                                                    >
                                                                        {activity}
                                                                    </span>
                                                                    {isEditing && (
                                                                        <button
                                                                            onClick={() => removeActivity(dayIndex, activityIndex)}
                                                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-400/20 rounded transition-opacity"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* Add Activity */}
                                                {isEditing && (
                                                    <div className="mt-3">
                                                        {newActivity.dayIndex === dayIndex ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={newActivity.value}
                                                                    onChange={(e) => setNewActivity({ ...newActivity, value: e.target.value })}
                                                                    placeholder="New activity..."
                                                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white"
                                                                    autoFocus
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleAddActivity(dayIndex)
                                                                        if (e.key === 'Escape') setNewActivity({ dayIndex: null, value: '' })
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => handleAddActivity(dayIndex)}
                                                                    className="px-3 py-2 bg-white text-black rounded-lg text-sm"
                                                                >
                                                                    Add
                                                                </button>
                                                                <button
                                                                    onClick={() => setNewActivity({ dayIndex: null, value: '' })}
                                                                    className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setNewActivity({ dayIndex, value: '' })}
                                                                className="flex items-center gap-2 text-white text-sm hover:text-white/70 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add Activity
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Meals */}
                                            {day.meals && day.meals.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <Utensils className="w-4 h-4" />
                                                        Meals
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {day.meals.map((meal, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                                                {meal}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Accommodation */}
                                            {day.accommodation && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <Hotel className="w-4 h-4" />
                                                        Stay
                                                    </h4>
                                                    <p className="text-white/80">{day.accommodation}</p>
                                                </div>
                                            )}

                                            {/* Tips */}
                                            {day.tips && (
                                                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                                                    <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                                                        <Lightbulb className="w-4 h-4" />
                                                        Pro Tip
                                                    </h4>
                                                    <p className="text-white/70 text-sm">{day.tips}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Travel Tips */}
                {itinerary.travel_tips && itinerary.travel_tips.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10"
                    >
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            Travel Tips
                        </h2>
                        <ul className="space-y-3">
                            {itinerary.travel_tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-yellow-400">•</span>
                                    <span className="text-white/80">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Book Now CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 flex gap-4"
                >
                    <button
                        onClick={onBack}
                        className="flex-1 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors"
                    >
                        Back to Results
                    </button>
                    <button
                        onClick={() => onBook?.({
                            destination: itinerary.destination || destination?.name,
                            cost: itinerary.total_cost,
                            duration: itinerary.days,
                            type: 'AI Generated'
                        })}
                        className="flex-1 py-4 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors"
                    >
                        Book This Trip
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
