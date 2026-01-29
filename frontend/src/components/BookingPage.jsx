import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Shield, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { locationState, formatCurrency } from '../store/location'

import { useNavigate, useLocation } from 'react-router-dom'

export function BookingPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { currency } = useSnapshot(locationState)
    const [step, setStep] = useState(1) // 1: Form, 2: Processing, 3: Success

    const onBack = () => navigate('/')
    const initialData = location.state?.bookingData

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        requests: ''
    })
    const [errors, setErrors] = useState({})

    // Use passed data or fallbacks
    const estimatedCost = initialData?.cost || 2400
    const taxes = Math.round(estimatedCost * 0.05)
    const destination = initialData?.destination || "Trip Package"
    const duration = initialData?.duration || 7

    const validate = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        // Phone Validation (simple check for at least 10 digits/chars)
        const phoneRegex = /^[\d\s()+-]{10,}$/
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleConfirm = () => {
        if (!validate()) return

        setStep(2)
        // Simulate API call
        setTimeout(() => {
            setStep(3)
        }, 1500)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    if (step === 3) {
        return (
            <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-black mb-4" style={{ fontFamily: 'Bebas Neue' }}>INQUIRY SENT</h1>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                        We've received your details. Our team will verify your contact info and reach out shortly with the final itinerary for <strong>{destination}</strong>.
                    </p>
                    <button
                        onClick={onBack}
                        className="px-8 py-4 bg-white text-black font-bold tracking-widest uppercase rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <div className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'Bebas Neue' }}>TripIt Request</div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Contact Details</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    placeholder="John"
                                />
                                <FormInput
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    placeholder="Doe"
                                />
                            </div>
                            <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="john@example.com"
                            />
                            <FormInput
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="+1 (555) 000-0000"
                            />
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold tracking-widest text-white/50 ml-1">Special Requests</label>
                                <textarea
                                    name="requests"
                                    value={formData.requests}
                                    onChange={handleChange}
                                    placeholder="Any dietary restrictions, specific dates, or hotel preferences?"
                                    className="w-full bg-transparent border-b border-white/20 py-3 px-1 text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors font-light min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border border-white/20 rounded-2xl bg-white/5">
                        <p className="text-sm text-white/60">
                            <Shield className="inline w-4 h-4 mr-2" />
                            No payment required today. Our experts will validate your request and provide a final quote in {currency}.
                        </p>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full py-5 bg-white text-black font-black text-xl uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
                    >
                        {step === 1 ? 'Submit Inquiry' : 'Validating...'}
                    </button>

                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-2 text-red-400 text-sm justify-center animate-pulse">
                            <AlertCircle className="w-4 h-4" />
                            Please fix the errors above
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 text-white/60 uppercase tracking-widest">Estimated Budget</h3>

                        <div className="space-y-6 pb-6 border-b border-white/10">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-2xl">{destination}</div>
                                <div className="text-xl font-mono text-white/80">{formatCurrency(estimatedCost, currency)}</div>
                            </div>
                            <div className="text-sm text-white/50">
                                {duration} Days • {initialData?.type || 'Full Package'}
                            </div>
                        </div>

                        {/* Detailed Cost Breakdown */}
                        <div className="py-6 space-y-3 text-sm border-b border-white/10">
                            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Cost Breakdown</h4>
                            <div className="flex justify-between text-white/60">
                                <span>🏨 Accommodation</span>
                                <span>{formatCurrency(Math.round(estimatedCost * 0.35), currency)}</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>✈️ Transport</span>
                                <span>{formatCurrency(Math.round(estimatedCost * 0.30), currency)}</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>🍽️ Food & Meals</span>
                                <span>{formatCurrency(Math.round(estimatedCost * 0.20), currency)}</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>🎯 Activities</span>
                                <span>{formatCurrency(Math.round(estimatedCost * 0.15), currency)}</span>
                            </div>
                            <div className="flex justify-between text-white/60 pt-2 border-t border-white/10">
                                <span>Taxes & Fees (Est.)</span>
                                <span>{formatCurrency(taxes, currency)}</span>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-between items-center text-3xl font-bold text-white">
                            <span>Total Estimate</span>
                            <span>{formatCurrency(estimatedCost + taxes, currency)}</span>
                        </div>

                        {/* What's Included */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">What's Included</h4>
                            <ul className="text-sm text-white/60 space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    Round-trip flights
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    Hotel accommodation
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    Daily breakfast
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    Airport transfers
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    24/7 travel support
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Cancellation & Refund Policy
                        </h3>
                        <div className="space-y-3 text-sm text-white/50">
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 font-bold">✓</span>
                                <span><strong className="text-white/70">Free cancellation</strong> up to 14 days before departure</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 font-bold">!</span>
                                <span><strong className="text-white/70">50% refund</strong> for cancellations 7-14 days before</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-400 font-bold">✕</span>
                                <span><strong className="text-white/70">No refund</strong> for cancellations within 7 days</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
                            Changes to booking dates may be subject to availability and price adjustments.
                            Travel insurance is recommended for all bookings.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FormInput({ label, type = "text", placeholder, value, onChange, name, error }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-xs uppercase font-bold tracking-widest text-white/50 ml-1">{label}</label>
                <AnimatePresence>
                    {error && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-red-400 font-medium"
                        >
                            {error}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-transparent border-b py-3 px-1 text-white placeholder:text-white/20 focus:outline-none transition-colors font-light ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-white'
                    }`}
            />
        </div>
    )
}
