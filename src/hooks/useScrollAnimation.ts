import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseScrollAnimationOptions {
  /**
   * Whether the animation is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Threshold for intersection observer (0-1)
   * @default 0.1
   */
  threshold?: number;

  /**
   * Root margin for intersection observer
   * @default '-10%'
   */
  rootMargin?: string;

  /**
   * Whether to trigger animation only once
   * @default true
   */
  once?: boolean;
}

interface ScrollAnimationState {
  isInView: boolean;
  hasAnimated: boolean;
}

/**
 * Hook for scroll-triggered animations with reduced motion support
 *
 * Uses Intersection Observer to detect when an element enters the viewport
 * and respects user's reduced motion preferences.
 *
 * Requirements: 16.1, 16.2, 16.5
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    enabled = true,
    threshold = 0.1,
    rootMargin = '-10%',
    once = true,
  } = options;

  const elementRef = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<ScrollAnimationState>({
    isInView: false,
    hasAnimated: false,
  });

  useEffect(() => {
    const element = elementRef.current;

    // Don't set up observer if disabled or element doesn't exist
    if (!enabled || !element) return;

    // If reduced motion is preferred, immediately mark as in view
    if (prefersReducedMotion) {
      setState({ isInView: true, hasAnimated: true });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        setState(prev => {
          // If once is true and already animated, don't update
          if (once && prev.hasAnimated) {
            return prev;
          }

          return {
            isInView: isIntersecting,
            hasAnimated: prev.hasAnimated || isIntersecting,
          };
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, once, prefersReducedMotion]);

  return {
    ref: elementRef,
    isInView: state.isInView,
    hasAnimated: state.hasAnimated,
    shouldAnimate: enabled && !prefersReducedMotion,
  };
}
