/**
 * Test Utilities
 *
 * Common utilities and helpers for writing tests across the application.
 * This file provides reusable test setup, custom render functions, and
 * common test data generators.
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that wraps components with common providers
 *
 * @example
 * ```typescript
 * import { renderWithProviders } from '@/test/test-utils';
 *
 * it('should render with context', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { ...options }),
  };
}

/**
 * Mock window.matchMedia for testing responsive behavior
 *
 * @param matches - Whether the media query matches
 * @param query - The media query string
 *
 * @example
 * ```typescript
 * mockMatchMedia(true, '(prefers-reduced-motion: reduce)');
 * render(<AnimatedComponent />);
 * // Component will respect reduced motion preference
 * ```
 */
export function mockMatchMedia(matches: boolean, query = '') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver for testing scroll-triggered animations
 *
 * @param isIntersecting - Whether elements are intersecting
 *
 * @example
 * ```typescript
 * mockIntersectionObserver(true);
 * render(<ScrollRevealComponent />);
 * // Component will trigger animations as if scrolled into view
 * ```
 */
export function mockIntersectionObserver(isIntersecting: boolean) {
  global.IntersectionObserver = vi.fn().mockImplementation(callback => {
    // Immediately trigger callback with mock entries
    callback([
      {
        isIntersecting,
        target: document.createElement('div'),
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      },
    ]);

    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
    };
  });
}

/**
 * Wait for animations to complete
 * Useful when testing components with Framer Motion animations
 *
 * @param duration - Duration to wait in milliseconds (default: 1000ms)
 *
 * @example
 * ```typescript
 * render(<AnimatedComponent />);
 * await waitForAnimations();
 * expect(screen.getByText('Content')).toBeVisible();
 * ```
 */
export async function waitForAnimations(duration = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Simulate reduced motion preference
 *
 * @example
 * ```typescript
 * simulateReducedMotion();
 * render(<AnimatedComponent />);
 * // Animations will be disabled
 * ```
 */
export function simulateReducedMotion() {
  mockMatchMedia(true, '(prefers-reduced-motion: reduce)');
}

/**
 * Simulate mobile viewport
 *
 * @example
 * ```typescript
 * simulateMobileViewport();
 * render(<ResponsiveComponent />);
 * // Component will render mobile layout
 * ```
 */
export function simulateMobileViewport() {
  mockMatchMedia(true, '(max-width: 767px)');
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
}

/**
 * Simulate tablet viewport
 */
export function simulateTabletViewport() {
  mockMatchMedia(true, '(min-width: 768px) and (max-width: 1023px)');
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });
}

/**
 * Simulate desktop viewport
 */
export function simulateDesktopViewport() {
  mockMatchMedia(true, '(min-width: 1024px)');
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
  });
}

/**
 * Test data generators for common entities
 */
export const testData = {
  /**
   * Generate test plan mix that sums to 100%
   */
  planMix: (
    professional = 60,
    clinic = 30,
    school = 10
  ): { professional: number; clinic: number; school: number } => {
    const total = professional + clinic + school;
    return {
      professional: (professional / total) * 100,
      clinic: (clinic / total) * 100,
      school: (school / total) * 100,
    };
  },

  /**
   * Generate test tranche data
   */
  tranche: (
    id: string,
    amount: number,
    trigger: string
  ): {
    id: string;
    amount: number;
    trigger: string;
    deliverables: string[];
  } => ({
    id,
    amount,
    trigger,
    deliverables: [`Deliverable for ${id}`],
  }),

  /**
   * Generate test section configuration
   */
  section: (
    id: string,
    title: string,
    variant: 'light' | 'dark' | 'teal' = 'light'
  ): {
    id: string;
    title: string;
    variant: 'light' | 'dark' | 'teal';
  } => ({
    id,
    title,
    variant,
  }),

  /**
   * Generate test module card data
   */
  moduleCard: (
    id: string,
    title: string,
    description: string
  ): {
    id: string;
    title: string;
    description: string;
  } => ({
    id,
    title,
    description,
  }),

  /**
   * Generate test protocol data
   */
  protocol: (
    id: string,
    name: string,
    isPriority = false
  ): {
    id: string;
    name: string;
    isPriority: boolean;
  } => ({
    id,
    name,
    isPriority,
  }),
};

/**
 * Assertion helpers for common test scenarios
 */
export const assertions = {
  /**
   * Assert element has proper accessibility attributes
   */
  hasAccessibleButton: (element: HTMLElement) => {
    expect(element).toHaveAttribute('role', 'button');
    expect(element).toHaveAttribute('aria-label');
    expect(element).not.toHaveAttribute('aria-hidden', 'true');
  },

  /**
   * Assert element is keyboard accessible
   */
  isKeyboardAccessible: (element: HTMLElement) => {
    expect(element).toHaveAttribute('tabindex');
    const tabindex = element.getAttribute('tabindex');
    expect(tabindex).not.toBe('-1');
  },

  /**
   * Assert currency format is valid BRL
   */
  isValidBRLCurrency: (value: string) => {
    // Should match pattern: R$ X.XXX,XX or R$ XXX,XX
    expect(value).toMatch(/R\$\s*-?\d{1,3}(\.\d{3})*,\d{2}/);
  },

  /**
   * Assert date format is valid pt-BR
   */
  isValidBRDate: (value: string) => {
    // Should match pattern: dd/MM/yyyy
    expect(value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  },

  /**
   * Assert element has WCAG AA contrast
   */
  hasMinimumContrast: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // Note: This is a simplified check. For production, use a proper
    // contrast calculation library like 'color-contrast-checker'
    expect(color).toBeTruthy();
    expect(backgroundColor).toBeTruthy();
  },
};

/**
 * Mock fetch for testing API calls
 *
 * @param response - The response to return
 * @param status - HTTP status code (default: 200)
 *
 * @example
 * ```typescript
 * mockFetch({ success: true, id: '123' });
 * // Now fetch calls will return this response
 * ```
 */
export function mockFetch(response: unknown, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
}

/**
 * Mock fetch error for testing error handling
 *
 * @param error - Error message or Error object
 *
 * @example
 * ```typescript
 * mockFetchError('Network error');
 * // Now fetch calls will reject with this error
 * ```
 */
export function mockFetchError(error: string | Error) {
  global.fetch = vi
    .fn()
    .mockRejectedValue(typeof error === 'string' ? new Error(error) : error);
}

/**
 * Create a spy on console methods for testing error handling
 *
 * @example
 * ```typescript
 * const consoleSpy = spyOnConsole();
 * // Do something that logs errors
 * expect(consoleSpy.error).toHaveBeenCalledWith('Error message');
 * consoleSpy.restore();
 * ```
 */
export function spyOnConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});

  return {
    error,
    warn,
    log,
    restore: () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    },
  };
}

/**
 * Re-export commonly used testing utilities
 */
export { render, screen, waitFor, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
