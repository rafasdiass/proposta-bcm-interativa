# Currency and Date Formatting Utilities

## Overview

This module provides comprehensive formatting utilities for Brazilian Real (BRL) currency, numbers, and dates using the pt-BR locale. All functions use `Intl.NumberFormat` and `Intl.DateTimeFormat` for consistent, locale-aware formatting.

## Requirements Compliance

### Requirement 17.1: BRL Currency Formatting
✅ **Implemented**: `formatCurrency()` uses `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`

```typescript
formatCurrency(75000) // "R$ 75.000,00"
```

### Requirement 17.2: Large Numbers with Thousand Separators
✅ **Implemented**: `formatNumber()` uses pt-BR locale with proper separators
- Thousand separator: `.` (period)
- Decimal separator: `,` (comma)

```typescript
formatNumber(150000) // "150.000"
formatNumber(999.99) // "999,99"
```

### Requirement 17.3: Date Formatting (dd/MM/yyyy)
✅ **Implemented**: `formatDate()` uses `Intl.DateTimeFormat('pt-BR')`

```typescript
formatDate(new Date(2026, 4, 22)) // "22/05/2026"
```

### Requirement 17.4: Currency Formatting Purity
✅ **Tested**: Property test validates referential transparency (same input → same output)
- See `formatting.property.test.ts` for property-based test
- Unit tests verify consistency across multiple calls

### Requirement 17.5: Consistent Precision for Key Values
✅ **Implemented**: `KEY_MONETARY_VALUES` constant and `formatKeyValue()` function
- All key values formatted with exactly 2 decimal places
- Immutable constants ensure consistency

```typescript
KEY_MONETARY_VALUES = {
  TOTAL_INVESTMENT: 75000,    // R$ 75.000,00
  TRANCHE_1: 30000,           // R$ 30.000,00
  TRANCHE_2: 25000,           // R$ 25.000,00
  TRANCHE_3: 20000,           // R$ 20.000,00
  PLAN_PROFESSIONAL: 297,     // R$ 297,00
  PLAN_CLINIC: 997,           // R$ 997,00
  PLAN_SCHOOL: 1997,          // R$ 1.997,00
  CAPITAL_INVESTED: 150000,   // R$ 150.000,00
}
```

## API Reference

### Core Formatting Functions

#### `formatCurrency(value: number): string`
Formats monetary values in Brazilian Real with proper currency symbol and separators.

**Examples:**
```typescript
formatCurrency(75000)    // "R$ 75.000,00"
formatCurrency(297)      // "R$ 297,00"
formatCurrency(1997.50)  // "R$ 1.997,50"
```

#### `formatNumber(value: number): string`
Formats numbers with Brazilian thousand and decimal separators.

**Examples:**
```typescript
formatNumber(150000)  // "150.000"
formatNumber(999.99)  // "999,99"
```

#### `formatDate(date: Date): string`
Formats dates in Brazilian format (dd/MM/yyyy).

**Examples:**
```typescript
formatDate(new Date(2026, 4, 22))  // "22/05/2026"
```

### Additional Utilities

#### `formatWithLeadingZeros(num: number, minDigits?: number): string`
Pads numbers with leading zeros (useful for countdown timers).

**Examples:**
```typescript
formatWithLeadingZeros(5)     // "05"
formatWithLeadingZeros(7, 3)  // "007"
```

#### `formatKeyValue(key: keyof typeof KEY_MONETARY_VALUES): string`
Formats predefined key monetary values with consistent precision.

**Examples:**
```typescript
formatKeyValue('TOTAL_INVESTMENT')    // "R$ 75.000,00"
formatKeyValue('PLAN_PROFESSIONAL')   // "R$ 297,00"
```

#### `formatPercentage(value: number, decimals?: number): string`
Formats percentage values.

**Examples:**
```typescript
formatPercentage(25)        // "25%"
formatPercentage(33.333, 1) // "33,3%"
```

#### `formatCompactNumber(value: number): string`
Formats large numbers in compact notation.

**Examples:**
```typescript
formatCompactNumber(1000)     // "1 mil"
formatCompactNumber(1000000)  // "1 mi"
```

## Testing

### Unit Tests
- 35 unit tests covering all functions
- Tests for edge cases (zero, negative, decimals)
- Tests for formatting consistency
- All tests passing ✅

### Property-Based Tests
- Property 7: Currency Formatting Purity
- Validates referential transparency across random inputs
- See `formatting.property.test.ts`

## Usage in Components

Components should import formatting utilities from the centralized module:

```typescript
import { formatCurrency, formatDate, formatNumber } from '@/utils';

// Use in components
<p>{formatCurrency(75000)}</p>
<p>{formatDate(new Date())}</p>
```

## Notes

- All currency values use non-breaking space (U+00A0) between symbol and amount
- Date formatting respects local timezone
- Functions are pure (no side effects, same input → same output)
- All functions handle edge cases (zero, negative, very large/small numbers)
