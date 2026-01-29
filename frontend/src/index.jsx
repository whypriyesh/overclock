import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './styles.css'
import { App } from './App'

function Loader() {
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading your adventure...</p>
            </div>
        </div>
    )
}

createRoot(document.getElementById('root')).render(
    <Suspense fallback={<Loader />}>
        <App />
    </Suspense>
)
