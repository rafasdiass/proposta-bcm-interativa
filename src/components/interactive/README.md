# Interactive Components

This directory contains interactive calculator and tool components for the Interactive BCM Proposal application.

## Components

### ROISimulator

An interactive calculator that simulates the value of 5% equity in LaVita Code based on subscriber count, plan mix, and MRR multiple.

#### Features

- **Real-time Calculations**: Updates results in <100ms as inputs change
- **Pre-configured Scenarios**: Four quick-access scenarios for common business milestones
- **Input Validation**: Constrains inputs to valid ranges with visual feedback
- **Currency Formatting**: Displays all monetary values in BRL using `Intl.NumberFormat`
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigable with proper ARIA labels

#### Usage

```tsx
import { ROISimulator } from '@/components/interactive';

function InvestmentSection() {
  return (
    <div>
      <h1>Investment Opportunity</h1>
      <ROISimulator />
    </div>
  );
}
```

#### Props

The `ROISimulator` component accepts no props. All configuration is handled internally with sensible defaults.

#### Default Values

- **Subscribers**: 350 (breakeven point)
- **Plan Mix**: 60% Professional, 30% Clinic, 10% School
- **MRR Multiple**: 5x

#### Input Ranges

- **Subscribers**: 0 to 5,000 (increments of 10)
- **Plan Mix**: 0% to 100% per plan (must sum to 100%)
- **MRR Multiple**: 1 to 20

#### Plan Pricing

- **Professional**: R$ 297/month
- **Clinic**: R$ 997/month
- **School**: R$ 1,997/month

#### Pre-configured Scenarios

1. **Breakeven (350 subscribers)**: Initial profitability milestone
2. **1,000 subscribers**: Early growth stage
3. **Municipal contract + 500 subscribers**: Government partnership scenario
4. **National presence (2,000+ subscribers)**: Scale achievement

#### Calculations

The component calculates three key metrics:

1. **Monthly Revenue (MRR)**:
   ```
   MRR = (subscribers × plan_mix_professional × 297) +
         (subscribers × plan_mix_clinic × 997) +
         (subscribers × plan_mix_school × 1997)
   ```

2. **Estimated Valuation**:
   ```
   Valuation = MRR × MRR_Multiple
   ```

3. **5% Value**:
   ```
   5% Value = Valuation × 0.05
   ```

#### Requirements Validated

- **4.1**: Subscriber count input [0, 5000] in increments of 10
- **4.2**: Plan mix inputs with percentages summing to 100%
- **4.3**: MRR multiple input [1, 20] with default 5
- **4.4**: Real-time calculations <100ms
- **4.5**: Four pre-configured scenarios
- **4.6**: Scenario selection fills inputs
- **4.7**: Monotonic non-decreasing 5% value (property test)
- **4.8**: Revenue sum consistency (property test)
- **4.9**: Disclaimer text about projections
- **17.1**: Currency formatting in BRL

#### Testing

The component includes comprehensive test coverage:

- **Unit Tests** (`ROISimulator.test.tsx`): 17 tests covering UI interactions, calculations, and edge cases
- **Property-Based Tests** (`ROISimulator.property.test.ts`): 6 tests validating mathematical properties across 100+ random inputs each

Run tests:
```bash
# Unit tests only
npm run test:run -- src/components/interactive/ROISimulator.test.tsx

# Property-based tests only
npm run test:run -- src/components/interactive/ROISimulator.property.test.ts

# All tests
npm run test:run -- src/components/interactive/
```

#### Performance

- **Initial Render**: <50ms
- **Calculation Updates**: <100ms (memoized with `useMemo`)
- **Re-renders**: Optimized with `useCallback` for event handlers

#### Accessibility

- Semantic HTML with proper landmarks
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- WCAG AA compliant contrast ratios

#### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Dependencies

- React 19.2.5+
- Lucide React (icons)
- Tailwind CSS (styling)

#### Future Enhancements

Potential improvements for future iterations:

- Export results as PDF or image
- Share scenario via URL parameters
- Historical comparison view
- Animation on value changes
- Tooltips explaining calculations
- Integration with backend API for real-time data

## Development

### Adding New Interactive Components

When adding new interactive components to this directory:

1. Create the component file: `ComponentName.tsx`
2. Create unit tests: `ComponentName.test.tsx`
3. Create property-based tests if applicable: `ComponentName.property.test.ts`
4. Create a demo file: `ComponentName.demo.tsx`
5. Export from `index.ts`
6. Update this README

### Testing Guidelines

- Write unit tests for specific examples and edge cases
- Write property-based tests for mathematical properties and invariants
- Aim for >90% code coverage
- Test accessibility with keyboard navigation
- Test responsive behavior at different breakpoints

### Performance Guidelines

- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to child components
- Avoid unnecessary re-renders with proper dependency arrays
- Profile with React DevTools before optimizing

### Accessibility Guidelines

- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Maintain WCAG AA contrast ratios
- Support reduced motion preferences
