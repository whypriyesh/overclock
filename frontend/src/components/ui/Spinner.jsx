import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

/**
 * Spinner Component
 */
export function Spinner({
    size = 'md',
    className,
    ...props
}) {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    }

    return (
        <Loader2
            className={cn('animate-spin text-white/60', sizes[size], className)}
            {...props}
        />
    )
}

/**
 * Full page loading spinner
 */
export function LoadingScreen({ message = 'Loading...' }) {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <Spinner size="xl" className="text-white mb-4" />
            <p className="text-white/60 text-sm">{message}</p>
        </div>
    )
}

/**
 * Inline loading state
 */
export function LoadingInline({ className }) {
    return (
        <div className={cn('flex items-center justify-center py-8', className)}>
            <Spinner size="lg" />
        </div>
    )
}

export default Spinner
