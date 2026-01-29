import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with conflict resolution
 * @param  {...string} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
