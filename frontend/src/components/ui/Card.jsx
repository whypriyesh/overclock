import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Card Component with variants
 */
export const Card = forwardRef(({
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    children,
    ...props
}, ref) => {
    const variants = {
        default: 'bg-white/5 border-white/10',
        elevated: 'bg-white/[0.07] border-white/10 shadow-lg',
        outline: 'bg-transparent border-white/20',
        ghost: 'bg-transparent border-transparent',
        glass: 'bg-white/5 backdrop-blur-md border-white/10',
    }

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return (
        <div
            ref={ref}
            className={cn(
                'rounded-2xl border',
                variants[variant],
                paddings[padding],
                hover && 'transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})

Card.displayName = 'Card'

/**
 * Card Header
 */
export const CardHeader = ({ className, children, ...props }) => (
    <div className={cn('space-y-1.5', className)} {...props}>
        {children}
    </div>
)

/**
 * Card Title
 */
export const CardTitle = ({ className, children, ...props }) => (
    <h3 className={cn('text-xl font-bold text-white', className)} {...props}>
        {children}
    </h3>
)

/**
 * Card Description
 */
export const CardDescription = ({ className, children, ...props }) => (
    <p className={cn('text-sm text-white/60', className)} {...props}>
        {children}
    </p>
)

/**
 * Card Content
 */
export const CardContent = ({ className, children, ...props }) => (
    <div className={cn('pt-4', className)} {...props}>
        {children}
    </div>
)

/**
 * Card Footer
 */
export const CardFooter = ({ className, children, ...props }) => (
    <div className={cn('flex items-center pt-4', className)} {...props}>
        {children}
    </div>
)

export default Card
