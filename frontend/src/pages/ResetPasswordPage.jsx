/**
 * Reset Password Page
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { authState, resetPassword, clearAuthError } from '../store/auth'
import { Button, Input, Alert } from '../components/ui'

export function ResetPasswordPage() {
    const { loading, error } = useSnapshot(authState)

    const [email, setEmail] = useState('')
    const [formError, setFormError] = useState('')
    const [success, setSuccess] = useState(false)

    const validate = () => {
        if (!email.trim()) {
            setFormError('Email is required')
            return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Invalid email address')
            return false
        }
        setFormError('')
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearAuthError()

        if (!validate()) return

        const result = await resetPassword(email)
        if (result.success) {
            setSuccess(true)
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
                        We've sent a password reset link to <strong className="text-white">{email}</strong>.
                        Follow the instructions to reset your password.
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
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center mb-12">
                    <img
                        src="/trip it logo.png"
                        alt="TripIt Logo"
                        className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Reset password</h1>
                    <p className="text-white/60">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

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
                        error={formError}
                        leftIcon={<Mail className="w-4 h-4" />}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                    >
                        Send Reset Link
                    </Button>
                </form>

                {/* Back to login */}
                <div className="mt-8 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPasswordPage
