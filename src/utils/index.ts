// Utility functions for the Interactive BCM Proposal

// Re-export navigation utilities
export * from './navigation';

// Re-export formatting utilities
export * from './formatting';

// Re-export accessibility utilities
export * from './accessibility';

// Re-export analytics utilities
export * from './analytics';

// Re-export error logging utilities
export * from './errorLogging';

// Re-export performance utilities
export * from './performance';

/**
 * Generate URL-friendly slug from text
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if user prefers reduced motion
 * @deprecated Use prefersReducedMotion from './navigation' instead
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Concatenate class names conditionally
 * Simple utility for combining Tailwind classes
 */
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};
