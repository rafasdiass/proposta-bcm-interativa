# Responsive Layout Fixes Bugfix Design

## Overview

The proposal app has 8 responsive layout defects that cause content overlap, horizontal overflow, and hidden content on mobile viewports (320px–1024px). The fixed navbar height (~104px on mobile) is not properly accounted for in section padding/scroll-margins, CSS grid `minmax()` values force minimum widths that exceed narrow screens, the CoverSection heading is too large on mobile, the navbar logo lacks minimum size constraints, and the main content has no bottom padding to clear the fixed StickyCTA bar.

The fix strategy is purely CSS/className-based: adjust responsive utility values in `src/index.css`, update className strings in 5 components, and add a CSS variable for navbar height to centralize the offset calculation.

## Glossary

- **Bug_Condition (C)**: The viewport width falls below a threshold (1024px, 640px, or 320px) causing layout overflow, overlap, or hidden content
- **Property (P)**: All content is fully visible, scrollable, and accessible without overlap or horizontal overflow at any supported viewport width (320px+)
- **Preservation**: Desktop layout (≥1024px) and tablet layout (≥768px where applicable) must remain visually identical to the current implementation
- **ProposalNavbar**: The fixed header component in `src/components/navigation/ProposalNavbar.tsx` with logo, nav buttons, and action links
- **Section**: The reusable section wrapper in `src/components/sections/Section.tsx` that applies `pt-24`/`md:pt-32` content padding and `scroll-mt-24`/`md:scroll-mt-32`
- **StickyCTA**: The fixed-bottom CTA bar in `src/components/interactive/StickyCTA.tsx` (~56px mobile / ~72px desktop)
- **CoverSection**: The hero/landing section in `src/components/sections/CoverSection.tsx` with large headings
- **Navbar Height**: Logo `h-20` (80px) + `py-3` (24px) = ~104px on mobile; logo `md:h-28` (112px) + `py-3` (24px) = ~136px on md+

## Bug Details

### Bug Condition

The bug manifests when the viewport width is below specific breakpoints (1024px, 640px, or 320px), causing the fixed navbar to overlap content, grid items to overflow horizontally, headings to be too large, and the StickyCTA to hide bottom content.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { viewportWidth: number, element: string }
  OUTPUT: boolean
  
  RETURN (
    (input.viewportWidth < 1024 AND input.element IN ['section-padding', 'scroll-margin', 'navbar-layout'])
    OR (input.viewportWidth <= 320 AND input.element IN ['grid-250', 'grid-280'])
    OR (input.viewportWidth < 640 AND input.element IN ['cover-heading', 'sticky-cta-padding', 'navbar-logo'])
  )
END FUNCTION
```

### Examples

- **Defect 1.1**: On a 375px iPhone, the first section's content starts at `pt-24` (96px) but the navbar is ~104px tall → top 8px of content is hidden behind the navbar
- **Defect 1.3**: On a 320px viewport with `px-4` (16px each side), a grid with `minmax(250px, 1fr)` requires 250px + 32px = 282px minimum, but only 320px is available → single column works, but the 250px minimum prevents proper shrinking when container padding is considered in nested layouts
- **Defect 1.5**: On a 320px viewport, `text-6xl` (60px font-size) renders "BCM" at 60px which fits, but the subtitle "Proposta de Parceria Estratégica" at `text-3xl` (30px) with no smaller mobile breakpoint can overflow
- **Defect 1.7**: On mobile, scrolling to the last section's bottom content is impossible because the StickyCTA bar (~56px) covers it with no compensating bottom padding on `<main>`
- **Defect 1.8**: On a 320px viewport, the logo `h-20` (80px) inside a flex container with `gap-4` and the select dropdown can cause the logo to shrink below readable size

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Desktop navigation (≥1024px) displays all nav buttons in a horizontal row with `min-w-[100px]`
- Desktop Section padding `md:pt-32` (128px) and `md:scroll-mt-32` (128px) remain correct for the larger navbar
- Grid layouts display multiple columns when viewport width accommodates them (>320px with sufficient space)
- CoverSection heading displays at `text-6xl` / `md:text-8xl` on medium+ viewports
- StickyCTA desktop layout shows full action buttons in a centered row
- Scroll behavior and animation transitions function identically
- Navbar visual appearance (backdrop blur, border, shadow, logo `md:h-28`) unchanged on desktop
- Navbar logo displays at `md:h-28` on medium+ without new constraints

**Scope:**
All viewports ≥1024px should be completely unaffected by this fix. Changes only target:
- Viewports < 1024px (navbar padding/scroll-margin)
- Viewports ≤ 320px (grid overflow)
- Viewports < 640px (heading size, StickyCTA padding, logo minimum size)

## Hypothesized Root Cause

Based on the bug analysis, the root causes are:

1. **Insufficient Mobile Padding Offset**: The Section component uses `pt-24` (96px) on mobile, but the navbar is ~104px tall (logo `h-20` 80px + `py-3` 24px). The 8px gap causes overlap. Similarly, `scroll-mt-24` (96px) is too small.

2. **Rigid Grid Minimums**: The CSS utilities `.grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` and the 280px variant use a fixed pixel minimum that doesn't respect container width on very narrow viewports. The CSS `min()` function should be used: `minmax(min(250px, 100%), 1fr)`.

3. **Missing Mobile Heading Breakpoint**: CoverSection's `<h1>` uses `text-6xl md:text-8xl` but has no smaller breakpoint for `< 640px`. The `<h2>` uses `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` which is better but the `<h1>` needs a mobile-first smaller size.

4. **No Bottom Padding for StickyCTA**: The `<main>` element in `App.tsx` has no `pb-*` class to account for the fixed StickyCTA bar height (~56px on mobile). Content at the bottom of sections is hidden.

5. **No Logo Minimum Size**: The navbar logo uses `h-20 md:h-28` but has no `min-h` or `min-w` constraint, so flex shrinking can make it unreadably small on narrow viewports with many sibling elements.

6. **Navbar Intermediate Overflow**: Between 640px–1024px, the logo (`h-20`), select dropdown, and `sm:flex` action buttons can collectively exceed the container width without proper `overflow-hidden` or size constraints.

## Correctness Properties

Property 1: Bug Condition - Content Visibility on Mobile Viewports

_For any_ viewport width between 320px and 1024px, the fixed navbar SHALL NOT overlap any section content, grid containers SHALL NOT cause horizontal overflow, headings SHALL fit within the viewport width, the StickyCTA SHALL NOT hide bottom content, and the navbar logo SHALL remain legible (≥48px height).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

Property 2: Preservation - Desktop Layout Unchanged

_For any_ viewport width ≥1024px, the fixed layout SHALL produce exactly the same visual result as the original code, preserving desktop navigation, Section padding, grid columns, heading sizes, StickyCTA layout, and navbar appearance.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/index.css`

**Specific Changes**:
1. **Add CSS custom property for navbar height**:
   ```css
   :root {
     --navbar-height-mobile: 7rem;   /* 112px - accounts for h-20 logo + py-3 */
     --navbar-height-desktop: 8.5rem; /* 136px - accounts for md:h-28 logo + py-3 */
   }
   ```

2. **Fix grid utilities with `min()` function**:
   ```css
   .grid-cols-\[repeat\(auto-fit\,minmax\(250px\,1fr\)\)\] {
     grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
   }
   .grid-cols-\[repeat\(auto-fit\,minmax\(280px\,1fr\)\)\] {
     grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
   }
   ```

3. **Add mobile-specific scroll-margin and padding utilities**:
   ```css
   .scroll-mt-28 { scroll-margin-top: 7rem; }
   .pt-28 { padding-top: 7rem; }
   ```

4. **Add bottom padding utility for StickyCTA clearance**:
   ```css
   .pb-20 { padding-bottom: 5rem; }
   ```

5. **Add `h-14` responsive variant and min-height utilities**:
   ```css
   .min-h-\[48px\] { min-height: 48px; }
   .min-w-\[48px\] { min-width: 48px; }
   ```

6. **Add `overflow-x-hidden` utility**:
   ```css
   .overflow-x-hidden { overflow-x: hidden; }
   ```

---

**File**: `src/components/sections/Section.tsx`

**Function**: Section component className and SectionContainer className

**Specific Changes**:
1. **Increase mobile scroll-margin**: Change `scroll-mt-24 md:scroll-mt-32` → `scroll-mt-28 md:scroll-mt-32`
2. **Increase mobile content padding**: Change `pt-24` → `pt-28` in the content div (keeping `md:pt-32`)

---

**File**: `src/components/navigation/ProposalNavbar.tsx`

**Function**: ProposalNavbar component

**Specific Changes**:
1. **Add minimum size to logo**: Change `h-20 md:h-28` → `h-14 sm:h-20 md:h-28 min-h-[48px] min-w-[48px]`
2. **Add overflow protection to navbar container**: Add `overflow-x-hidden` to the outer header or inner flex container
3. **Constrain logo on intermediate viewports**: The logo already uses `h-20 md:h-28`; adding `h-14` for base and `sm:h-20` for 640px+ ensures proper sizing across breakpoints

---

**File**: `src/components/sections/CoverSection.tsx`

**Function**: CoverSection component

**Specific Changes**:
1. **Add smaller mobile heading**: Change `text-6xl md:text-8xl` → `text-4xl sm:text-6xl md:text-8xl` for the `<h1>` "BCM" heading
2. **Ensure subtitle scales**: The `<h2>` already uses `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` which is correct

---

**File**: `src/App.tsx`

**Function**: App component layout

**Specific Changes**:
1. **Add bottom padding to main content**: Change `<main id="main-content" className="w-full min-h-screen">` → `<main id="main-content" className="w-full min-h-screen pb-20 sm:pb-24">` to clear the StickyCTA bar

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write visual regression tests and computed-style assertions that measure element positions and overflow at mobile viewport widths. Run these tests on the UNFIXED code to observe failures.

**Test Cases**:
1. **Navbar Overlap Test**: At 375px viewport, measure the section content top position vs navbar bottom position (will fail — content starts at 96px, navbar ends at ~104px)
2. **Grid Overflow Test**: At 320px viewport, measure `scrollWidth` vs `clientWidth` on grid containers with `minmax(250px, 1fr)` (will fail — scrollWidth > clientWidth)
3. **Heading Overflow Test**: At 320px viewport, measure the `<h1>` element width vs viewport width (may fail on unfixed code)
4. **StickyCTA Occlusion Test**: At 375px viewport, scroll to bottom and verify last content element's bottom edge is above StickyCTA top (will fail — no bottom padding)
5. **Logo Minimum Size Test**: At 320px viewport, measure logo rendered height (may fail — could shrink below 48px)

**Expected Counterexamples**:
- Section content top < navbar bottom (8px overlap)
- Grid container scrollWidth > clientWidth (horizontal overflow)
- Main content bottom edge hidden behind StickyCTA
- Possible causes: insufficient pt-24, rigid minmax(250px), missing pb for StickyCTA

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL viewport IN [320, 360, 375, 414, 640, 768, 1023] DO
  result := renderLayout_fixed(viewport)
  ASSERT sectionContentTop(result) >= navbarBottom(result)
  ASSERT scrollWidth(result.grids) <= clientWidth(result.grids)
  ASSERT headingWidth(result) <= viewportWidth
  ASSERT lastContentBottom(result) + stickyCTAHeight <= scrollableHeight(result)
  ASSERT logoHeight(result) >= 48
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL viewport IN [1024, 1280, 1440, 1920] DO
  ASSERT renderLayout_original(viewport) = renderLayout_fixed(viewport)
  -- Specifically:
  ASSERT navButtonsVisible(viewport) = true
  ASSERT sectionPadding(viewport) = '8rem'  -- md:pt-32 unchanged
  ASSERT scrollMargin(viewport) = '8rem'    -- md:scroll-mt-32 unchanged
  ASSERT gridColumns(viewport) > 1          -- multi-column preserved
  ASSERT headingSize(viewport) = '6rem'     -- text-8xl on md+
  ASSERT logoHeight(viewport) = '7rem'      -- md:h-28 unchanged
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many viewport widths above 1024px to verify no regressions
- It catches edge cases at breakpoint boundaries (1024px exactly)
- It provides strong guarantees that desktop behavior is unchanged

**Test Plan**: Observe computed styles on UNFIXED code at desktop viewports, then write property-based tests capturing those exact values to verify they remain after the fix.

**Test Cases**:
1. **Desktop Nav Preservation**: Verify nav buttons display in horizontal row at ≥1024px
2. **Desktop Padding Preservation**: Verify `md:pt-32` (128px) padding applies at ≥768px
3. **Desktop Grid Preservation**: Verify multi-column grid layouts at ≥640px
4. **Desktop Heading Preservation**: Verify `md:text-8xl` heading size at ≥768px
5. **Desktop Logo Preservation**: Verify `md:h-28` logo height at ≥768px

### Unit Tests

- Test that Section component renders with correct `scroll-mt-28` class on mobile
- Test that Section content div has `pt-28` class
- Test that ProposalNavbar logo has `min-h-[48px]` and responsive height classes
- Test that CoverSection `<h1>` has `text-4xl sm:text-6xl md:text-8xl` classes
- Test that App `<main>` has `pb-20 sm:pb-24` classes

### Property-Based Tests

- Generate random viewport widths in [320, 1023] and verify no horizontal overflow on any grid container
- Generate random viewport widths in [1024, 1920] and verify all desktop layout properties are preserved
- Generate random section content heights and verify StickyCTA never occludes content when scrolled to bottom

### Integration Tests

- Test full page render at 320px, 375px, 768px, 1024px, 1440px viewports
- Test scroll-to-section navigation at mobile viewports — section header fully visible below navbar
- Test that StickyCTA actions remain clickable and content above is fully scrollable on mobile
