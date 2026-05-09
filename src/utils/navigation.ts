/**
 * Navigation utilities for section management and smooth scrolling
 */

export interface SectionNavigationOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

/**
 * Scroll to a specific section by index in landing mode
 */
export function scrollToSection(
  sectionIndex: number,
  options: SectionNavigationOptions = {}
): void {
  const sectionElement = document.getElementById(`section-${sectionIndex}`);

  if (sectionElement) {
    sectionElement.scrollIntoView({
      behavior: options.behavior || 'smooth',
      block: options.block || 'start',
      inline: options.inline || 'nearest',
    });
  }
}

/**
 * Get section element by index
 */
export function getSectionElement(sectionIndex: number): Element | null {
  return document.getElementById(`section-${sectionIndex}`);
}

/**
 * Get all section elements
 */
export function getAllSectionElements(): Element[] {
  return Array.from(document.querySelectorAll('[id^="section-"]'));
}

/**
 * Calculate section progress based on scroll position
 */
export function calculateSectionProgress(): number {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  return scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
}

/**
 * Get current section index based on scroll position
 */
export function getCurrentSectionFromScroll(totalSections: number): number {
  const progress = calculateSectionProgress();
  const sectionIndex = Math.floor(progress * totalSections);
  return Math.max(0, Math.min(sectionIndex, totalSections - 1));
}

import { findPageIndexBySlug, proposalPages } from '@/data/pages';

/**
 * Parse page index from URL fragment.
 * Numeric fragments are kept for backwards compatibility with older links.
 */
export function parseSectionFromFragment(fragment: string): number | null {
  const cleanFragment = fragment.replace(/^#/, '');
  const numericMatch = cleanFragment.match(/^secao-(\d+)$/);

  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  return findPageIndexBySlug(cleanFragment);
}

/**
 * Generate page fragment for URL
 */
export function generateSectionFragment(sectionIndex: number): string {
  return proposalPages[sectionIndex]?.slug ?? `secao-${sectionIndex}`;
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get scroll behavior based on user preferences
 */
export function getScrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
