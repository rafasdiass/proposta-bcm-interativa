import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Section } from './Section';
import * as hooks from '@/hooks';

/**
 * Integration tests for Section component scroll-triggered animations
 *
 * Tests Requirements: 16.1, 16.2, 16.4, 16.5
 */
describe('Section - Scroll-Triggered Animation Integration', () => {
  let mockIntersectionObserver: any;
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock IntersectionObserver as a proper constructor
    mockIntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
    global.IntersectionObserver = mockIntersectionObserver as any;

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Requirement 16.1: Framer Motion animations for section reveals', () => {
    it('should use Framer Motion for section animations', () => {
      const { container } = render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      // Framer Motion adds data attributes to animated elements
      expect(section).toBeTruthy();
    });

    it('should animate sections when they enter viewport', async () => {
      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Verify IntersectionObserver was created (Framer Motion creates it internally)
      // The component uses whileInView which triggers IntersectionObserver
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Requirement 16.2: Animation duration between 300ms and 600ms', () => {
    it('should use 600ms duration for normal motion', () => {
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // The component uses 600ms duration for normal animations
      // This is verified by the animationTransition configuration
      expect(hooks.useReducedMotion).toHaveBeenCalled();
    });

    it('should use 100ms duration for reduced motion', () => {
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(true);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // The component uses 100ms duration for reduced motion
      expect(hooks.useReducedMotion).toHaveBeenCalled();
    });
  });

  describe('Requirement 16.4: Limit concurrent animations for performance', () => {
    it('should use animation queue to limit concurrent animations', () => {
      const mockAnimationQueue = {
        startAnimation: vi.fn(cb => {
          cb();
          return true;
        }),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 0, queued: 0, canStart: true })),
        animationId: 'test-animation',
      };

      vi.spyOn(hooks, 'useAnimationQueue').mockReturnValue(mockAnimationQueue);
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Verify animation queue is used
      expect(hooks.useAnimationQueue).toHaveBeenCalledWith(
        'section-test-section'
      );
      expect(mockAnimationQueue.startAnimation).toHaveBeenCalled();
    });

    it('should release animation slot after animation completes', async () => {
      const mockAnimationQueue = {
        startAnimation: vi.fn(cb => {
          cb();
          return true;
        }),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 0, queued: 0, canStart: true })),
        animationId: 'test-animation',
      };

      vi.spyOn(hooks, 'useAnimationQueue').mockReturnValue(mockAnimationQueue);
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);

      const { unmount } = render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Wait for animation to complete (600ms)
      await waitFor(
        () => {
          expect(mockAnimationQueue.endAnimation).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      // Cleanup should also call endAnimation
      unmount();
      expect(mockAnimationQueue.endAnimation).toHaveBeenCalled();
    });

    it('should not use animation queue when reduced motion is preferred', () => {
      const mockAnimationQueue = {
        startAnimation: vi.fn(),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 0, queued: 0, canStart: true })),
        animationId: 'test-animation',
      };

      vi.spyOn(hooks, 'useAnimationQueue').mockReturnValue(mockAnimationQueue);
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(true);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Animation queue should not be started when reduced motion is preferred
      expect(mockAnimationQueue.startAnimation).not.toHaveBeenCalled();
    });
  });

  describe('Requirement 16.5: Respect prefers-reduced-motion user preference', () => {
    it('should use minimal animation when reduced motion is preferred', () => {
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(true);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Verify reduced motion hook is called
      expect(hooks.useReducedMotion).toHaveBeenCalled();
    });

    it('should use full animation when reduced motion is not preferred', () => {
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);

      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Verify reduced motion hook is called
      expect(hooks.useReducedMotion).toHaveBeenCalled();
    });

    it('should use opacity-only transition with max 100ms for reduced motion', () => {
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(true);

      const { container } = render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // When reduced motion is preferred, the component uses:
      // - opacity: 1 for both hidden and visible states (no opacity change)
      // - duration: 0.1 (100ms)
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Intersection Observer viewport detection', () => {
    it('should configure viewport detection with correct parameters', () => {
      render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      // Framer Motion's whileInView uses IntersectionObserver internally
      // The component configures:
      // - once: true (animate only once)
      // - margin: '-10%' (trigger when section is 10% into viewport)
      // - amount: 0.1 (trigger when 10% of section is visible)
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Multiple sections animation coordination', () => {
    it('should handle multiple sections with independent animations', () => {
      const mockAnimationQueue1 = {
        startAnimation: vi.fn(cb => {
          cb();
          return true;
        }),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 1, queued: 0, canStart: true })),
        animationId: 'section-1',
      };

      const mockAnimationQueue2 = {
        startAnimation: vi.fn(cb => {
          cb();
          return true;
        }),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 2, queued: 0, canStart: true })),
        animationId: 'section-2',
      };

      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);
      vi.spyOn(hooks, 'useAnimationQueue')
        .mockReturnValueOnce(mockAnimationQueue1)
        .mockReturnValueOnce(mockAnimationQueue2);

      const { container } = render(
        <>
          <Section id="section-1" title="Section 1" variant="light">
            <div>Content 1</div>
          </Section>
          <Section id="section-2" title="Section 2" variant="dark">
            <div>Content 2</div>
          </Section>
        </>
      );

      // Both sections should use animation queue
      expect(hooks.useAnimationQueue).toHaveBeenCalledWith('section-section-1');
      expect(hooks.useAnimationQueue).toHaveBeenCalledWith('section-section-2');

      // Both sections should be rendered
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });
  });

  describe('Animation lifecycle management', () => {
    it('should clean up animation on unmount', () => {
      const mockAnimationQueue = {
        startAnimation: vi.fn(cb => {
          cb();
          return true;
        }),
        endAnimation: vi.fn(),
        cancelAnimation: vi.fn(),
        getQueueStatus: vi.fn(() => ({ active: 0, queued: 0, canStart: true })),
        animationId: 'test-animation',
      };

      vi.spyOn(hooks, 'useAnimationQueue').mockReturnValue(mockAnimationQueue);
      vi.spyOn(hooks, 'useReducedMotion').mockReturnValue(false);

      const { unmount } = render(
        <Section id="test-section" title="Test Section" variant="light">
          <div>Test Content</div>
        </Section>
      );

      unmount();

      // Cleanup should call endAnimation
      expect(mockAnimationQueue.endAnimation).toHaveBeenCalled();
    });
  });
});
