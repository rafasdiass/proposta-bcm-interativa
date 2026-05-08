# ComparisonTable Component

## Overview

The `ComparisonTable` component displays a two-column comparison showing the gains of entering now versus the risks of waiting. It features optional sequential animation for item reveals and respects the user's `prefers-reduced-motion` preference.

## Requirements

- **8.1**: Display a two-column comparison layout with balanced visual presentation
- **8.2**: List five gains in the "enter now" column
- **8.3**: List five risks in the "wait" column
- **8.4**: Implement optional sequential animation for item reveals
- **8.5**: Respect `prefers-reduced-motion` preference

## Features

- ✅ Two-column responsive layout
- ✅ Sequential animation with configurable delay
- ✅ Reduced motion support
- ✅ Keyboard accessible
- ✅ Screen reader optimized
- ✅ Customizable data and styling
- ✅ Visual indicators (CheckCircle for gains, XCircle for risks)
- ✅ Animation control button (optional)

## Usage

### Basic Usage

```tsx
import { ComparisonTable } from './components/interactive/ComparisonTable';

function MyComponent() {
  return <ComparisonTable />;
}
```

### With Custom Data

```tsx
import { ComparisonTable } from './components/interactive/ComparisonTable';

const customData = {
  enterNow: [
    { id: 'benefit-1', text: 'Custom benefit 1' },
    { id: 'benefit-2', text: 'Custom benefit 2' },
  ],
  wait: [
    { id: 'risk-1', text: 'Custom risk 1' },
    { id: 'risk-2', text: 'Custom risk 2' },
  ],
};

function MyComponent() {
  return <ComparisonTable data={customData} />;
}
```

### Without Animation Control

```tsx
<ComparisonTable showAnimationControl={false} />
```

### Custom Animation Delay

```tsx
<ComparisonTable animationDelay={500} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ComparisonData` | `defaultComparisonData` | Comparison data with enterNow and wait arrays |
| `className` | `string` | `''` | Additional CSS classes |
| `showAnimationControl` | `boolean` | `true` | Whether to show the animation control button |
| `animationDelay` | `number` | `200` | Delay between item reveals in milliseconds |

## Types

```typescript
interface ComparisonItem {
  id: string;
  text: string;
}

interface ComparisonData {
  enterNow: ComparisonItem[];
  wait: ComparisonItem[];
}
```

## Default Data

The component comes with default data representing the BCM proposal comparison:

**Enter Now (Gains):**
1. Primeiro parceiro clínico: molda o produto desde o início
2. Poder de moldar o produto conforme necessidades do Gradual
3. Catálogo fundador: OERA como protocolo prioritário
4. Coautoria em publicações científicas conjuntas
5. Narrativa científica construída em parceria

**Wait (Risks):**
1. Outro parceiro clínico ocupa a posição de fundador
2. Outro catálogo de protocolos se torna fundador
3. Entrada apenas como cliente, sem poder de moldar
4. Janela de oportunidade de parceria estratégica fecha
5. Poder de moldar o produto diminui significativamente

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate to animation control button
- **Enter/Space**: Trigger animation

### Screen Reader Support
- Semantic HTML structure with proper lists
- Live region announcements for animation state
- Descriptive button labels
- Icons marked as decorative with `aria-hidden`

### Reduced Motion
When `prefers-reduced-motion: reduce` is detected:
- All items are shown immediately without animation
- Animation control button is disabled
- No sequential reveals occur

## Styling

The component uses Tailwind CSS with the BCM color palette:

- **Enter Now column**: Green gradient (`#2D9B8A` to `#1B3A6B`)
- **Wait column**: Amber gradient (`#F5A623` to `#1B3A6B`)
- **Icons**: CheckCircle (green) for gains, XCircle (amber) for risks
- **Responsive**: Single column on mobile, two columns on tablet and desktop

## Animation Behavior

1. **Initial State**: Items are hidden with `opacity-0` and translated
2. **Animation Trigger**: User clicks "Animar comparação" button
3. **Sequential Reveal**: Items from both columns are revealed in an interleaved pattern
4. **Completion**: Button text changes to "Animar novamente"
5. **Re-animation**: User can trigger animation again

### Animation Sequence

Items are revealed in an interleaved pattern:
1. Enter Now item 1
2. Wait item 1
3. Enter Now item 2
4. Wait item 2
5. ... and so on

This creates a balanced visual flow between both columns.

## Examples

### In a Section Component

```tsx
import { Section } from '../sections/Section';
import { ComparisonTable } from '../interactive/ComparisonTable';

function DecisionFrameworkSection() {
  return (
    <Section
      id="decision-framework"
      title="Quadro de Decisão"
      variant="light"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Entrar agora vs Esperar
        </h2>
        <ComparisonTable />
      </div>
    </Section>
  );
}
```

### With Custom Styling

```tsx
<ComparisonTable 
  className="max-w-5xl mx-auto my-12"
  animationDelay={300}
/>
```

## Testing

The component includes comprehensive unit tests covering:

- Rendering of both columns and all items
- Animation behavior and timing
- Reduced motion support
- Accessibility features
- Edge cases (empty data, unequal columns)
- Re-animation capability

Run tests with:

```bash
npm run test ComparisonTable.test.tsx
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance

- Lightweight component with minimal re-renders
- CSS transitions for smooth animations
- No external animation libraries required
- Respects system performance preferences

## Related Components

- `Section`: Container component for content sections
- `useReducedMotion`: Hook for detecting motion preferences
- `ModuleCards`: Similar expandable card pattern
- `ObjectionAccordion`: Another interactive comparison component
