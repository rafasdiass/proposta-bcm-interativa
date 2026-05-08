import { useEffect, useCallback } from 'react';
import { useNavigation } from '../contexts/useNavigation';

interface UseScrollProgressOptions {
  enabled?: boolean;
  throttleMs?: number;
}

/**
 * Hook to track scroll progress and update navigation state in landing mode
 */
export function useScrollProgress({
  enabled = true,
  throttleMs = 100,
}: UseScrollProgressOptions = {}) {
  const { state, actions } = useNavigation();

  const handleScroll = useCallback(() => {
    if (!enabled || state.mode !== 'landing') return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Calculate scroll progress (0 to 1)
    const progress =
      scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

    // Update navigation progress
    actions.updateProgress(progress);
  }, [enabled, state.mode, actions]);

  // Throttled scroll handler
  useEffect(() => {
    if (!enabled || state.mode !== 'landing') return;

    let timeoutId: number;
    let lastCallTime = 0;

    const throttledScrollHandler = () => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime;

      if (timeSinceLastCall >= throttleMs) {
        handleScroll();
        lastCallTime = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleScroll();
          lastCallTime = Date.now();
        }, throttleMs - timeSinceLastCall);
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });

    // Initial call to set correct section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(timeoutId);
    };
  }, [enabled, state.mode, throttleMs, handleScroll]);

  return {
    progress: state.currentSection / (state.totalSections - 1),
    currentSection: state.currentSection,
  };
}
