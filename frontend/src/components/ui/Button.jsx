import { forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

/**
 * Button variants following the design system
 */
const buttonVariants = {
    variant: {
        primary: 'btn btn-primary',
        secondary: 'btn btn-secondary',
        outline: 'btn border border-white/20 text-white hover:bg-white/5', // Keeping some utilities for outline as it's specific
        ghost: 'btn text-white/60 hover:text-white hover:bg-white/10 bg-transparent shadow-none',
        danger: 'btn bg-red-500 text-white hover:bg-red-600 shadow-md',
        success: 'btn bg-green-600 text-white hover:bg-green-700 shadow-md',
        link: 'text-white/60 hover:text-white underline-offset-4 hover:underline p-0 h-auto font-normal',
    },
    size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
    },
}

/**
 * Button Component
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link'} props.variant
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'} props.size
 * @param {boolean} props.loading
 * @param {boolean} props.disabled
 * @param {boolean} props.fullWidth
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 */
export const Button = forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    ...props
}, ref) => {
    const isDisabled = disabled || loading

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={cn(
                // Base styles
                // 'inline-flex items-center justify-center font-semibold', // Handled by .btn
                // 'transition-all duration-200 ease-out', // Handled by .btn
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                'active:scale-[0.98] hover:scale-[1.02] transition-transform',
                // Variant
                buttonVariants.variant[variant],
                // Size
                buttonVariants.size[size],
                // Full width
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : leftIcon ? (
                <span className="flex-shrink-0">{leftIcon}</span>
            ) : null}

            {children && (
                <span className={cn(loading && 'ml-2')}>
                    {children}
                </span>
            )}

            {rightIcon && !loading && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
