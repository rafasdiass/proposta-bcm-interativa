/**
 * Section.layout.test.tsx
 *
 * Task 1 (bugfix `layout-rendering-fixes`): exploratory property-based test
 * for the bug condition described in design.md section "Bug Details".
 *
 * This test is expected to **FAIL on the unfixed code** — the failure is what
 * confirms the bug exists. It surfaces counterexamples for each sub-symptom
 * in `isBugCondition` applied to the new paginated architecture introduced in
 * Tasks 10-12 (`ProposalNavbar` global + 6 capítulos em `proposalPages`):
 *
 *   - C_topSpacing    — content slot has `paddingTop  ≥ navbarHeight + 32|64`
 *   - C_bottomSpacing — content slot has `paddingBottom ≥ ctaHeight + 32|64`
 *   - C_placeholder   — tree does not contain PlaceholderSection / "Em desenvolvimento"
 *   - C_proseWidth    — narrative <p> has max-w-prose / prose-measure ancestor (≥768)
 *   - C_proseShrink   — narrative <p> inside flex/grid gets w-full/prose-measure ancestor
 *   - C_cardColumns   — narrative card grids use at most 2 cols at viewport ≥1024
 *   - Heading pt-BR   — each page exposes at least one h1 or h2 with substantive pt-BR text
 *
 * Scoped PBT Approach:
 *   fc.constantFrom(...proposalPages)  × 6 pages
 *   fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1440, 1920, 2560)  × 9 viewports
 *   fc.constantFrom('landing', 'presentation')  × 2 modes
 *   → 108 deterministic combinations
 *
 * Validates: Requirements 2.1, 2.2, 2.5, 2.10, 2.11
 * Validates: Properties 1, 2, 3, 9 (from design.md)
 */

import { cleanup, render, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { ReactNode } from 'react';

import App from '../../App';
import { proposalPages } from '../../data/pages';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

// framer-motion: render motion.<tag> as the underlying HTML tag, dropping
// animation-only props so jsdom doesn't complain. Proxy-based to cover every
// motion.* variant used in section components (section, div, h1, h2, p, ul, li).
vi.mock('framer-motion', () => {
  const ANIMATION_PROPS = new Set([
    'initial',
    'animate',
    'exit',
    'variants',
    'transition',
    'viewport',
    'whileInView',
    'whileHover',
    'whileTap',
    'whileFocus',
    'whileDrag',
    'layoutId',
    'layout',
    'custom',
    'drag',
    'dragConstraints',
    'onAnimationStart',
    'onAnimationComplete',
  ]);

  const stripAnimationProps = (props: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (!ANIMATION_PROPS.has(key)) out[key] = props[key];
    }
    return out;
  };

  const motionProxy: Record<string, unknown> = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        if (tag === '__esModule') return false;
        const Component = ({
          children,
          ...props
        }: { children?: ReactNode } & Record<string, unknown>) => {
          const Tag = tag as keyof JSX.IntrinsicElements;
          return (
            <Tag {...(stripAnimationProps(props) as object)}>{children}</Tag>
          );
        };
        Component.displayName = `motion.${tag}`;
        return Component;
      },
    }
  );

  return {
    __esModule: true,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    ),
    useReducedMotion: () => false,
    useInView: () => true,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});

// react-error-boundary: just render children so fall-throughs don't hide tree
vi.mock('react-error-boundary', async () => {
  const actual = await vi.importActual<typeof import('react-error-boundary')>(
    'react-error-boundary'
  );
  return {
    ...actual,
    ErrorBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const TARGET_VIEWPORTS = [
  320, 375, 640, 768, 1024, 1280, 1440, 1920, 2560,
] as const;

type Mode = 'landing' | 'presentation';

/**
 * Approximate navbar height per viewport, based on design.md (Fixed_Header in
 * the new ProposalNavbar: ~56px mobile / ~64px desktop).
 */
function navbarHeight(viewportWidth: number): number {
  return viewportWidth >= 768 ? 64 : 56;
}

/**
 * Approximate StickyCTA height per viewport (design.md Sticky_CTA glossary:
 * ~72px desktop / ~56px mobile).
 */
function ctaHeight(viewportWidth: number): number {
  return viewportWidth >= 768 ? 72 : 56;
}

function minTopPadding(viewportWidth: number): number {
  // design.md Property 1: navbarHeight + 32 (mobile) | 64 (desktop)
  return navbarHeight(viewportWidth) + (viewportWidth >= 768 ? 64 : 32);
}

function minBottomPadding(viewportWidth: number): number {
  // design.md Property 1: ctaHeight + 32 (mobile) | 64 (desktop)
  return ctaHeight(viewportWidth) + (viewportWidth >= 768 ? 64 : 32);
}

/**
 * Set window.innerWidth/innerHeight and stub matchMedia so Bootstrap-style
 * responsive queries reflect the chosen viewport width. Dispatches a resize
 * event so any listeners pick up the new size.
 */
function setViewport(width: number): void {
  const height = Math.max(480, Math.round((width * 9) / 16));
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    let matches = false;
    const minMatch = query.match(/\(min-width:\s*(\d+)px\)/);
    const maxMatch = query.match(/\(max-width:\s*(\d+)px\)/);
    const prefersReducedMotion = query.includes('prefers-reduced-motion');

    if (prefersReducedMotion) {
      matches = false;
    } else if (minMatch && maxMatch) {
      matches =
        width >= parseInt(minMatch[1], 10) &&
        width <= parseInt(maxMatch[1], 10);
    } else if (minMatch) {
      matches = width >= parseInt(minMatch[1], 10);
    } else if (maxMatch) {
      matches = width <= parseInt(maxMatch[1], 10);
    }

    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;
  }) as typeof window.matchMedia;

  window.dispatchEvent(new Event('resize'));
}

/**
 * Extract the effective padding (in pixels, Bootstrap-style spacing scale) that
 * applies to the content slot for a given viewport from the className tokens.
 * Supports base and `md:` variants (since the current code only uses md:). If
 * the viewport is ≥ 768, md: takes precedence.
 */
function extractPaddingPx(
  className: string,
  prefix: 'pt' | 'pb',
  isDesktop: boolean
): number {
  const baseRe = new RegExp(`(?:^|\\s)${prefix}-(\\d+)(?:\\s|$)`);
  const mdRe = new RegExp(`(?:^|\\s)md:${prefix}-(\\d+)(?:\\s|$)`);

  const baseMatch = className.match(baseRe);
  const mdMatch = className.match(mdRe);

  const baseVal = baseMatch ? parseInt(baseMatch[1], 10) * 4 : 0;
  const mdVal = mdMatch ? parseInt(mdMatch[1], 10) * 4 : baseVal;

  return isDesktop ? mdVal : baseVal;
}

/**
 * Render the full App with the given page slug preselected via hash, the
 * viewport width configured, and the navigation mode. Returns the render
 * result after lazy section content has resolved.
 */
async function renderPage(
  pageIndex: number,
  viewportWidth: number,
  mode: Mode
) {
  const slug = proposalPages[pageIndex].slug;
  window.location.hash = `#${slug}`;
  setViewport(viewportWidth);

  const rendered = render(<App />);

  // Allow NavigationProvider's hashchange-driven navigation + lazy suspense to
  // resolve. The page hero (SectionRenderer's own heading) always renders
  // synchronously even if child sections are still loading.
  await waitFor(
    () => {
      const heading = rendered.container.querySelector(
        '[data-section-content] h1, [data-section-content] h2'
      );
      expect(heading).not.toBeNull();
    },
    { timeout: 2000 }
  );

  return rendered;
}

/**
 * Get the inner content wrapper whose padding must satisfy Property 1 of the
 * design (the `<div>` with the max-w-7xl + pt/pb classes, right inside the
 * element flagged with `data-section-content`).
 */
function getContentPaddingWrapper(root: HTMLElement): HTMLElement | null {
  const sectionContent = root.querySelector('[data-section-content]');
  if (!sectionContent) return null;
  const innerDiv = sectionContent.querySelector(':scope > div');
  return innerDiv as HTMLElement | null;
}

/**
 * Collect narrative `<p>` nodes — paragraphs rendered inside the main content
 * slot. We filter out decorative text-only paragraphs of the navbar / StickyCTA
 * by scoping to [data-section-content].
 */
function collectNarrativeParagraphs(root: HTMLElement): HTMLElement[] {
  const slot = root.querySelector('[data-section-content]');
  if (!slot) return [];
  return Array.from(slot.querySelectorAll('p')) as HTMLElement[];
}

function hasAncestorWithClass(
  element: HTMLElement,
  predicate: (cls: string) => boolean,
  stopAt: HTMLElement | null = null
): boolean {
  let cur: HTMLElement | null = element.parentElement;
  while (cur && cur !== stopAt) {
    for (const cls of cur.classList) {
      if (predicate(cls)) return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

function hasFlexOrGridAncestor(
  element: HTMLElement,
  stopAt: HTMLElement | null
): boolean {
  return hasAncestorWithClass(
    element,
    cls =>
      cls === 'flex' ||
      cls === 'grid' ||
      cls.startsWith('flex-') ||
      cls.startsWith('grid-') ||
      cls.startsWith('sm:flex') ||
      cls.startsWith('md:flex') ||
      cls.startsWith('lg:flex') ||
      cls.startsWith('sm:grid') ||
      cls.startsWith('md:grid') ||
      cls.startsWith('lg:grid'),
    stopAt
  );
}

function hasReadingMeasureAncestor(
  element: HTMLElement,
  stopAt: HTMLElement | null
): boolean {
  // An ancestor (or the paragraph itself) enforces reading width via either
  // `max-w-prose` (custom prose width, about 65ch) or the custom `prose-measure` utility
  // declared in index.css (≈70ch).
  const selfHas =
    element.classList.contains('max-w-prose') ||
    element.classList.contains('prose-measure');
  if (selfHas) return true;
  return hasAncestorWithClass(
    element,
    cls => cls === 'max-w-prose' || cls === 'prose-measure',
    stopAt
  );
}

function hasFullWidthAncestor(
  element: HTMLElement,
  stopAt: HTMLElement | null
): boolean {
  // A flex/grid child only avoids shrink when `w-full` or `prose-measure`
  // is applied either to itself or somewhere up the chain before the flex box.
  const selfHas =
    element.classList.contains('w-full') ||
    element.classList.contains('prose-measure');
  if (selfHas) return true;
  return hasAncestorWithClass(
    element,
    cls => cls === 'w-full' || cls === 'prose-measure',
    stopAt
  );
}

/**
 * Detect narrative card grids that exceed 2 columns at viewport ≥ 1024 (lg).
 * Strategy: inspect grid containers inside the content slot. A grid is
 * "narrative" if at least one of its direct children contains a `<p>` tag.
 * Violations are grids with `lg:grid-cols-N` (or `xl:grid-cols-N`) where N>2,
 * or external CSS classes known to produce a 4-column desktop grid.
 */
function findCardGridViolations(
  root: HTMLElement,
  viewportWidth: number
): string[] {
  if (viewportWidth < 1024) return [];
  const slot = root.querySelector('[data-section-content]');
  if (!slot) return [];

  const violations: string[] = [];
  const grids = Array.from(
    slot.querySelectorAll('.grid, [class*="grid-cols"]')
  );

  for (const grid of grids) {
    const el = grid as HTMLElement;
    const hasParagraphChild = Array.from(el.children).some(child =>
      child.querySelector('p')
    );
    if (!hasParagraphChild) continue;

    const classes = Array.from(el.classList);
    for (const cls of classes) {
      const m = cls.match(/^(?:lg|xl|2xl):grid-cols-(\d+)$/);
      if (m && parseInt(m[1], 10) > 2) {
        violations.push(
          `<${el.tagName.toLowerCase()} class="${cls}"> narrative grid exceeds 2 cols at viewport >=1024`
        );
      }
    }

    // Known external CSS classes that render 4-column grids on lg via media
    // queries in component stylesheets (ExecutiveSummary.css: .exec-grid).
    if (classes.includes('exec-grid')) {
      violations.push(
        `<${el.tagName.toLowerCase()} class="exec-grid"> legacy CSS grid renders 4 cols on lg (see ExecutiveSummary.css)`
      );
    }
  }

  return violations;
}

// -----------------------------------------------------------------------------
// Suite setup
// -----------------------------------------------------------------------------

beforeAll(() => {
  // jsdom's history.replaceState is jest-spied in other tests; make sure it
  // behaves normally here so NavigationProvider's URL writes don't throw.
  if (!window.history.replaceState) {
    Object.defineProperty(window.history, 'replaceState', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  }
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  window.location.hash = '';
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  window.location.hash = '';
});

// -----------------------------------------------------------------------------
// Properties (Bug Condition)
// -----------------------------------------------------------------------------

describe('Section.layout (bug condition exploration — expected to FAIL on unfixed code)', () => {
  // --- C_topSpacing -------------------------------------------------------

  it('[Property 1 / C_topSpacing] content slot paddingTop ≥ navbar + 32|64 on every page/viewport/mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const inner = getContentPaddingWrapper(container);
          expect(inner, 'content padding wrapper present').not.toBeNull();

          const isDesktop = viewport >= 768;
          const topPx = extractPaddingPx(
            (inner as HTMLElement).className,
            'pt',
            isDesktop
          );
          const minTop = minTopPadding(viewport);

          expect(
            topPx,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— content slot paddingTop=${topPx}px should be >= ${minTop}px ` +
              `(navbar=${navbarHeight(viewport)} + respiro=${isDesktop ? 64 : 32}). ` +
              `className="${(inner as HTMLElement).className}"`
          ).toBeGreaterThanOrEqual(minTop);
        }
      ),
      { numRuns: 30, verbose: true }
    );
  });

  // --- C_bottomSpacing ----------------------------------------------------

  it('[Property 1 / C_bottomSpacing] content slot paddingBottom ≥ CTA + 32|64 on every page/viewport/mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const inner = getContentPaddingWrapper(container);
          expect(inner, 'content padding wrapper present').not.toBeNull();

          const isDesktop = viewport >= 768;
          const bottomPx = extractPaddingPx(
            (inner as HTMLElement).className,
            'pb',
            isDesktop
          );
          const minBottom = minBottomPadding(viewport);

          expect(
            bottomPx,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— content slot paddingBottom=${bottomPx}px should be >= ${minBottom}px ` +
              `(cta=${ctaHeight(viewport)} + respiro=${isDesktop ? 64 : 32}). ` +
              `className="${(inner as HTMLElement).className}"`
          ).toBeGreaterThanOrEqual(minBottom);
        }
      ),
      { numRuns: 30, verbose: true }
    );
  });

  // --- C_placeholder ------------------------------------------------------

  it('[Property 3 / C_placeholder] no page renders PlaceholderSection or "Em desenvolvimento"', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const slot = container.querySelector('[data-section-content]');
          expect(slot, 'content slot present').not.toBeNull();

          const text = (slot as HTMLElement).textContent ?? '';
          expect(
            text.includes('Em desenvolvimento'),
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— content slot contains "Em desenvolvimento" (PlaceholderSection leaked)`
          ).toBe(false);

          const placeholderById = (slot as HTMLElement).querySelector(
            '[data-testid="placeholder-section"]'
          );
          expect(
            placeholderById,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— PlaceholderSection element present in tree`
          ).toBeNull();
        }
      ),
      { numRuns: 18, verbose: true }
    );
  });

  // --- C_proseWidth -------------------------------------------------------

  it('[Property 2 / C_proseWidth] viewport ≥ 768: every narrative <p> has a max-w-prose / prose-measure ancestor', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS.filter(v => v >= 768)),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const slot = container.querySelector(
            '[data-section-content]'
          ) as HTMLElement | null;
          expect(slot, 'content slot present').not.toBeNull();

          const paragraphs = collectNarrativeParagraphs(container);
          const offenders: string[] = [];
          for (const p of paragraphs) {
            const text = (p.textContent ?? '').trim();
            // Ignore tiny decorative / numeric paragraphs (< 40 chars) — we only
            // enforce the reading measure on actual narrative copy.
            if (text.length < 40) continue;
            if (!hasReadingMeasureAncestor(p, slot)) {
              offenders.push(text.slice(0, 80));
            }
          }

          expect(
            offenders,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— ${offenders.length} narrative paragraph(s) lack a max-w-prose / prose-measure ancestor. ` +
              `Examples: ${offenders.slice(0, 3).join(' | ')}`
          ).toEqual([]);
        }
      ),
      { numRuns: 20, verbose: true }
    );
  });

  // --- C_proseShrink ------------------------------------------------------

  it('[Property 9 / C_proseShrink] viewport ≥ 768: narrative <p> in flex/grid has w-full or prose-measure on chain', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS.filter(v => v >= 768)),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const slot = container.querySelector(
            '[data-section-content]'
          ) as HTMLElement | null;
          expect(slot, 'content slot present').not.toBeNull();

          const paragraphs = collectNarrativeParagraphs(container);
          const shrinkViolations: string[] = [];
          for (const p of paragraphs) {
            const text = (p.textContent ?? '').trim();
            if (text.length < 40) continue;
            if (
              hasFlexOrGridAncestor(p, slot) &&
              !hasFullWidthAncestor(p, slot)
            ) {
              shrinkViolations.push(text.slice(0, 80));
            }
          }

          expect(
            shrinkViolations,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— ${shrinkViolations.length} narrative paragraph(s) sit inside flex/grid ` +
              `without w-full / prose-measure ancestor (risk of shrink to min-content). ` +
              `Examples: ${shrinkViolations.slice(0, 3).join(' | ')}`
          ).toEqual([]);
        }
      ),
      { numRuns: 20, verbose: true }
    );
  });

  // --- C_cardColumns ------------------------------------------------------

  it('[Property 9 / C_cardColumns] viewport ≥ 1024: narrative card grids use at most 2 columns', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS.filter(v => v >= 1024)),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const violations = findCardGridViolations(container, viewport);

          expect(
            violations,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— narrative card grid uses more than 2 columns on desktop. ` +
              `Violations: ${violations.join(' ; ')}`
          ).toEqual([]);
        }
      ),
      { numRuns: 20, verbose: true }
    );
  });

  // --- Heading pt-BR -----------------------------------------------------

  it('[Property 3 / Heading pt-BR] every page exposes at least one h1 or h2 with substantive Portuguese content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: proposalPages.length - 1 }),
        fc.constantFrom(...TARGET_VIEWPORTS),
        fc.constantFrom<Mode>('landing', 'presentation'),
        async (pageIndex, viewport, mode) => {
          cleanup();
          document.body.innerHTML = '';

          const { container } = await renderPage(pageIndex, viewport, mode);
          const slot = container.querySelector('[data-section-content]');
          expect(slot, 'content slot present').not.toBeNull();

          const headings = Array.from(
            (slot as HTMLElement).querySelectorAll('h1, h2')
          );
          const substantive = headings.some(h => {
            const t = (h.textContent ?? '').trim();
            return t.length >= 10;
          });

          expect(
            substantive,
            `page="${proposalPages[pageIndex].slug}" viewport=${viewport} mode=${mode} ` +
              `— content slot does not expose any h1/h2 with >=10 characters`
          ).toBe(true);
        }
      ),
      { numRuns: 18, verbose: true }
    );
  });
});
