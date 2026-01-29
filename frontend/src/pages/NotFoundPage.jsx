import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-8">
                <AlertCircle className="w-16 h-16 text-white/40" />
            </div>

            <h1 className="text-6xl font-black mb-4" style={{ fontFamily: 'Bebas Neue' }}>
                404
            </h1>

            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>

            <p className="text-white/50 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Button
                variant="primary"
                onClick={() => navigate('/')}
                leftIcon={<Home className="w-4 h-4" />}
            >
                Back to Home
            </Button>
        </div>
    )
}

export default NotFoundPage
