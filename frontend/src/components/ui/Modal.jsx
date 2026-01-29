import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useEffect } from 'react'

/**
 * Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} props.size - Modal size
 * @param {boolean} props.showClose - Whether to show close button
 * @param {boolean} props.closeOnOverlay - Whether clicking overlay closes modal
 */
export function Modal({
    open,
    onClose,
    title,
    description,
    size = 'md',
    showClose = true,
    closeOnOverlay = true,
    className,
    children,
}) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onClose?.()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    // Focus Trap
    useEffect(() => {
        if (!open) return

        const modalElement = document.getElementById('modal-content')
        if (!modalElement) return

        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        const handleTab = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault()
                        lastElement?.focus()
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault()
                        firstElement?.focus()
                    }
                }
            }
        }

        modalElement.addEventListener('keydown', handleTab)
        // Focus first element on open
        firstElement?.focus()

        return () => modalElement.removeEventListener('keydown', handleTab)
    }, [open])

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => closeOnOverlay && onClose?.()}
                        className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[400] flex items-center justify-center p-4"
                    >
                        <div
                            id="modal-content"
                            className={cn(
                                'w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl',
                                'relative overflow-hidden',
                                sizes[size],
                                className
                            )}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={title ? 'modal-title' : undefined}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showClose) && (
                                <div className="flex items-start justify-between p-6 pb-0">
                                    <div>
                                        {title && (
                                            <h2
                                                id="modal-title"
                                                className="text-xl font-bold text-white"
                                            >
                                                {title}
                                            </h2>
                                        )}
                                        {description && (
                                            <p className="mt-1 text-sm text-white/50">
                                                {description}
                                            </p>
                                        )}
                                    </div>

                                    {showClose && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 -m-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            aria-label="Close modal"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

/**
 * Modal Footer for actions
 */
export function ModalFooter({ className, children }) {
    return (
        <div className={cn(
            'flex items-center justify-end gap-3 pt-4 border-t border-white/10 -mx-6 -mb-6 mt-6 px-6 py-4 bg-white/[0.02]',
            className
        )}>
            {children}
        </div>
    )
}

export default Modal
