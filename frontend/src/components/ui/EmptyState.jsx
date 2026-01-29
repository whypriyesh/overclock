import { cn } from '../../utils/cn'
import { Inbox, Search, MapPin, FileX } from 'lucide-react'
import { Button } from './Button'

/**
 * EmptyState Component - shown when no data is available
 * 
 * @param {Object} props
 * @param {'default' | 'search' | 'trips' | 'error'} props.variant
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.actionLabel
 * @param {Function} props.onAction
 */
export function EmptyState({
    variant = 'default',
    title,
    description,
    actionLabel,
    onAction,
    icon: CustomIcon,
    className,
}) {
    const variants = {
        default: {
            icon: Inbox,
            defaultTitle: 'No items yet',
            defaultDescription: 'Get started by creating your first item.',
        },
        search: {
            icon: Search,
            defaultTitle: 'No results found',
            defaultDescription: 'Try adjusting your search or filter to find what you\'re looking for.',
        },
        trips: {
            icon: MapPin,
            defaultTitle: 'No trips planned',
            defaultDescription: 'Start planning your next adventure with our AI trip planner.',
        },
        error: {
            icon: FileX,
            defaultTitle: 'Something went wrong',
            defaultDescription: 'We couldn\'t load this content. Please try again.',
        },
    }

    const config = variants[variant]
    const Icon = CustomIcon || config.icon
    const displayTitle = title || config.defaultTitle
    const displayDescription = description || config.defaultDescription

    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-12 px-4 text-center',
            className
        )}>
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-white/30" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
                {displayTitle}
            </h3>

            <p className="text-sm text-white/50 max-w-sm mb-6">
                {displayDescription}
            </p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary" size="md">
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

export default EmptyState
