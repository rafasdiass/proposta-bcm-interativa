# ProtocolSelector Component

## Overview

The `ProtocolSelector` component allows users to toggle between BCM default protocols (PSRF-BCM, PSFA-BCM, EPS-PCA) and Gradual preferred protocols (OERA, VB-MAPP, ABLLS-R, PEP-3, CARS-2, SRS-2, Vineland-3), with special highlighting for OERA as a priority protocol.

## Requirements

This component implements the following requirements:

- **10.1**: Offer two protocol groups (BCM defaults and Gradual preferred)
- **10.2**: Highlight selected group protocols with visual distinction
- **10.3**: Mark OERA protocol with priority visual indicator
- **10.4**: Support combination mode (both groups selected simultaneously)
- **10.5**: Display default state with appropriate messaging

## Features

### Group Selection
- Toggle between "Defaults BCM" and "Preferenciais Gradual"
- Select both groups simultaneously for combination mode
- Visual feedback with color changes and checkmarks
- Proper ARIA attributes (`aria-pressed`) for accessibility

### Visual Highlighting
- Selected group protocols are highlighted with teal borders (`#2D9B8A`)
- Unselected protocols appear dimmed with reduced opacity
- Smooth transitions between states
- Selection indicators on highlighted cards

### Priority Protocol
- OERA protocol displays a "Prioritário" badge when Gradual preferred is selected
- Badge features amber color (`#F5A623`) with star icon
- Ring highlight around priority protocol card

### Combination Mode
- Both groups can be selected simultaneously
- Special description message for combination mode
- Purple accent for combination mode description

### Default State
- BCM defaults selected by default
- Helpful message when no groups are selected
- Guidance text to orient users

## Props

```typescript
interface ProtocolSelectorProps {
  /** Additional CSS classes */
  className?: string;
  /** Initial selected groups */
  initialSelected?: Array<'bcm-defaults' | 'gradual-preferred'>;
}
```

### `className` (optional)
- Type: `string`
- Default: `''`
- Additional CSS classes to apply to the root element

### `initialSelected` (optional)
- Type: `Array<'bcm-defaults' | 'gradual-preferred'>`
- Default: `['bcm-defaults']`
- Initial selected protocol groups

## Usage Examples

### Basic Usage (Default State)
```tsx
import { ProtocolSelector } from './components/interactive/ProtocolSelector';

function MyComponent() {
  return <ProtocolSelector />;
}
```

### Gradual Preferred Pre-selected
```tsx
<ProtocolSelector initialSelected={['gradual-preferred']} />
```

### Combination Mode (Both Groups)
```tsx
<ProtocolSelector initialSelected={['bcm-defaults', 'gradual-preferred']} />
```

### No Initial Selection
```tsx
<ProtocolSelector initialSelected={[]} />
```

### With Custom Styling
```tsx
<ProtocolSelector className="my-custom-class" />
```

## Protocol Data

### BCM Defaults (3 protocols)
1. **PSRF-BCM** - Protocolo de Sondagem de Repertório Funcional
2. **PSFA-BCM** - Protocolo de Sondagem de Função Adaptativa
3. **EPS-PCA** - Escala de Perfil Sensorial - Protocolo de Condicionamento Adaptativo

### Gradual Preferred (7 protocols)
1. **OERA** ⭐ (Priority) - Observação e Entrevista de Repertório ABA
2. **VB-MAPP** - Verbal Behavior Milestones Assessment and Placement Program
3. **ABLLS-R** - Assessment of Basic Language and Learning Skills - Revised
4. **PEP-3** - Psychoeducational Profile - Third Edition
5. **CARS-2** - Childhood Autism Rating Scale - Second Edition
6. **SRS-2** - Social Responsiveness Scale - Second Edition
7. **Vineland-3** - Vineland Adaptive Behavior Scales - Third Edition

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate between group selection buttons
- **Enter/Space**: Toggle group selection
- Focus indicators visible on all interactive elements

### ARIA Attributes
- `aria-pressed`: Indicates button toggle state
- `aria-live="polite"`: Live region for description updates
- `aria-label`: Labels for selection indicators
- `aria-hidden`: Decorative icons hidden from screen readers

### Screen Reader Support
- Semantic button elements with proper roles
- Status region announces description changes
- Clear labels for all interactive elements

### Visual Accessibility
- WCAG AA contrast ratios maintained
- Focus indicators with sufficient contrast
- Color not used as sole indicator (icons and text accompany colors)

## Styling

### Color Palette
- **Primary Blue** (`#1B3A6B`): Selected buttons, protocol titles
- **Teal** (`#2D9B8A`): Highlighted protocol borders, selection indicators
- **Amber** (`#F5A623`): Priority badge
- **Purple** (`#8B7EC8`): Combination mode accent
- **Gray shades**: Unselected states, backgrounds

### Responsive Behavior
- Grid layout adapts to screen size:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Buttons wrap on smaller screens
- Touch-friendly targets (minimum 44px)

## State Management

The component uses React's `useState` hook to manage:
- Selected protocol groups (Set of group IDs)
- Toggle functionality with `useCallback` for performance

State updates trigger:
- Visual highlighting changes
- Description text updates
- Priority badge visibility

## Performance Considerations

- Memoized callbacks with `useCallback` to prevent unnecessary re-renders
- Efficient Set operations for group selection
- CSS transitions for smooth visual feedback
- No external API calls or heavy computations

## Testing

The component includes comprehensive unit tests covering:
- Rendering of all elements
- Group selection toggling
- Visual highlighting behavior
- Keyboard accessibility
- ARIA attributes
- Edge cases (rapid toggling, custom props)
- Protocol data validation

Run tests with:
```bash
npm test ProtocolSelector.test.tsx
```

## Integration

### In Proposal Sections
The ProtocolSelector is designed to be used in the "Gradual Protocols Section" of the interactive proposal:

```tsx
import { ProtocolSelector } from '@/components/interactive';

function GradualProtocolsSection() {
  return (
    <Section id="protocolos-gradual" variant="light">
      <h2>Protocolos Clínicos</h2>
      <p>O Kernel BCM aceita múltiplos protocolos clínicos...</p>
      <ProtocolSelector />
    </Section>
  );
}
```

### With Navigation Context
The component works independently but can be integrated with the navigation system for tracking user interactions.

## Browser Compatibility

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Dependencies

- React 18+
- lucide-react (CheckCircle2, Star icons)
- Tailwind CSS 3+

## Related Components

- **ModuleCards**: Similar expandable card pattern
- **Section**: Container for protocol selector in proposal
- **NavigationProvider**: Context for tracking section interactions

## Future Enhancements

Potential improvements for future iterations:
- Protocol detail modal on card click
- Search/filter functionality for protocols
- Animation for protocol card transitions
- Export selected protocols configuration
- Integration with form submission for protocol preferences
