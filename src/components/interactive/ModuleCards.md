# ModuleCards Component

## Overview

The `ModuleCards` component displays 12 expandable cards representing the BCM product modules. Each card can be expanded to reveal detailed information about the module, with full keyboard navigation and accessibility support.

## Features

- ✅ 12 expandable cards for product modules
- ✅ Click/tap to expand and collapse
- ✅ Keyboard navigation (Enter/Space keys)
- ✅ Proper ARIA attributes for accessibility
- ✅ Color-coded variants (teal, amber, blue, purple)
- ✅ Smooth animations and transitions
- ✅ Responsive grid layout
- ✅ Multiple cards can be expanded simultaneously

## Requirements

**Validates Requirements:**
- 9.1: Display 12 Module_Cards for all product modules
- 9.2: Expand card when user clicks/taps
- 9.3: Collapse card when user clicks/taps again
- 9.5: Keyboard navigation with Enter/Space and proper ARIA attributes

## Usage

### Basic Usage

```tsx
import { ModuleCards } from './components/interactive/ModuleCards';

function MyComponent() {
  return <ModuleCards />;
}
```

### With Initial Expanded Modules

```tsx
import { ModuleCards } from './components/interactive/ModuleCards';

function MyComponent() {
  return (
    <ModuleCards 
      initialExpanded={['psrf-bcm', 'kernel']} 
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes to apply |
| `initialExpanded` | `string[]` | `[]` | Array of module IDs to start expanded |

## Module Data

The component displays the following 12 modules:

1. **PSRF-BCM** (Teal) - Triagem de repertório funcional
2. **PSFA-BCM** (Teal) - Análise funcional
3. **EPS-PCA** (Teal) - Perfil sensorial
4. **Kernel** (Amber) - Motor clínico genérico
5. **PEI Digital** (Blue) - Plano educacional individualizado
6. **Minha Voz** (Blue) - CAA com PECS
7. **Rotinas** (Purple) - Economia de fichas e reforços
8. **32 Jogos** (Purple) - Biblioteca de jogos terapêuticos
9. **Visão 360** (Blue) - Dashboard completo
10. **Relatórios** (Teal) - Relatórios defensáveis
11. **Acesso Progressivo** (Purple) - Sistema de permissões
12. **Stack SaaS** (Amber) - Infraestrutura em nuvem

## Keyboard Navigation

- **Tab**: Navigate between cards
- **Enter**: Toggle card expansion
- **Space**: Toggle card expansion

## Accessibility

The component follows WCAG AA guidelines:

- Proper semantic HTML structure
- ARIA attributes (`aria-expanded`, `aria-controls`, `aria-hidden`)
- Keyboard accessible with visible focus indicators
- Screen reader friendly labels
- Color contrast compliant

## Styling

The component uses Tailwind CSS with custom brand colors:

- **Teal** (#2D9B8A): Growth-related modules
- **Amber** (#F5A623): Core/infrastructure modules
- **Blue** (#1B3A6B): Clinical/reporting modules
- **Purple** (#8B7EC8): User experience modules

## Testing

The component includes comprehensive unit tests covering:

- Rendering all 12 modules
- Expansion/collapse behavior
- Keyboard navigation
- Accessibility attributes
- Edge cases and rapid toggling

Run tests with:

```bash
npm test -- ModuleCards.test.tsx
```

## Implementation Notes

### State Management

The component uses React's `useState` hook with a `Set` to track expanded modules, allowing multiple cards to be expanded simultaneously.

### Toggle Idempotence

The toggle behavior is idempotent - clicking twice returns the card to its original state. This is validated by property-based tests (see task 6.2).

### Performance

- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Smooth CSS transitions for expand/collapse animations
- Responsive grid layout adapts to different screen sizes

## Related Components

- **ProductModulesSection**: Uses ModuleCards to display the product modules section
- **TrancheTimeline**: Similar expandable pattern for tranche information

## Demo

A demo component is available at `ModuleCards.demo.tsx` showcasing different configurations and features.
