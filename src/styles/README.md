# Tailwind CSS Configuration - Interactive BCM Proposal

This document describes the Tailwind CSS configuration and custom theme setup for the Interactive BCM Proposal application.

## Overview

The project uses **Tailwind CSS v4** with a custom theme that implements the brand colors and design system specified in the requirements. The configuration is CSS-based (using `@theme` directive) rather than JavaScript-based.

## Brand Colors

The theme implements the exact brand colors specified in the requirements:

| Color                    | Hex Code  | CSS Variable         | Usage                                 |
| ------------------------ | --------- | -------------------- | ------------------------------------- |
| Primary (Blue Trust)     | `#1B3A6B` | `--color-primary`    | Primary brand color, buttons, links   |
| Secondary (Green Growth) | `#2D9B8A` | `--color-secondary`  | Secondary brand color, success states |
| Accent (Amber Urgency)   | `#F5A623` | `--color-accent`     | Accent color, warnings, CTAs          |
| Purple Accent            | `#8B7EC8` | `--color-purple`     | Additional accent color               |
| Light Base               | `#F8F9FA` | `--color-base-light` | Light background                      |
| Dark Base                | `#102642` | `--color-base-dark`  | Dark background                       |

## Semantic Color Mappings

Additional semantic variables for easier usage:

- `--color-trust`: Maps to primary color (#1B3A6B)
- `--color-growth`: Maps to secondary color (#2D9B8A)
- `--color-urgency`: Maps to accent color (#F5A623)

## Typography

### Font Families

- **Sans**: Inter, system-ui, -apple-system, sans-serif
- **Heading**: Inter, system-ui, -apple-system, sans-serif
- **Mono**: JetBrains Mono, Consolas, monospace

### Responsive Typography

The theme includes responsive typography that scales appropriately:

- **Mobile**: Base sizes (h1: 2.25rem, h2: 1.5rem, h3: 1.25rem)
- **Tablet (768px+)**: Medium sizes (h1: 3rem, h2: 2.25rem, h3: 1.5rem)
- **Desktop (1024px+)**: Large sizes (h1: 3.75rem, h2: 2.25rem)

## Responsive Breakpoints

| Breakpoint   | Value  | Usage                                   |
| ------------ | ------ | --------------------------------------- |
| xs           | 320px  | Extra small devices                     |
| sm           | 640px  | Small devices                           |
| md           | 768px  | Medium devices (tablets)                |
| lg           | 1024px | Large devices (desktops)                |
| xl           | 1280px | Extra large devices                     |
| 2xl          | 1536px | 2X large devices                        |
| presentation | 1024px | Custom breakpoint for presentation mode |

## Component Classes

### Buttons

- `.btn`: Base button styles
- `.btn-primary`: Primary button (blue background)
- `.btn-secondary`: Secondary button (green background)
- `.btn-accent`: Accent button (amber background)
- `.btn-outline`: Outline button (transparent with border)

### Cards

- `.card`: Base card with shadow and border
- `.card-interactive`: Interactive card with hover effects

### Sections

- `.section-light`: Light background section
- `.section-dark`: Dark background section
- `.section-teal`: Teal background section

### Layout

- `.container-content`: Content container (max-width: 1200px)
- `.container-prose`: Prose container (max-width: 65ch)
- `.aspect-presentation`: 16:9 aspect ratio for presentation mode

## Animation and Transitions

### Duration Variables

- `--duration-fast`: 200ms
- `--duration-normal`: 400ms
- `--duration-slow`: 600ms

### Animation Classes

- `.animate-fade-in`: Fade in animation
- `.animate-slide-up`: Slide up animation

### Reduced Motion Support

The theme respects `prefers-reduced-motion: reduce` and disables animations when this preference is set.

## Accessibility Features

### Focus Styles

All interactive elements have visible focus indicators using the primary color with 2px outline and 2px offset.

### High Contrast Support

The theme includes specific styles for `prefers-contrast: high` media query.

### Screen Reader Support

- `.sr-only`: Screen reader only content class

## Utility Classes

### Scrollbar Styling

- `.scrollbar-thin`: Thin scrollbar with custom colors

### Interactive Elements

- `.interactive-element`: Base class for interactive elements with hover/focus transforms

### Calculator Components

- `.calculator-input`: Styled input for calculator components
- `.calculator-output`: Styled output for calculator results

## Production Optimization

### Purging

Tailwind CSS v4 automatically purges unused styles in production builds. The configuration scans:

- `./index.html`
- `./src/**/*.{js,ts,jsx,tsx}`

### File Structure

```
src/styles/
├── theme.ts          # Theme configuration and constants
├── README.md         # This documentation
└── (imported in index.css)
```

## Usage Examples

### Using Brand Colors in Components

```tsx
// Using CSS variables directly
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Primary colored background
</div>

// Using component classes
<button className="btn btn-primary">
  Primary Button
</button>

// Using section variants
<section className="section-dark">
  Dark themed section
</section>
```

### Responsive Design

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>

// Responsive typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

### Interactive Elements

```tsx
// Interactive card
<div className="card-interactive p-6">
  <h3>Interactive Card</h3>
  <p>Hover for effects</p>
</div>

// Calculator input
<input
  type="number"
  className="calculator-input"
  placeholder="Enter value"
/>
```

## Integration with React Components

The theme is designed to work seamlessly with React components. Import the theme configuration:

```tsx
import { theme, sectionVariants } from '@/styles/theme';
import { getSectionClasses, prefersReducedMotion } from '@/utils/theme';
```

## Browser Support

The theme is compatible with:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- CSS custom properties are used for runtime theme switching capability
- Animations respect user preferences for reduced motion
- Purging removes unused styles in production
- Optimized for Core Web Vitals (CLS, LCP, FID)

## Future Enhancements

The theme is designed to be extensible for future features:

- Dark mode support (infrastructure already in place)
- Additional color variants
- More component classes
- Enhanced animation library
- Theme switching capabilities

## Troubleshooting

### Common Issues

1. **Colors not appearing**: Ensure CSS custom properties are properly defined in the `@theme` block
2. **Build errors**: Check that all class names are valid and properly spelled
3. **Animations not working**: Verify `prefers-reduced-motion` settings and animation class names

### Debugging

Use browser dev tools to inspect CSS custom properties:

```css
/* Check if variables are defined */
:root {
  /* Should show all --color-* variables */
}
```

For more information, refer to the [Tailwind CSS v4 documentation](https://tailwindcss.com/docs).
