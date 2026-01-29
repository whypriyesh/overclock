import { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

/**
 * Input Component
 * 
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.error
 * @param {string} props.hint
 * @param {boolean} props.success
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 */
export const Input = forwardRef(({
    className,
    type = 'text',
    label,
    error,
    hint,
    success,
    size = 'md',
    leftIcon,
    rightIcon,
    disabled,
    required,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const sizeClasses = {
        sm: 'h-8 text-sm px-3',
        md: 'h-10 text-sm px-4',
        lg: 'h-12 text-base px-4',
    }

    const iconSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    }

    return (
        <div className="w-full space-y-1.5">
            {/* Label */}
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative">
                {/* Left icon */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                        {leftIcon}
                    </div>
                )}

                {/* Input */}
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    className={cn(
                        // Base styles
                        'w-full bg-white/5 border rounded-xl text-white placeholder:text-white/25',
                        'transition-all duration-200 ease-out',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        // Size
                        sizeClasses[size],
                        // Left icon padding
                        leftIcon && 'pl-10',
                        // Right icon padding (password or custom)
                        (isPassword || rightIcon || error || success) && 'pr-10',
                        // States
                        error
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                            : success
                                ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20'
                                : 'border-white/10 hover:border-white/20 focus:border-white focus:ring-white/20',
                        className
                    )}
                    {...props}
                />

                {/* Right side icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {/* Status icons */}
                    {error && !isPassword && (
                        <AlertCircle className={cn(iconSizeClasses[size], 'text-red-400')} />
                    )}
                    {success && !isPassword && !error && (
                        <Check className={cn(iconSizeClasses[size], 'text-green-400')} />
                    )}

                    {/* Password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white/40 hover:text-white/60 transition-colors focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className={iconSizeClasses[size]} />
                            ) : (
                                <Eye className={iconSizeClasses[size]} />
                            )}
                        </button>
                    )}

                    {/* Custom right icon */}
                    {rightIcon && !isPassword && !error && !success && (
                        <span className="text-white/40">{rightIcon}</span>
                    )}
                </div>
            </div>

            {/* Error or hint message */}
            {(error || hint) && (
                <p className={cn(
                    'text-xs',
                    error ? 'text-red-400' : 'text-white/40'
                )}>
                    {error || hint}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

/**
 * Textarea Component
 */
export const Textarea = forwardRef(({
    className,
    label,
    error,
    hint,
    rows = 4,
    required,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    'w-full bg-white/5 border rounded-xl text-white placeholder:text-white/25',
                    'px-4 py-3 text-sm resize-none',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-offset-0',
                    error
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 hover:border-white/20 focus:border-white focus:ring-white/20',
                    className
                )}
                {...props}
            />

            {(error || hint) && (
                <p className={cn(
                    'text-xs',
                    error ? 'text-red-400' : 'text-white/40'
                )}>
                    {error || hint}
                </p>
            )}
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Input
