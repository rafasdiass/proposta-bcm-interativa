/**
 * Preservation Property Test - Desktop Layout Unchanged at ≥1024px
 *
 * This test verifies that desktop layout classes are present in the UNFIXED code.
 * It follows the observation-first methodology: observe current behavior, then
 * ensure it remains unchanged after the fix is applied.
 *
 * These tests should PASS on both unfixed and fixed code, confirming no regressions.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 */
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import React from 'react';

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
  motion: {
    section: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <section ref={ref} {...props}>{children}</section>
    )),
    div: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    h2: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <h2 ref={ref} {...props}>{children}</h2>
    )),
    p: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <p ref={ref} {...props}>{children}</p>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useNavigation context
vi.mock('@/contexts/useNavigation', () => ({
  useNavigation: () => ({
    state: { mode: 'presentation', currentSection: 0, totalSections: 6, isTransitioning: false },
    actions: { setMode: vi.fn(), goToSection: vi.fn(), nextSection: vi.fn(), previousSection: vi.fn(), updateProgress: vi.fn() },
  }),
}));

// Mock proposalPages data with enough entries to render nav buttons
vi.mock('@/data/pages', () => ({
  proposalPages: [
    { id: 'visao-geral', slug: 'visao-geral', title: 'Visão Geral', subtitle: '', variant: 'light', sectionIds: [] },
    { id: 'mercado', slug: 'mercado', title: 'Mercado', subtitle: '', variant: 'dark', sectionIds: [] },
    { id: 'produto', slug: 'produto', title: 'Produto', subtitle: '', variant: 'light', sectionIds: [] },
    { id: 'investimento', slug: 'investimento', title: 'Investimento', subtitle: '', variant: 'dark', sectionIds: [] },
    { id: 'execucao', slug: 'execucao', title: 'Execução', subtitle: '', variant: 'light', sectionIds: [] },
    { id: 'termos', slug: 'termos', title: 'Termos Legais', subtitle: '', variant: 'dark', sectionIds: [] },
  ],
}));

// Mock hooks used by Section
vi.mock('@/hooks', () => ({
  useReducedMotion: () => true,
  useAnimationQueue: () => ({ startAnimation: vi.fn(), endAnimation: vi.fn() }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Shield: () => <span data-testid="icon-shield" />,
  TrendingUp: () => <span data-testid="icon-trending" />,
  Zap: () => <span data-testid="icon-zap" />,
}));

// Mock styles/theme for Section
vi.mock('@/styles/theme', () => ({
  sectionVariants: {
    light: { className: 'bg-white', background: '#ffffff', text: '#000000' },
    dark: { className: 'bg-dark', background: '#08111F', text: '#ffffff' },
    teal: { className: 'bg-teal', background: '#0d3b3b', text: '#ffffff' },
  },
}));

// Mock utils
vi.mock('@/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { Section } from '@/components/sections/Section';
import { ProposalNavbar } from '@/components/navigation/ProposalNavbar';
import CoverSection from '@/components/sections/CoverSection';

describe('Preservation Property: Desktop Layout Unchanged at ≥1024px', () => {
  /**
   * Property 2.1: Section scroll-margin preserved at desktop viewports
   * The Section component must retain `md:scroll-mt-32` class for desktop.
   *
   * **Validates: Requirements 3.2**
   */
  it('Section className contains md:scroll-mt-32 for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          // Viewport width >= 1024 means desktop - preservation must hold
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(
            <Section id="test-section" title="Test" variant="dark">
              <p>Content</p>
            </Section>
          );

          const section = container.querySelector('section');
          expect(section).not.toBeNull();

          // Preservation: md:scroll-mt-32 must be present for desktop
          expect(section!.className).toContain('md:scroll-mt-32');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.2: Section content padding preserved at desktop viewports
   * The Section content div must retain `md:pt-32` class for desktop.
   *
   * **Validates: Requirements 3.2**
   */
  it('Section content className contains md:pt-32 for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(
            <Section id="test-section" title="Test" variant="light">
              <p>Content</p>
            </Section>
          );

          // Find the content div (inner max-w-7xl div with pt-* classes)
          const contentDiv = container.querySelector('[data-section-content] > div');
          expect(contentDiv).not.toBeNull();

          // Preservation: md:pt-32 must be present for desktop
          expect(contentDiv!.className).toContain('md:pt-32');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.3: CoverSection heading size preserved at desktop viewports
   * The CoverSection h1 must retain `md:text-8xl` class for desktop.
   *
   * **Validates: Requirements 3.4**
   */
  it('CoverSection h1 className contains md:text-8xl for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(<CoverSection />);

          const h1 = container.querySelector('h1');
          expect(h1).not.toBeNull();

          // Preservation: md:text-8xl must be present for desktop heading
          expect(h1!.className).toContain('md:text-8xl');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.4: ProposalNavbar logo size preserved at desktop viewports
   * The navbar logo must retain `md:h-28` class for desktop.
   *
   * **Validates: Requirements 3.7, 3.8**
   */
  it('ProposalNavbar logo className contains md:h-28 for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(<ProposalNavbar />);

          const logo = container.querySelector('img[alt="BCM Logo"]');
          expect(logo).not.toBeNull();

          // Preservation: md:h-28 must be present for desktop logo
          expect(logo!.className).toContain('md:h-28');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.5: Desktop nav buttons container has lg:flex class
   * The nav element must have `lg:flex` class for desktop horizontal layout.
   *
   * **Validates: Requirements 3.1**
   */
  it('Nav buttons container has lg:flex class for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(<ProposalNavbar />);

          const nav = container.querySelector('nav[aria-label="Páginas da proposta"]');
          expect(nav).not.toBeNull();

          // Preservation: lg:flex must be present for desktop nav layout
          expect(nav!.className).toContain('lg:flex');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.6: Desktop nav buttons have min-w-[100px] class
   * Each nav button must have `min-w-[100px]` for consistent desktop sizing.
   *
   * **Validates: Requirements 3.1**
   */
  it('Nav buttons have min-w-[100px] class for all desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeGreaterThanOrEqual(1024);

          const { container } = render(<ProposalNavbar />);

          const nav = container.querySelector('nav[aria-label="Páginas da proposta"]');
          expect(nav).not.toBeNull();

          const buttons = nav!.querySelectorAll('button');
          expect(buttons.length).toBeGreaterThan(0);

          // Preservation: each nav button must have min-w-[100px]
          buttons.forEach((button) => {
            expect(button.className).toContain('min-w-[100px]');
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
