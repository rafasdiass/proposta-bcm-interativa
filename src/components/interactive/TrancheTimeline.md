# TrancheTimeline Component

## Overview

The `TrancheTimeline` component displays an interactive timeline of investment tranches for the BCM proposal. It shows three tranches with their amounts, triggers, and deliverables in an accessible, visually appealing format.

## Features

### Core Functionality
- **Three Investment Tranches**: Displays T1 (R$30,000), T2 (R$25,000), and T3 (R$20,000)
- **Total Investment Display**: Shows the sum of all tranches (R$75,000)
- **Trigger Conditions**: Each tranche displays its activation trigger
- **Expandable Deliverables**: Click/tap to reveal associated deliverables

### Visual Design
- **Progress Indicator**: Color gradient from green (#2D9B8A) to amber (#F5A623)
- **Status Icons**: Visual indicators for pending, active, and completed states
- **Smooth Animations**: Transitions for expand/collapse interactions
- **Responsive Layout**: Adapts to different screen sizes

### Accessibility
- **Keyboard Navigation**: Full support for Tab, Enter, and Space keys
- **ARIA Attributes**: Proper `aria-expanded`, `aria-label`, and `role` attributes
- **Screen Reader Support**: Descriptive labels for all interactive elements
- **Focus Indicators**: Visual feedback for keyboard navigation

## Usage

```tsx
import { TrancheTimeline } from '@/components/interactive/TrancheTimeline';

function MyComponent() {
  return <TrancheTimeline />;
}
```

## Props

The component does not accept any props. All data is internally defined based on the BCM proposal requirements.

## Data Structure

### Tranche Interface
```typescript
interface Tranche {
  id: string;
  number: number;
  amount: number;
  trigger: string;
  deliverables: string[];
  status: 'pending' | 'active' | 'completed';
}
```

### Tranche Data

**Tranche 1 (R$30,000)**
- Trigger: Assinatura do contrato
- Status: Active
- Deliverables:
  - Viagem inicial para reunião presencial
  - Onboarding completo da equipe
  - Início da integração OERA
  - Setup do ambiente de desenvolvimento

**Tranche 2 (R$25,000)**
- Trigger: 50 usuários pagantes ativos
- Status: Pending
- Deliverables:
  - Módulo de gestão de pacientes completo
  - Sistema de agendamento implementado
  - Integração com plataformas de pagamento
  - Dashboard de métricas operacionais

**Tranche 3 (R$20,000)**
- Trigger: Publicação conjunta OU 100 usuários pagantes
- Status: Pending
- Deliverables:
  - Módulo de prontuário eletrônico
  - Sistema de relatórios avançados
  - Integração completa OERA
  - Documentação técnica finalizada

## Interactions

### Mouse/Touch
- Click or tap on any tranche card to expand/collapse
- Hover effects provide visual feedback

### Keyboard
- **Tab**: Navigate between tranches
- **Enter** or **Space**: Expand/collapse the focused tranche
- **Shift+Tab**: Navigate backwards

### Screen Readers
- Each tranche announces its number, amount, and trigger
- Expansion state is communicated via ARIA attributes
- Total investment is properly labeled

## Styling

The component uses Tailwind CSS classes for styling:
- Responsive grid layout
- Gradient backgrounds
- Smooth transitions
- Color-coded progress indicators

### Color Gradient
The progress indicator uses a linear interpolation between:
- **Green** (#2D9B8A / rgb(45, 155, 138)) - Early stage
- **Amber** (#F5A623 / rgb(245, 166, 35)) - Later stage

Progress percentages:
- T1: 0% (pure green)
- T2: 50% (green-amber blend)
- T3: 100% (pure amber)

## Testing

### Unit Tests
- Rendering of all tranches and amounts
- Click interactions for expand/collapse
- Keyboard navigation (Enter, Space, Tab)
- ARIA attributes and accessibility
- Total investment invariant

### Property-Based Tests
- Total investment equals sum of tranches
- Progress calculation proportionality
- Color gradient interpolation within RGB range
- Trigger uniqueness
- Deliverables non-empty
- Amount positivity
- Currency formatting consistency
- Status validity
- Sequential tranche ordering

## Requirements Validation

This component validates the following requirements from the BCM proposal spec:

- **6.1**: Display three tranches with amounts
- **6.2**: Show trigger conditions for each tranche
- **6.3**: Reveal deliverables on interaction
- **6.4**: Display total investment (R$75,000)
- **6.5**: Maintain invariant: total = T1 + T2 + T3
- **6.6**: Progress indicator with color gradient

## Files

- `TrancheTimeline.tsx` - Main component implementation
- `TrancheTimeline.test.tsx` - Unit tests
- `TrancheTimeline.property.test.ts` - Property-based tests
- `TrancheTimeline.demo.tsx` - Demo page
- `TrancheTimeline.md` - This documentation

## Dependencies

- React 19.2.5
- lucide-react (for icons)
- Tailwind CSS (for styling)

## Browser Support

The component works in all modern browsers that support:
- CSS Grid
- CSS Transitions
- ARIA attributes
- Keyboard events

## Performance

- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Minimal state management (only expanded tranche ID)
- Efficient color interpolation calculations
- No external API calls or heavy computations

## Future Enhancements

Potential improvements for future versions:
- Animation preferences (respect `prefers-reduced-motion`)
- Customizable tranche data via props
- Export functionality for tranche details
- Print-friendly styling
- Dark mode support
