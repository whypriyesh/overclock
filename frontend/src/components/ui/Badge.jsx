import { cn } from '../../utils/cn'

/**
 * Badge Component for status indicators
 */
export function Badge({
    variant = 'default',
    size = 'md',
    className,
    children,
    ...props
}) {
    const variants = {
        default: 'bg-white/10 text-white/60 border-white/10',
        primary: 'bg-white/20 text-white border-white/30',
        success: 'bg-green-500/20 text-green-300 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-300 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full border',
                'uppercase tracking-wider',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}

/**
 * Status Dot - small indicator
 */
export function StatusDot({ status = 'default', className }) {
    const colors = {
        default: 'bg-white/40',
        online: 'bg-green-400',
        offline: 'bg-gray-400',
        busy: 'bg-red-400',
        away: 'bg-yellow-400',
    }

    return (
        <span
            className={cn(
                'inline-block w-2 h-2 rounded-full',
                colors[status],
                className
            )}
        />
    )
}

export default Badge
