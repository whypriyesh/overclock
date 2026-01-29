import { cn } from '../../utils/cn'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

/**
 * Alert Component
 * 
 * @param {Object} props
 * @param {'info' | 'success' | 'warning' | 'error'} props.variant
 * @param {string} props.title
 * @param {boolean} props.dismissible
 * @param {Function} props.onDismiss
 */
export function Alert({
    variant = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    className,
    ...props
}) {
    const variants = {
        info: {
            container: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
            icon: Info,
        },
        success: {
            container: 'bg-green-500/10 border-green-500/30 text-green-300',
            icon: CheckCircle,
        },
        warning: {
            container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
            icon: AlertTriangle,
        },
        error: {
            container: 'bg-red-500/10 border-red-500/30 text-red-300',
            icon: AlertCircle,
        },
    }

    const { container, icon: Icon } = variants[variant]

    return (
        <div
            role="alert"
            className={cn(
                'relative rounded-xl border p-4',
                container,
                className
            )}
            {...props}
        >
            <div className="flex gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    {title && (
                        <h5 className="font-semibold mb-1">{title}</h5>
                    )}
                    {children && (
                        <div className="text-sm opacity-80">{children}</div>
                    )}
                </div>
                {dismissible && (
                    <button
                        onClick={onDismiss}
                        className="p-1 -m-1 opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default Alert
