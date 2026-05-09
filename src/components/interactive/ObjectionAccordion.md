# ObjectionAccordion Component

## Overview

The `ObjectionAccordion` component displays 6 common objections in a FAQ-style accordion format with single-item expansion behavior. It implements the WAI-ARIA Accordion pattern with full keyboard navigation support.

## Features

- **6 Objection Items**: Displays all common objections from the proposal
- **Single-Item Expansion**: Only one item can be expanded at a time
- **Full Keyboard Navigation**: Implements WAI-ARIA Accordion pattern
- **Accessibility First**: Proper ARIA attributes, semantic HTML, and focus management
- **Visual Variants**: Color-coded items (amber, teal, purple, blue)
- **Smooth Animations**: Expand/collapse transitions with proper reduced-motion support

## Requirements Coverage

- **11.1**: Displays 6 objection items
- **11.2**: Expands item when clicked, showing answer
- **11.3**: Single-item expansion behavior
- **11.4**: Full keyboard navigation (Enter/Space, ArrowUp/Down, Home/End)

## Usage

### Basic Usage

```tsx
import { ObjectionAccordion } from './components/interactive/ObjectionAccordion';

function MyComponent() {
  return <ObjectionAccordion />;
}
```

### With Initial Expanded Item

```tsx
<ObjectionAccordion initialExpanded="product-not-sell" />
```

### With Custom Styling

```tsx
<ObjectionAccordion className="my-custom-class" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `initialExpanded` | `string \| null` | `null` | ID of initially expanded item |

## Objection Items

The component displays these 6 objections:

1. **E se o produto não vender?** (product-not-sell)
   - Variant: amber
   - Answer: Tranche 2 only paid with 50 active paying users

2. **E se a clínica não usar?** (clinic-not-use)
   - Variant: teal
   - Answer: Free access requires minimum 10 children in first 60 days

3. **E se virar só mais um software?** (just-another-software)
   - Variant: purple
   - Answer: Differential is clinical kernel + native OERA + telemetry

4. **E se a participação for pequena?** (small-participation)
   - Variant: blue
   - Answer: 5% now is founder position before revenue and scale

5. **E se houver conflito técnico?** (technical-conflict)
   - Variant: teal
   - Answer: Gradual has voting rights on clinical product decisions

6. **E se o retorno demorar?** (return-delay)
   - Variant: amber
   - Answer: Softhouse savings and permanent discount create direct return

## Keyboard Navigation

The component follows the WAI-ARIA Accordion pattern:

| Key | Action |
|-----|--------|
| `Enter` or `Space` | Toggle current item (expand/collapse) |
| `ArrowDown` | Move focus to next accordion header (wraps to first) |
| `ArrowUp` | Move focus to previous accordion header (wraps to last) |
| `Home` | Move focus to first accordion header |
| `End` | Move focus to last accordion header |

## Accessibility

### ARIA Attributes

- `role="region"` on container with `aria-label="Objeções respondidas"`
- `aria-expanded` on buttons (true/false based on state)
- `aria-controls` linking button to panel
- `aria-labelledby` linking panel to button
- `aria-hidden` on panels (true when collapsed)

### Semantic HTML

- Proper heading structure with `<h3>` for each question
- Button elements for interactive headers
- Region roles for expandable panels

### Focus Management

- Visible focus indicators on all interactive elements
- Focus moves with keyboard navigation
- No focus traps

### Screen Reader Support

- Proper announcement of expanded/collapsed state
- Clear relationship between headers and panels
- Descriptive labels for all interactive elements

## Styling

The component uses Bootstrap CSS with custom brand colors:

- **Teal**: `#2D9B8A` (growth)
- **Amber**: `#F5A623` (urgency)
- **Blue**: `#1B3A6B` (trust)
- **Purple**: `#8B7EC8` (accent)

Each objection has a colored left border and background tint matching its variant.

## Animation

- Smooth expand/collapse transitions (300ms)
- Chevron icon rotation
- Height and opacity transitions
- Respects `prefers-reduced-motion` user preference

## Testing

The component includes comprehensive unit tests covering:

- Rendering all 6 objection items
- Single-item expansion behavior
- Full keyboard navigation (all keys)
- ARIA attributes and accessibility
- Visual variants
- Edge cases (rapid clicking, etc.)

Run tests with:

```bash
npm test -- ObjectionAccordion.test.tsx
```

## Demo

A demo file is available at `ObjectionAccordion.demo.tsx` showing:

- Default state (all collapsed)
- Initial expanded state
- Keyboard navigation instructions
- Accessibility features
- Requirements coverage

## Implementation Notes

### Single-Item Expansion

The component maintains a single `expandedId` state variable. When a new item is clicked:
- If it's already expanded, it collapses (set to `null`)
- If it's collapsed, it expands and any other expanded item automatically collapses

### Focus Management

Button refs are stored in a Map to enable programmatic focus management during keyboard navigation. This ensures smooth focus transitions when using arrow keys.

### Performance

- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Efficient state updates with functional setState
- No unnecessary DOM queries

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Transitions
- ARIA attributes
- ES6+ JavaScript

## Related Components

- `ModuleCards` - Similar expandable card pattern
- `ProtocolSelector` - Another interactive selection component
- `ObjectionsSection` - Section component that uses this accordion
