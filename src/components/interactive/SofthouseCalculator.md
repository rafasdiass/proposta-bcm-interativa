# Softhouse Calculator Component

## Overview

The `SofthouseCalculator` component calculates operational savings from using LaVita Code's development services at a 25% discount. It shows the return on investment independent of equity considerations.

## Features

- **Monthly Cost Input**: Range slider (R$0 - R$200,000) with synchronized number input
- **Real-time Calculations**: Instant updates for monthly savings, annual savings, and payback period
- **Reference Examples**: Pre-configured scenarios for R$8,000/month and R$12,000/month
- **Zero Cost Handling**: Graceful display when no cost is entered
- **BRL Formatting**: All monetary values formatted in Brazilian Real (pt-BR locale)
- **Responsive Design**: Works on all screen sizes

## Usage

```tsx
import { SofthouseCalculator } from './components/interactive/SofthouseCalculator';

function App() {
  return <SofthouseCalculator />;
}
```

## Calculations

### Monthly Savings
```
monthly_savings = monthly_cost × 0.25
```

### Annual Savings
```
annual_savings = monthly_savings × 12
```

### Payback Period
```
payback_years = 75,000 / annual_savings
```

## Reference Examples

| Monthly Cost | Annual Savings | Payback Period |
|--------------|----------------|----------------|
| R$8,000      | R$24,000       | 3.1 years      |
| R$12,000     | R$36,000       | 2.1 years      |

## Constants

- **Total Investment**: R$75,000
- **Discount Rate**: 25% (fixed)
- **Monthly Cost Range**: R$0 to R$200,000

## Component Structure

```
SofthouseCalculator/
├── SofthouseCalculator.tsx           # Main component
├── SofthouseCalculator.test.tsx      # Unit tests
├── SofthouseCalculator.property.test.ts  # Property-based tests
├── SofthouseCalculator.demo.tsx      # Demo/showcase component
└── SofthouseCalculator.md            # This documentation
```

## Testing

### Unit Tests
Run unit tests with:
```bash
npm test -- SofthouseCalculator.test.tsx --run
```

Tests cover:
- Component rendering
- Reference examples display
- Calculation accuracy
- Zero cost handling
- Currency formatting
- Input validation
- User interactions

### Property-Based Tests
Run property-based tests with:
```bash
npm test -- SofthouseCalculator.property.test.ts --run
```

Properties tested:
1. **Payback Formula Correctness**: Validates formula for all positive costs
2. **Savings Monotonicity**: Savings increase with monthly cost
3. **Annual Savings Relationship**: Annual = Monthly × 12
4. **Discount Rate Application**: Monthly savings = cost × 25%
5. **Zero Cost Handling**: Null payback for zero cost
6. **Payback Inverse Relationship**: Higher cost = lower payback
7. **Reference Example Validation**: Examples match expected values
8. **Savings Non-Negativity**: All values ≥ 0
9. **Payback Calculation Consistency**: Investment ÷ annual savings
10. **Input Range Validation**: Handles full range [0, 200,000]

## Requirements Validation

This component satisfies the following requirements from the spec:

- **5.1**: Accepts monthly cost input in range [0, 200,000]
- **5.2**: Applies 25% fixed discount
- **5.3**: Calculates and displays monthly/annual savings and payback
- **5.4**: Displays reference examples
- **5.6**: Handles zero cost gracefully
- **5.7**: Formats all values in BRL

## Performance

- Uses `useMemo` for calculation memoization
- Uses `useCallback` for event handler optimization
- Updates complete in < 100ms (requirement 5.3)

## Accessibility

- Labeled form controls
- Keyboard navigation support
- ARIA-compliant structure
- Screen reader friendly

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- React 18+

## Dependencies

- React 18+
- lucide-react (icons)
- Tailwind CSS (styling)

## License

Part of the Interactive BCM Proposal application.
