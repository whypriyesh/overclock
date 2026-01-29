/**
 * Login Page
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { authState, login, clearAuthError } from '../store/auth'
import { Button, Input, Alert } from '../components/ui'

export function LoginPage() {
    const { loading, error } = useSnapshot(authState)
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const from = location.state?.from?.pathname || '/dashboard'

    const validate = () => {
        const errors = {}
        if (!email.trim()) errors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address'
        if (!password) errors.password = 'Password is required'
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearAuthError()

        if (!validate()) return

        const result = await login(email, password)
        if (result.success) {
            navigate(from, { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-black flex">
            {/* Left - Form */}
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
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-white/60 mb-8">
                        Sign in to access your trips and continue planning.
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
                            disabled={loading}
                        />

                        <div className="flex justify-end">
                            <Link
                                to="/reset-password"
                                className="text-sm text-white/70 hover:text-white"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Sign up link */}
                    <p className="mt-8 text-center text-white/60">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white hover:text-white/80 font-medium">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right - Image/Branding */}
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
                        Your AI Travel Companion
                    </h2>
                    <p className="text-white/60 max-w-sm mx-auto">
                        Plan personalized trips, generate detailed itineraries, and explore the world with AI-powered recommendations.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginPage
