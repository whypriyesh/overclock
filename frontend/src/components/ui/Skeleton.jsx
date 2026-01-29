import { cn } from '../../utils/cn'

/**
 * Skeleton loading placeholder
 */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-white/10',
                className
            )}
            {...props}
        />
    )
}

/**
 * Skeleton Text - simulates text lines
 */
export function SkeletonText({ lines = 3, className }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 && 'w-3/4' // Last line shorter
                    )}
                />
            ))}
        </div>
    )
}

/**
 * Skeleton Card - full card placeholder
 */
export function SkeletonCard({ className }) {
    return (
        <div className={cn(
            'rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4',
            className
        )}>
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={2} />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    )
}

/**
 * Skeleton Avatar
 */
export function SkeletonAvatar({ size = 'md', className }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    }

    return (
        <Skeleton className={cn('rounded-full', sizes[size], className)} />
    )
}

/**
 * Skeleton Button
 */
export function SkeletonButton({ size = 'md', className }) {
    const sizes = {
        sm: 'h-8 w-20',
        md: 'h-10 w-24',
        lg: 'h-12 w-32',
    }

    return (
        <Skeleton className={cn('rounded-xl', sizes[size], className)} />
    )
}

/**
 * Trip Card Skeleton
 */
export function TripCardSkeleton({ className }) {
    return (
        <div className={cn(
            'rounded-2xl border border-white/10 bg-white/5 overflow-hidden',
            className
        )}>
            {/* Image placeholder */}
            <Skeleton className="h-48 rounded-none" />

            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default Skeleton
