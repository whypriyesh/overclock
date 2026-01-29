import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { Skeleton } from './Skeleton'

export function ImageWithSkeleton({ src, alt, className, ...props }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)

    return (
        <div className={cn('relative overflow-hidden', className)}>
            <AnimatePresence>
                {!isLoaded && !error && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10"
                    >
                        <Skeleton className="w-full h-full rounded-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            <img
                src={error ? '/placeholder-image.jpg' : src} // Fallback image if needed
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true)
                    setIsLoaded(true)
                }}
                className={cn(
                    'w-full h-full object-cover transition-opacity duration-500',
                    isLoaded ? 'opacity-100' : 'opacity-0'
                )}
                {...props}
            />
        </div>
    )
}

export default ImageWithSkeleton
