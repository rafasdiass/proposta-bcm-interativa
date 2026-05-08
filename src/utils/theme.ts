/**
 * Theme utility functions for the Interactive BCM Proposal
 */

import { theme, sectionVariants, type SectionVariant } from '@/styles/theme';

/**
 * Get CSS class names for a section variant
 */
export function getSectionClasses(variant: SectionVariant): string {
  const baseClasses = 'min-h-screen flex items-center justify-center py-16';
  const variantClasses = sectionVariants[variant].className;

  return `${baseClasses} ${variantClasses}`;
}

/**
 * Get section theme configuration
 */
export function getSectionTheme(variant: SectionVariant) {
  return sectionVariants[variant];
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get responsive breakpoint value
 */
export function getBreakpoint(
  breakpoint: keyof typeof theme.breakpoints
): string {
  return theme.breakpoints[breakpoint];
}

/**
 * Create CSS custom properties from theme colors
 */
export function createCSSCustomProperties(): Record<string, string> {
  const properties: Record<string, string> = {};

  // Add color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      properties[`--color-${key}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        properties[`--color-${key}-${subKey}`] = subValue;
      });
    }
  });

  // Add spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    properties[`--spacing-${key}`] = value;
  });

  return properties;
}

/**
 * Generate Tailwind class string with conditional classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get theme color by key with fallback
 */
export function getThemeColor(colorKey: string, fallback = '#000000'): string {
  const keys = colorKey.split('.');
  let value: unknown = theme.colors;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return fallback;
    }
  }

  return typeof value === 'string' ? value : fallback;
}

/**
 * Check if current viewport matches a breakpoint
 */
export function matchesBreakpoint(
  breakpoint: keyof typeof theme.breakpoints
): boolean {
  if (typeof window === 'undefined') return false;

  const breakpointValue = parseInt(theme.breakpoints[breakpoint]);
  return window.innerWidth >= breakpointValue;
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(
  duration: keyof typeof theme.animation.duration
): string {
  if (prefersReducedMotion()) {
    return '0ms';
  }

  return theme.animation.duration[duration];
}

/**
 * Create media query string for breakpoint
 */
export function createMediaQuery(
  breakpoint: keyof typeof theme.breakpoints
): string {
  return `(min-width: ${theme.breakpoints[breakpoint]})`;
}

/**
 * Validate section variant
 */
export function isValidSectionVariant(
  variant: string
): variant is SectionVariant {
  return variant in sectionVariants;
}

/**
 * Get contrast color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): string {
  // Simple contrast calculation - in a real app you might want a more sophisticated algorithm
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default {
  getSectionClasses,
  getSectionTheme,
  prefersReducedMotion,
  getBreakpoint,
  createCSSCustomProperties,
  cn,
  getThemeColor,
  matchesBreakpoint,
  getAnimationDuration,
  createMediaQuery,
  isValidSectionVariant,
  getContrastColor,
};
