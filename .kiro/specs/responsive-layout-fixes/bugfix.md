# Bugfix Requirements Document

## Introduction

The React proposal/presentation app (React 19 + Bootstrap 5 + Vite with custom Tailwind-like CSS utilities) has multiple responsive layout issues that cause content overlap and horizontal overflow on mobile viewports. The fixed navbar height is not properly accounted for in the main content padding, and several CSS grid/sizing utilities force minimum widths that exceed small screen dimensions (320px). These bugs degrade the mobile user experience, making content unreadable or inaccessible.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the viewport width is less than 1024px (mobile/tablet) THEN the fixed navbar (logo `h-20` + `py-3` = ~104px total height) overlaps the main content because the Section component's inner content uses `pt-24` (96px) which is insufficient to clear the navbar

1.2 WHEN the viewport width is less than 1024px THEN the `scroll-mt-24` (96px) scroll margin on sections does not account for the full navbar height, causing scrolled-to sections to be partially hidden behind the navbar

1.3 WHEN the viewport width is 320px or less THEN grid containers using `grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` force a minimum column width of 250px plus container padding, causing horizontal overflow beyond the viewport

1.4 WHEN the viewport width is 320px or less THEN grid containers using `grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` force a minimum column width of 280px plus container padding, causing horizontal overflow beyond the viewport

1.5 WHEN the viewport width is less than 640px THEN the CoverSection heading `text-6xl` (3.75rem = 60px) renders at a fixed large size without a smaller mobile breakpoint, potentially overflowing narrow viewports

1.6 WHEN the viewport width is less than 1024px THEN the desktop navigation buttons with `min-w-[100px]` are hidden (via `lg:flex`), but the mobile `<select>` dropdown plus the logo (`h-20`) and action buttons (`hidden sm:flex`) can collectively overflow the navbar container on intermediate viewport widths (640px–1024px)

1.7 WHEN the viewport width is less than 640px THEN the main content area has no bottom padding to account for the fixed StickyCTA bar (approximately 60–80px tall), causing the last content items to be hidden behind the sticky footer

1.8 WHEN the viewport width is less than 640px THEN the navbar logo (`h-20` = 80px on mobile) shrinks excessively on very small viewports due to flex container constraints, becoming nearly invisible and unreadable to users

### Expected Behavior (Correct)

2.1 WHEN the viewport width is less than 1024px THEN the Section component's content area SHALL have sufficient top padding (at minimum 7rem/112px on mobile) to fully clear the fixed navbar without any overlap

2.2 WHEN the viewport width is less than 1024px THEN the `scroll-mt` value on sections SHALL match or exceed the actual navbar height so that navigated-to sections are fully visible below the navbar

2.3 WHEN the viewport width is 320px or less THEN grid containers SHALL use a responsive minimum column width (e.g., `minmax(min(250px, 100%), 1fr)`) that falls back to full width on narrow viewports, preventing horizontal overflow

2.4 WHEN the viewport width is 320px or less THEN grid containers with 280px minimum SHALL use a responsive minimum column width (e.g., `minmax(min(280px, 100%), 1fr)`) that falls back to full width on narrow viewports, preventing horizontal overflow

2.5 WHEN the viewport width is less than 640px THEN the CoverSection heading SHALL render at a smaller responsive size (e.g., `text-4xl` or `text-5xl`) to prevent text overflow on narrow screens

2.6 WHEN the viewport width is between 640px and 1024px THEN the navbar layout SHALL accommodate the logo, mobile select dropdown, and action buttons without horizontal overflow, using appropriate sizing constraints

2.7 WHEN the viewport width is less than 640px THEN the main content area SHALL have sufficient bottom padding (at minimum 5rem/80px) to account for the fixed StickyCTA bar, ensuring all content is accessible by scrolling

2.8 WHEN the viewport width is less than 640px THEN the navbar logo SHALL maintain a minimum visible height (at least `h-12` / 48px) with appropriate `min-h` and `min-w` constraints so it remains legible on all supported viewports (320px+)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the viewport width is 1024px or greater THEN the desktop navigation layout SHALL CONTINUE TO display all nav buttons in a horizontal row with proper spacing and the `min-w-[100px]` constraint

3.2 WHEN the viewport width is 1024px or greater THEN the Section component's `pt-24` / `md:pt-32` padding and `scroll-mt-24` / `md:scroll-mt-32` scroll margins SHALL CONTINUE TO work correctly for the desktop navbar height

3.3 WHEN the viewport width is greater than 320px and grid items fit within the viewport THEN the auto-fit grid layouts SHALL CONTINUE TO display multiple columns as designed

3.4 WHEN the viewport width is 640px or greater THEN the CoverSection heading SHALL CONTINUE TO display at `text-6xl` (or `md:text-8xl` on medium+) as currently designed

3.5 WHEN the viewport width is 640px or greater THEN the StickyCTA desktop layout SHALL CONTINUE TO display the full action buttons in a centered row

3.6 WHEN the user navigates between sections THEN the scroll behavior and animation transitions SHALL CONTINUE TO function identically to the current implementation

3.7 WHEN the viewport width is 1024px or greater THEN the fixed navbar's visual appearance (backdrop blur, border, shadow, logo size `md:h-28`) SHALL CONTINUE TO render as currently designed

3.8 WHEN the viewport width is 768px or greater THEN the navbar logo SHALL CONTINUE TO display at its current `md:h-28` size without any new constraints affecting its desktop appearance
