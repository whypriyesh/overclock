import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogIn } from 'lucide-react'
import { useSnapshot } from 'valtio'
import { authState } from '../store/auth'

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plan Trip', path: '/planner', highlight: true },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
]

export function Navbar() {
    const location = useLocation()
    const { user, isLoading } = useSnapshot(authState)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <img
                                src="/trip it logo.png"
                                alt="TripIt Logo"
                                className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path ||
                                    (link.path === '/planner' && location.pathname.startsWith('/planner'))
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 text-sm font-medium transition-colors ${link.highlight ? 'font-bold' : ''}`}
                                    >
                                        <span className={`relative z-10 transition-colors ${isActive
                                            ? 'text-black'
                                            : 'text-white/60 hover:text-white'
                                            }`}>
                                            {link.name}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Auth Buttons (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            {!isLoading && (
                                user ? (
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="btn btn-primary px-5 py-2.5 text-sm"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign Up
                                        </Link>
                                    </>
                                )
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <div className="relative pt-24 px-6">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link, index) => {
                                    const isActive = location.pathname === link.path
                                    return (
                                        <motion.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                to={link.path}
                                                className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Mobile Auth Buttons */}
                            <motion.div
                                className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {!isLoading && (
                                    user ? (
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-medium"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>Go to Dashboard</span>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block text-center px-4 py-3 text-white/60 font-medium rounded-xl hover:bg-white/5 transition-colors"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="btn btn-primary w-full py-3 text-base justify-center"
                                            >
                                                <LogIn className="w-5 h-5" />
                                                Sign Up
                                            </Link>
                                        </>
                                    )
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
