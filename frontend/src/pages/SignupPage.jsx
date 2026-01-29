/**
 * Signup Page
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { authState, signup, clearAuthError } from '../store/auth'
import { Button, Input, Alert } from '../components/ui'

export function SignupPage() {
    const { loading, error } = useSnapshot(authState)
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formErrors, setFormErrors] = useState({})
    const [success, setSuccess] = useState(false)

    const validate = () => {
        const errors = {}
        if (!name.trim()) errors.name = 'Name is required'
        if (!email.trim()) errors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address'
        if (!password) errors.password = 'Password is required'
        else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearAuthError()

        if (!validate()) return

        const result = await signup(email, password, name)
        if (result.success) {
            if (result.needsVerification) {
                setSuccess(true)
            } else {
                navigate('/dashboard', { replace: true })
            }
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Check your email</h1>
                    <p className="text-white/60 mb-8">
                        We've sent a verification link to <strong className="text-white">{email}</strong>.
                        Click the link to verify your account.
                    </p>
                    <Link to="/login">
                        <Button variant="primary" size="lg">
                            Back to Login
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex">
            {/* Left - Image/Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-white/5 to-black items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <img
                        src="/trip it logo.png"
                        alt="TripIt Logo"
                        className="w-48 h-48 mx-auto mb-8 object-contain"
                    />
                    <h2 className="text-3xl font-bold text-white mb-4 font-display tracking-wider">
                        Start Your Journey
                    </h2>
                    <p className="text-white/60 max-w-sm mx-auto">
                        Create an account to save your trips, track your plans, and get personalized recommendations.
                    </p>
                </motion.div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center mb-12">
                        <img
                            src="/trip it logo.png"
                            alt="TripIt Logo"
                            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Header */}
                    <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>
                    <p className="text-white/60 mb-8">
                        Join thousands of travelers planning smarter trips.
                    </p>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="error" className="mb-6" dismissible onDismiss={clearAuthError}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={formErrors.name}
                            leftIcon={<User className="w-4 h-4" />}
                            disabled={loading}
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={formErrors.email}
                            leftIcon={<Mail className="w-4 h-4" />}
                            disabled={loading}
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={formErrors.password}
                            leftIcon={<Lock className="w-4 h-4" />}
                            hint="At least 6 characters"
                            disabled={loading}
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={formErrors.confirmPassword}
                            leftIcon={<Lock className="w-4 h-4" />}
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Sign in link */}
                    <p className="mt-8 text-center text-white/60">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:text-white/80 font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignupPage
