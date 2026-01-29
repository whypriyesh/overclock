import { cn } from '../../utils/cn'
import { User } from 'lucide-react'

/**
 * Avatar Component
 * 
 * @param {Object} props
 * @param {string} props.src - Image source
 * @param {string} props.alt - Alt text
 * @param {string} props.name - User name for fallback initials
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} props.size
 */
export function Avatar({
    src,
    alt,
    name,
    size = 'md',
    className,
    ...props
}) {
    const sizes = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    }

    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    }

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return null
        const parts = name.split(' ').filter(Boolean)
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return parts[0]?.slice(0, 2).toUpperCase() || null
    }

    const initials = getInitials(name)

    if (src) {
        return (
            <img
                src={src}
                alt={alt || name || 'Avatar'}
                className={cn(
                    'rounded-full object-cover bg-white/10',
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }

    return (
        <div
            className={cn(
                'rounded-full bg-white/20 flex items-center justify-center font-semibold text-white',
                sizes[size],
                className
            )}
            {...props}
        >
            {initials || <User className={iconSizes[size]} />}
        </div>
    )
}

/**
 * Avatar Group
 */
export function AvatarGroup({ avatars = [], max = 4, size = 'md', className }) {
    const displayed = avatars.slice(0, max)
    const remaining = avatars.length - max

    return (
        <div className={cn('flex -space-x-2', className)}>
            {displayed.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    name={avatar.name}
                    size={size}
                    className="ring-2 ring-black"
                />
            ))}
            {remaining > 0 && (
                <div className={cn(
                    'rounded-full bg-white/10 flex items-center justify-center font-medium text-white/70 ring-2 ring-black',
                    size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
                )}>
                    +{remaining}
                </div>
            )}
        </div>
    )
}

export default Avatar
