# Testing Setup Documentation

## Overview

The Interactive BCM Proposal application uses a comprehensive testing strategy with three complementary testing approaches:

1. **Unit Testing** with Vitest
2. **Component Testing** with React Testing Library
3. **Property-Based Testing** with fast-check

This document describes the testing framework configuration, available test utilities, and how to write and run tests.

## Testing Framework Configuration

### Vitest Configuration

The project uses Vitest as the test runner, configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/data': path.resolve(__dirname, './src/data'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

**Key Features:**
- **Globals enabled**: No need to import `describe`, `it`, `expect` in every test file
- **jsdom environment**: Simulates browser environment for component testing
- **Path aliases**: Same import aliases as the main application
- **CSS support**: Allows importing CSS files in tests
- **Setup file**: Configures test environment with mocks and utilities

### Test Setup File

The `src/test/setup.ts` file configures the test environment with necessary mocks:

**Configured Mocks:**
- `@testing-library/jest-dom`: Custom matchers for DOM assertions
- `window.matchMedia`: For testing responsive behavior and reduced motion
- `Element.prototype.scrollIntoView`: For scroll-related functionality
- `window.history`: For navigation and URL updates
- `IntersectionObserver`: For scroll-triggered animations
- `ResizeObserver`: For responsive component behavior

## Installed Testing Libraries

### Core Testing Dependencies

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "fast-check": "^4.7.0",
    "vitest": "^4.1.5"
  }
}
```

### Library Purposes

1. **Vitest**: Fast unit test framework with Vite integration
2. **React Testing Library**: Component testing with user-centric queries
3. **@testing-library/jest-dom**: Custom matchers for DOM assertions
4. **@testing-library/user-event**: Simulate user interactions
5. **fast-check**: Property-based testing for mathematical correctness

## Available NPM Scripts

```bash
# Run tests in watch mode (interactive development)
npm run test

# Run all tests once (CI/CD)
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Organization

### Test File Naming Conventions

The project uses three types of test files:

1. **Unit/Component Tests**: `*.test.tsx` or `*.test.ts`
   - Example: `ROISimulator.test.tsx`
   - Tests specific examples, edge cases, and component behavior

2. **Property-Based Tests**: `*.property.test.ts`
   - Example: `ROISimulator.property.test.ts`
   - Tests universal properties across all inputs

3. **Integration Tests**: `*.integration.test.tsx`
   - Example: `Section.integration.test.tsx`
   - Tests interactions between multiple components

### Test File Locations

Tests are co-located with source files:

```
src/
├── components/
│   ├── interactive/
│   │   ├── ROISimulator.tsx
│   │   ├── ROISimulator.test.tsx           # Unit tests
│   │   └── ROISimulator.property.test.ts   # Property tests
│   └── sections/
│       ├── Section.tsx
│       ├── Section.test.tsx
│       └── Section.integration.test.tsx
├── utils/
│   ├── formatting.ts
│   ├── formatting.test.ts
│   └── formatting.property.test.ts
└── test/
    └── setup.ts                             # Global test setup
```

## Writing Tests

### Unit Tests with Vitest

Unit tests verify specific examples and edge cases:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ROISimulator } from './ROISimulator';

describe('ROISimulator', () => {
  it('should display initial values', () => {
    render(<ROISimulator />);
    expect(screen.getByLabelText('Subscribers')).toHaveValue(0);
  });

  it('should handle zero subscribers', () => {
    render(<ROISimulator />);
    // Test specific edge case
  });
});
```

### Component Tests with React Testing Library

Component tests focus on user interactions:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should expand module card on click', async () => {
  const user = userEvent.setup();
  render(<ModuleCard title="Test" description="Description" />);
  
  const button = screen.getByRole('button', { name: /test/i });
  await user.click(button);
  
  expect(screen.getByText('Description')).toBeVisible();
});
```

### Property-Based Tests with fast-check

Property tests verify universal properties across all inputs:

```typescript
import * as fc from 'fast-check';

// Feature: proposta-bcm-interativa, Property 1: ROI Calculator Monotonicity
// **Validates: Requirements 4.7**
it('Property 1: 5% value should be monotonically non-decreasing', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 5000 }),
      fc.integer({ min: 0, max: 5000 }),
      (sub1, sub2) => {
        const [count1, count2] = sub1 <= sub2 ? [sub1, sub2] : [sub2, sub1];
        const result1 = calculateROI(count1, planMix, multiple);
        const result2 = calculateROI(count2, planMix, multiple);
        
        // Property: monotonically non-decreasing
        return result2.fivePercentValue >= result1.fivePercentValue;
      }
    ),
    { numRuns: 100 }
  );
});
```

## Property-Based Testing Strategy

### Implemented Properties

The application has **7 correctness properties** implemented as property-based tests:

1. **Property 1**: ROI Calculator Monotonicity (Requirements 4.7)
   - File: `src/components/interactive/ROISimulator.property.test.ts`
   - Verifies 5% value increases with subscriber count

2. **Property 2**: ROI Revenue Sum Consistency (Requirements 4.8)
   - File: `src/components/interactive/ROISimulator.property.test.ts`
   - Verifies sum of plan revenues equals total revenue

3. **Property 3**: Softhouse Payback Formula Correctness (Requirements 5.5)
   - File: `src/components/interactive/SofthouseCalculator.property.test.ts`
   - Verifies payback calculation formula

4. **Property 4**: Tranche Sum Invariant (Requirements 6.5)
   - File: `src/components/interactive/TrancheTimeline.property.test.ts`
   - Verifies total equals sum of individual tranches

5. **Property 5**: Countdown Timer Monotonic Decrease (Requirements 7.5)
   - File: `src/components/interactive/CountdownTimer.property.test.ts`
   - Verifies countdown decreases monotonically

6. **Property 6**: Module Card Toggle Idempotence (Requirements 9.4)
   - File: `src/components/interactive/ModuleCards.property.test.ts`
   - Verifies double toggle returns to original state

7. **Property 7**: Currency Formatting Purity (Requirements 17.4)
   - File: `src/utils/formatting.property.test.ts`
   - Verifies formatting function is pure (same input → same output)

### Property Test Configuration

All property tests run with:
- **Minimum 100 iterations** per property
- **Requirement annotations** linking to design document
- **Tag format**: `// Feature: proposta-bcm-interativa, Property {number}: {description}`

## Test Utilities and Helpers

### Available Test Utilities

The test setup provides several utilities:

1. **DOM Mocks**: `matchMedia`, `scrollIntoView`, `history`
2. **Observer Mocks**: `IntersectionObserver`, `ResizeObserver`
3. **Custom Matchers**: From `@testing-library/jest-dom`

### Common Testing Patterns

#### Testing Accessibility

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Testing Reduced Motion

```typescript
it('should respect reduced motion preference', () => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  
  render(<AnimatedComponent />);
  // Verify animations are disabled
});
```

#### Testing Async Behavior

```typescript
import { waitFor } from '@testing-library/react';

it('should load data asynchronously', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## Test Coverage

### Current Test Status

As of the latest run:
- **Total Tests**: 544 tests
- **Passing**: 543 tests (99.8%)
- **Test Files**: 34 files
- **Property Tests**: 7 properties with 100+ iterations each

### Coverage Goals

- **Unit Tests**: 90%+ coverage for utilities and calculations
- **Component Tests**: All interactive components covered
- **Property Tests**: All 7 correctness properties implemented
- **Integration Tests**: Key user flows covered

## Running Tests

### Development Workflow

```bash
# Start test watcher for active development
npm run test

# Run specific test file
npm run test ROISimulator

# Run tests matching pattern
npm run test property

# Run with coverage
npm run test:coverage
```

### CI/CD Integration

```bash
# Run all tests once (for CI pipelines)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test UI Dashboard

```bash
# Open interactive test UI
npm run test:ui
```

The UI provides:
- Visual test results
- Test file explorer
- Coverage visualization
- Test execution timeline

## Debugging Tests

### Using Vitest UI

The Vitest UI (`npm run test:ui`) provides:
- Real-time test execution
- Source code inspection
- Console output viewing
- Test filtering and search

### Debug Mode

```typescript
import { screen, debug } from '@testing-library/react';

it('debug test', () => {
  render(<Component />);
  
  // Print entire DOM
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Verbose Output

```bash
# Run tests with verbose output
npm run test -- --reporter=verbose

# Run with stack traces
npm run test -- --reporter=verbose --no-coverage
```

## Best Practices

### Test Writing Guidelines

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText` over `getByTestId`
   - Follow accessibility best practices

3. **Write Descriptive Test Names**
   - Use "should" statements: "should display error when input is invalid"
   - Be specific about what is being tested

4. **Keep Tests Independent**
   - Each test should run in isolation
   - Don't rely on test execution order

5. **Use Property Tests for Math**
   - Calculator logic should have property tests
   - Verify universal properties, not just examples

### Property Test Guidelines

1. **Annotate with Requirements**
   - Link each property to design document
   - Use standard format: `// Feature: proposta-bcm-interativa, Property X`

2. **Run Sufficient Iterations**
   - Minimum 100 iterations per property
   - Increase for complex properties

3. **Use Smart Generators**
   - Constrain input space intelligently
   - Normalize inputs when needed (e.g., percentages summing to 100)

4. **Handle Edge Cases**
   - Skip invalid inputs explicitly
   - Document why certain inputs are skipped

## Troubleshooting

### Common Issues

#### Tests Fail with "Cannot find module"

**Solution**: Check path aliases in `vitest.config.ts` match `tsconfig.json`

#### Tests Timeout

**Solution**: Increase timeout for async tests:
```typescript
it('slow test', async () => {
  // test code
}, { timeout: 10000 }); // 10 seconds
```

#### Property Tests Fail Intermittently

**Solution**: 
- Check for non-deterministic behavior
- Ensure generators produce valid inputs
- Increase number of runs to find edge cases

#### Mock Not Working

**Solution**: Verify mock is defined in `src/test/setup.ts` before tests run

## Additional Resources

### Documentation Links

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [fast-check Documentation](https://fast-check.dev/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

### Internal Documentation

- Design Document: `.kiro/specs/proposta-bcm-interativa/design.md`
- Requirements: `.kiro/specs/proposta-bcm-interativa/requirements.md`
- Tasks: `.kiro/specs/proposta-bcm-interativa/tasks.md`

## Summary

The Interactive BCM Proposal has a robust testing setup with:

✅ **Vitest** configured for fast unit testing  
✅ **React Testing Library** for component testing  
✅ **fast-check** for property-based testing  
✅ **Test utilities** and mocks configured  
✅ **544 tests** with 99.8% passing rate  
✅ **7 correctness properties** implemented  
✅ **Comprehensive documentation** for writing tests  

The testing framework is production-ready and supports the full development lifecycle from TDD to CI/CD integration.
