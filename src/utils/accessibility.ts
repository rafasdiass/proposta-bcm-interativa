/**
 * Accessibility Utilities
 *
 * Provides utilities for managing focus, keyboard navigation,
 * and other accessibility features throughout the application.
 *
 * Requirements: 15.2, 15.5
 */

/**
 * Focus Management
 */

/**
 * Traps focus within a container element (useful for modals and dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    element => {
      // Filter out hidden elements
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        window.getComputedStyle(element).visibility !== 'hidden'
      );
    }
  );
}

/**
 * Restores focus to a previously focused element
 */
export function createFocusRestorer(): {
  save: () => void;
  restore: () => void;
} {
  let previouslyFocused: HTMLElement | null = null;

  return {
    save: () => {
      previouslyFocused = document.activeElement as HTMLElement;
    },
    restore: () => {
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    },
  };
}

/**
 * Keyboard Navigation Helpers
 */

/**
 * Handles arrow key navigation for a list of elements
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onNavigate: (newIndex: number) => void,
  options: {
    vertical?: boolean;
    horizontal?: boolean;
    loop?: boolean;
  } = {}
): void {
  const { vertical = true, horizontal = false, loop = true } = options;

  let newIndex = currentIndex;

  if (vertical) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = currentIndex + 1;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = currentIndex - 1;
    }
  }

  if (horizontal) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      newIndex = currentIndex + 1;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      newIndex = currentIndex - 1;
    }
  }

  // Handle Home and End keys
  if (event.key === 'Home') {
    event.preventDefault();
    newIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    newIndex = totalItems - 1;
  }

  // Apply looping or clamping
  if (loop) {
    newIndex = (newIndex + totalItems) % totalItems;
  } else {
    newIndex = Math.max(0, Math.min(newIndex, totalItems - 1));
  }

  if (newIndex !== currentIndex) {
    onNavigate(newIndex);
  }
}

/**
 * Screen Reader Utilities
 */

/**
 * Announces a message to screen readers using a live region
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const liveRegion = getOrCreateLiveRegion(priority);

  // Clear and set new message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Gets or creates an ARIA live region for screen reader announcements
 */
function getOrCreateLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
  const id = `aria-live-${priority}`;
  let liveRegion = document.getElementById(id);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  return liveRegion;
}

/**
 * ARIA Attribute Helpers
 */

/**
 * Generates unique IDs for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Creates ARIA label from text content
 */
export function createAriaLabel(text: string, maxLength: number = 100): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return cleaned.length > maxLength
    ? `${cleaned.substring(0, maxLength)}...`
    : cleaned;
}

/**
 * Color Contrast Utilities
 */

/**
 * Calculates relative luminance of a color (for WCAG contrast calculations)
 */
export function getRelativeLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Checks if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 4.5 : 7;
  return ratio >= requiredRatio;
}

/**
 * Reduced Motion Utilities
 */

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets animation duration based on reduced motion preference
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
}

/**
 * Touch Target Utilities
 */

/**
 * Minimum touch target size (44x44px per WCAG)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Validates if an element meets minimum touch target size
 */
export function meetsTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.width >= MIN_TOUCH_TARGET_SIZE && rect.height >= MIN_TOUCH_TARGET_SIZE
  );
}
