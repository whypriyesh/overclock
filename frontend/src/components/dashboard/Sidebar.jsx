import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Map, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useState } from 'react'

export function Sidebar({ onLogout }) {
    const [collapsed, setCollapsed] = useState(false)

    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
        { to: '/dashboard/trips', icon: Map, label: 'My Trips' },
        { to: '/dashboard/profile', icon: User, label: 'Profile' },
    ]

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
                'bg-[#080808] border-r border-white/10 transition-all duration-300',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header with Logo */}
            <Link
                to="/"
                className={cn(
                    'h-16 flex items-center border-b border-white/5 group',
                    collapsed ? 'justify-center px-0' : 'justify-start px-4'
                )}
            >
                <img
                    src="/trip it logo.png"
                    alt="TripIt Logo"
                    className={cn(
                        'object-contain transition-transform duration-300 group-hover:scale-105',
                        collapsed ? 'h-10 w-10' : 'h-12 w-auto'
                    )}
                />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => cn(
                            'flex items-center px-3 py-3 rounded-xl transition-all',
                            'text-white/60 hover:text-white hover:bg-white/5',
                            isActive && 'text-black bg-white font-medium',
                            collapsed && 'justify-center px-0'
                        )}
                        title={collapsed ? link.label : undefined}
                    >
                        <link.icon className={cn('w-5 h-5 flex-shrink-0', !collapsed && 'mr-3')} />
                        {!collapsed && <span>{link.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className={cn(
                        'flex items-center w-full px-3 py-3 rounded-xl transition-all',
                        'text-red-400/70 hover:text-red-400 hover:bg-red-500/10',
                        collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? 'Sign Out' : undefined}
                >
                    <LogOut className={cn('w-5 h-5 flex-shrink-0', !collapsed && 'mr-3')} />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-black border border-white/20 rounded-full p-1 text-white/50 hover:text-white transition-colors"
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3" />
                ) : (
                    <ChevronLeft className="w-3 h-3" />
                )}
            </button>
        </aside>
    )
}

export default Sidebar
