import { useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../contexts/useNavigation';

interface UseSectionIntersectionOptions {
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Hook to track section visibility using Intersection Observer
 * Provides more accurate section detection than scroll-based approach
 */
export function useSectionIntersection({
  enabled = true,
  rootMargin = '-20% 0px -20% 0px', // Only consider sections in middle 60% of viewport
  threshold = 0.1,
}: UseSectionIntersectionOptions = {}) {
  const { state, actions } = useNavigation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<string, number>>(new Map());

  // Register a section element for observation
  const registerSection = useCallback(
    (element: Element, sectionIndex: number) => {
      if (!enabled || state.mode !== 'landing') return;

      const sectionId = `section-${sectionIndex}`;
      sectionsRef.current.set(sectionId, sectionIndex);

      if (observerRef.current) {
        element.setAttribute('data-section-id', sectionId);
        observerRef.current.observe(element);
      }
    },
    [enabled, state.mode]
  );

  // Unregister a section element
  const unregisterSection = useCallback(
    (element: Element, sectionIndex: number) => {
      const sectionId = `section-${sectionIndex}`;
      sectionsRef.current.delete(sectionId);

      if (observerRef.current) {
        observerRef.current.unobserve(element);
      }
    },
    []
  );

  // Initialize intersection observer
  useEffect(() => {
    if (!enabled || state.mode !== 'landing') {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let targetSectionIndex = state.currentSection;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId && sectionsRef.current.has(sectionId)) {
            maxRatio = entry.intersectionRatio;
            targetSectionIndex = sectionsRef.current.get(sectionId)!;
          }
        }
      });

      // Update current section if we found a better match
      if (maxRatio > 0 && targetSectionIndex !== state.currentSection) {
        actions.goToSection(targetSectionIndex);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [
    enabled,
    state.mode,
    state.currentSection,
    rootMargin,
    threshold,
    actions,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    registerSection,
    unregisterSection,
    isEnabled: enabled && state.mode === 'landing',
  };
}
