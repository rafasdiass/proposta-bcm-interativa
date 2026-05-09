/**
 * Bug Condition Exploration Property Test
 *
 * This test encodes the EXPECTED (correct) behavior for responsive layout.
 * It is designed to FAIL on unfixed code, confirming the bugs exist.
 *
 * Bug Condition: isBugCondition(input) where:
 *   - viewportWidth < 1024 AND element IN ['section-padding', 'scroll-margin', 'navbar-layout']
 *   - viewportWidth <= 320 AND element IN ['grid-250', 'grid-280']
 *   - viewportWidth < 640 AND element IN ['cover-heading', 'sticky-cta-padding', 'navbar-logo']
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 */
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
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

// Mock proposalPages data
vi.mock('@/data/pages', () => ({
  proposalPages: [
    { id: 'visao-geral', slug: 'visao-geral', title: 'Visão Geral', subtitle: '', variant: 'light', sectionIds: [] },
    { id: 'mercado', slug: 'mercado', title: 'Mercado', subtitle: '', variant: 'dark', sectionIds: [] },
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

// Mock SectionRenderer to avoid deep component tree for App test
vi.mock('@/components/sections', () => ({
  SectionRenderer: () => <div data-testid="section-renderer">Sections</div>,
}));

// Mock SkipLinks and AppErrorBoundary
vi.mock('@/components/common', () => ({
  SkipLinks: () => <div data-testid="skip-links" />,
  AppErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock NavigationProvider
vi.mock('@/contexts', () => ({
  NavigationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the barrel import @/components/navigation (used by App.tsx)
// This does NOT affect the direct import @/components/navigation/ProposalNavbar used by Properties 4 & 6
vi.mock('@/components/navigation', () => ({
  ProposalNavbar: () => <header data-testid="navbar"><div>Navbar</div></header>,
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
import App from '@/App';


describe('Bug Condition Exploration: Mobile Layout Overflow and Overlap', () => {
  /**
   * Property 1: Section scroll-margin on mobile viewports
   * Expected: scroll-mt-28 (7rem = 112px) to clear navbar (~104px)
   * Current bug: scroll-mt-24 (96px) is insufficient
   *
   * Validates: Requirements 1.2
   */
  it('Section component should have scroll-mt-28 class for mobile viewports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375, 768),
        (viewportWidth: number) => {
          // Viewport width < 1024 triggers the bug condition for scroll-margin
          expect(viewportWidth).toBeLessThan(1024);

          const { container } = render(
            <Section id="test-section" title="Test" variant="dark">
              <p>Content</p>
            </Section>
          );

          const section = container.querySelector('section');
          expect(section).not.toBeNull();

          // Expected behavior: scroll-mt-28 for mobile (7rem = 112px clearance)
          expect(section!.className).toContain('scroll-mt-28');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 2: Section content padding on mobile viewports
   * Expected: pt-28 (7rem = 112px) to clear navbar (~104px)
   * Current bug: pt-24 (96px) causes 8px overlap
   *
   * Validates: Requirements 1.1
   */
  it('Section content div should have pt-28 class for mobile viewports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375, 768),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeLessThan(1024);

          const { container } = render(
            <Section id="test-section" title="Test" variant="dark">
              <p>Content</p>
            </Section>
          );

          // Find the content div with pt-* class (the inner max-w-7xl div)
          const contentDiv = container.querySelector('[data-section-content] > div');
          expect(contentDiv).not.toBeNull();

          // Expected behavior: pt-28 for mobile (7rem = 112px clearance)
          expect(contentDiv!.className).toContain('pt-28');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 3: CoverSection heading size on mobile viewports
   * Expected: text-4xl base class for mobile (< 640px)
   * Current bug: text-6xl only, no smaller mobile breakpoint
   *
   * Validates: Requirements 1.5
   */
  it('CoverSection h1 should have text-4xl base class for mobile viewports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeLessThan(640);

          const { container } = render(<CoverSection />);

          const h1 = container.querySelector('h1');
          expect(h1).not.toBeNull();

          // Expected behavior: text-4xl as base size for mobile
          expect(h1!.className).toContain('text-4xl');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 4: ProposalNavbar logo minimum height on mobile
   * Expected: h-14 base class and min-h-[48px] for legibility
   * Current bug: h-20 only, no minimum size constraint
   *
   * Validates: Requirements 1.8
   */
  it('ProposalNavbar logo should have h-14 and min-h-[48px] for mobile viewports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeLessThan(640);

          const { container } = render(<ProposalNavbar />);

          const logo = container.querySelector('img[alt="BCM Logo"]');
          expect(logo).not.toBeNull();

          // Expected behavior: h-14 base size for mobile
          expect(logo!.className).toContain('h-14');
          // Expected behavior: min-h-[48px] to prevent shrinking below readable size
          expect(logo!.className).toContain('min-h-[48px]');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 5: App main element bottom padding for StickyCTA clearance
   * Expected: pb-20 class on main element
   * Current bug: no bottom padding, StickyCTA hides content
   *
   * Validates: Requirements 1.7
   */
  it('App main element should have pb-20 class for StickyCTA clearance', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375),
        (viewportWidth: number) => {
          cleanup();
          expect(viewportWidth).toBeLessThan(640);

          const { container } = render(<App />);

          const main = container.querySelector('main#main-content');
          expect(main).not.toBeNull();

          // Expected behavior: pb-20 (5rem = 80px) to clear StickyCTA
          expect(main!.className).toContain('pb-20');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 6: ProposalNavbar overflow protection
   * Expected: overflow-x-hidden on navbar container
   * Current bug: no overflow protection, intermediate viewports can overflow
   *
   * Validates: Requirements 1.6
   */
  it('ProposalNavbar container should have overflow-x-hidden class', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 375, 768),
        (viewportWidth: number) => {
          expect(viewportWidth).toBeLessThan(1024);

          const { container } = render(<ProposalNavbar />);

          // The inner flex container div inside the header
          const navContainer = container.querySelector('header > div');
          expect(navContainer).not.toBeNull();

          // Expected behavior: overflow-x-hidden to prevent horizontal overflow
          expect(navContainer!.className).toContain('overflow-x-hidden');
        }
      ),
      { numRuns: 10 }
    );
  });
});
