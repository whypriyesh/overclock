import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/dashboard/Sidebar'
import { logout, authState } from '../store/auth'
import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { Bell, Search, ChevronDown } from 'lucide-react'
import { Avatar } from '../components/ui'

export function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSnapshot(authState)
    // We could share the collapsed state here via context if needed to adjust main content margin
    // For now we'll assume a fixed margin or media query approach, or just let content flow
    // Actually, to make it responsive effectively with the collapsible sidebar, 
    // passing the collapsed state up or using a wide enough margin for expanded state is easier.
    // However, the sidebar has internal state. Let's make the main content margin adaptive.
    // For simplicity in this iteration, I'll use a fixed margin that works for expanded (w-64 = 16rem).

    // Get page title from path
    const path = location.pathname.split('/').pop()
    const title = path === 'dashboard' ? 'Overview' : path.charAt(0).toUpperCase() + path.slice(1)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar onLogout={handleLogout} />

            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 bg-black/90 backdrop-blur-xl z-30 shadow-lg shadow-black/20">
                    <h1 className="text-xl font-bold capitalize">{title}</h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
                        </button>

                        <div className="h-8 w-px bg-white/10 mx-2" />

                        <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            <Avatar size="sm" name={user?.user_metadata?.name || user?.email} />
                            <span className="text-sm font-medium hidden md:block">
                                {user?.user_metadata?.name || 'User'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-white/40" />
                        </button>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
