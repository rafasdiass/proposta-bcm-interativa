/**
 * Property-based tests for formatting utilities
 * Tests universal properties that should hold across all inputs
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatCurrency, formatDate } from './formatting';

describe('Formatting Property-Based Tests', () => {
  // Feature: proposta-bcm-interativa, Property 7: Currency Formatting Purity
  // **Validates: Requirements 17.4**
  it('Property 7: formatCurrency should produce identical output for the same input (purity)', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary monetary values (positive, negative, zero, decimals)
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          // Call the formatting function multiple times with the same input
          const result1 = formatCurrency(value);
          const result2 = formatCurrency(value);
          const result3 = formatCurrency(value);
          const result4 = formatCurrency(value);
          const result5 = formatCurrency(value);

          // Property: all results should be identical (referential transparency)
          return (
            result1 === result2 &&
            result2 === result3 &&
            result3 === result4 &&
            result4 === result5
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: formatDate should produce identical output for the same input (purity)', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary dates
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date('2100-12-31'),
        }),
        date => {
          // Skip invalid dates (NaN)
          if (isNaN(date.getTime())) {
            return true;
          }

          // Call the formatting function multiple times with the same input
          const result1 = formatDate(date);
          const result2 = formatDate(date);
          const result3 = formatDate(date);
          const result4 = formatDate(date);
          const result5 = formatDate(date);

          // Property: all results should be identical (referential transparency)
          return (
            result1 === result2 &&
            result2 === result3 &&
            result3 === result4 &&
            result4 === result5
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should always return a string', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          return typeof result === 'string';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should always include BRL currency symbol', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Should contain "R$" (BRL symbol)
          return result.includes('R$');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should always include decimal separator', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Should contain comma as decimal separator (pt-BR format)
          return result.includes(',');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should have exactly 2 decimal places', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Should end with comma and exactly 2 digits (pt-BR currency format)
          return /,\d{2}$/.test(result);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatDate should always return a string', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date('2100-12-31'),
        }),
        date => {
          // Skip invalid dates (NaN)
          if (isNaN(date.getTime())) {
            return true;
          }

          const result = formatDate(date);
          return typeof result === 'string';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatDate should always match dd/MM/yyyy pattern', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date('2100-12-31'),
        }),
        date => {
          // Skip invalid dates (NaN)
          if (isNaN(date.getTime())) {
            return true;
          }

          const result = formatDate(date);
          // Should match dd/MM/yyyy pattern (pt-BR date format)
          return /^\d{2}\/\d{2}\/\d{4}$/.test(result);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should handle zero consistently', () => {
    fc.assert(
      fc.property(fc.constant(0), value => {
        const result1 = formatCurrency(value);
        const result2 = formatCurrency(value);
        const result3 = formatCurrency(value);

        // Property: zero should always format the same way
        return result1 === result2 && result2 === result3;
      }),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should preserve sign for negative values', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: -0.01,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Negative values should have a minus sign
          return result.includes('-');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should not have minus sign for positive values', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: 0.01,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Positive values should not have a minus sign
          return !result.includes('-');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatDate should be consistent for the same date object', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1900, max: 2100 }),
        fc.integer({ min: 0, max: 11 }),
        fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
        (year, month, day) => {
          const date = new Date(year, month, day);
          const result1 = formatDate(date);
          const result2 = formatDate(date);

          // Property: same date object should format identically
          return result1 === result2;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency should use thousand separator for large values', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: 1000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          const result = formatCurrency(value);
          // Should contain period as thousand separator (pt-BR format)
          // Pattern: at least one digit, period, digits
          return /\d\.\d/.test(result);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatCurrency idempotence: formatting twice should not change the result', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -1000000,
          max: 1000000,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        value => {
          // Format once
          const result1 = formatCurrency(value);
          // Format again with the same input
          const result2 = formatCurrency(value);

          // Property: results should be identical (idempotent)
          return result1 === result2;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formatDate idempotence: formatting twice should not change the result', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date('2100-12-31'),
        }),
        date => {
          // Skip invalid dates (NaN)
          if (isNaN(date.getTime())) {
            return true;
          }

          // Format once
          const result1 = formatDate(date);
          // Format again with the same input
          const result2 = formatDate(date);

          // Property: results should be identical (idempotent)
          return result1 === result2;
        }
      ),
      { numRuns: 100 }
    );
  });
});
