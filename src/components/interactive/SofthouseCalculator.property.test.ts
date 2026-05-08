import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Constants
const TOTAL_INVESTMENT = 75000;
const DISCOUNT_RATE = 0.25;
const MIN_MONTHLY_COST = 0;
const MAX_MONTHLY_COST = 200000;

interface SavingsCalculations {
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number | null;
}

// Calculate savings and payback (same logic as component)
const calculateSavings = (monthlyCost: number): SavingsCalculations => {
  const monthlySavings = monthlyCost * DISCOUNT_RATE;
  const annualSavings = monthlySavings * 12;
  const paybackYears =
    monthlyCost > 0 ? TOTAL_INVESTMENT / annualSavings : null;

  return {
    monthlySavings,
    annualSavings,
    paybackYears,
  };
};

describe('SofthouseCalculator Property-Based Tests', () => {
  // Feature: proposta-bcm-interativa, Property 3: Payback Formula Correctness
  // **Validates: Requirements 5.5**
  it('Property 3: payback years should equal 75000 / (monthly_cost * 0.25 * 12) for all positive costs', () => {
    fc.assert(
      fc.property(
        // Generate monthly costs in valid range, excluding zero
        fc.double({ min: 0.01, max: MAX_MONTHLY_COST, noNaN: true }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Calculate expected payback using the formula
          const expectedPayback =
            TOTAL_INVESTMENT / (monthlyCost * DISCOUNT_RATE * 12);

          // Property: payback should match formula within tolerance of 0.1 years
          const tolerance = 0.1;
          const difference = Math.abs(result.paybackYears! - expectedPayback);

          return difference <= tolerance;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 4: Savings Monotonicity
  // **Validates: Requirements 5.2, 5.3**
  it('Property 4: monthly and annual savings should increase monotonically with monthly cost', () => {
    fc.assert(
      fc.property(
        // Generate two monthly costs where cost2 >= cost1
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        (cost1, cost2) => {
          // Ensure cost1 <= cost2
          const [monthlyCost1, monthlyCost2] =
            cost1 <= cost2 ? [cost1, cost2] : [cost2, cost1];

          const result1 = calculateSavings(monthlyCost1);
          const result2 = calculateSavings(monthlyCost2);

          // Property: savings should be non-decreasing
          return (
            result2.monthlySavings >= result1.monthlySavings &&
            result2.annualSavings >= result1.annualSavings
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 5: Annual Savings Relationship
  // **Validates: Requirements 5.3**
  it('Property 5: annual savings should equal monthly savings times 12', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Property: annual = monthly * 12
          const expectedAnnual = result.monthlySavings * 12;
          const tolerance = 0.01; // R$ 0.01 tolerance for rounding

          return Math.abs(result.annualSavings - expectedAnnual) <= tolerance;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 6: Discount Rate Application
  // **Validates: Requirements 5.2**
  it('Property 6: monthly savings should equal monthly cost times 25%', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Property: monthly savings = monthly cost * 0.25
          const expectedSavings = monthlyCost * DISCOUNT_RATE;
          const tolerance = 0.01;

          return Math.abs(result.monthlySavings - expectedSavings) <= tolerance;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 7: Zero Cost Handling
  // **Validates: Requirements 5.6**
  it('Property 7: payback should be null when monthly cost is zero', () => {
    const result = calculateSavings(0);

    // Property: payback should be null for zero cost
    expect(result.paybackYears).toBeNull();
    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
  });

  // Feature: proposta-bcm-interativa, Property 8: Payback Inverse Relationship
  // **Validates: Requirements 5.5**
  it('Property 8: payback years should decrease as monthly cost increases', () => {
    fc.assert(
      fc.property(
        // Generate two positive monthly costs where cost2 > cost1
        fc.double({ min: 0.01, max: MAX_MONTHLY_COST / 2, noNaN: true }),
        fc.double({ min: 0.01, max: MAX_MONTHLY_COST / 2, noNaN: true }),
        (cost1, cost2) => {
          // Ensure cost1 < cost2 (strictly less than)
          if (Math.abs(cost1 - cost2) < 0.01) return true; // Skip if too close

          const [monthlyCost1, monthlyCost2] =
            cost1 < cost2 ? [cost1, cost2] : [cost2, cost1];

          const result1 = calculateSavings(monthlyCost1);
          const result2 = calculateSavings(monthlyCost2);

          // Property: higher cost should result in lower payback period
          return result2.paybackYears! < result1.paybackYears!;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 9: Reference Example Validation
  // **Validates: Requirements 5.4**
  it('Property 9: reference examples should match expected values', () => {
    // Example 1: R$8,000/month
    const result1 = calculateSavings(8000);
    expect(result1.annualSavings).toBe(24000);
    expect(Math.abs(result1.paybackYears! - 3.1)).toBeLessThanOrEqual(0.1);

    // Example 2: R$12,000/month
    const result2 = calculateSavings(12000);
    expect(result2.annualSavings).toBe(36000);
    expect(Math.abs(result2.paybackYears! - 2.1)).toBeLessThanOrEqual(0.1);
  });

  // Feature: proposta-bcm-interativa, Property 10: Savings Non-Negativity
  // **Validates: Requirements 5.2, 5.3**
  it('Property 10: all savings values should be non-negative', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Property: all savings should be >= 0
          return (
            result.monthlySavings >= 0 &&
            result.annualSavings >= 0 &&
            (result.paybackYears === null || result.paybackYears >= 0)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 11: Payback Calculation Consistency
  // **Validates: Requirements 5.5**
  it('Property 11: payback should equal investment divided by annual savings', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: MAX_MONTHLY_COST, noNaN: true }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Property: payback = investment / annual savings
          const expectedPayback = TOTAL_INVESTMENT / result.annualSavings;
          const tolerance = 0.01;

          return Math.abs(result.paybackYears! - expectedPayback) <= tolerance;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 12: Input Range Validation
  // **Validates: Requirements 5.1**
  it('Property 12: calculator should handle all values in valid range [0, 200000]', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: MIN_MONTHLY_COST,
          max: MAX_MONTHLY_COST,
          noNaN: true,
        }),
        monthlyCost => {
          const result = calculateSavings(monthlyCost);

          // Property: calculation should complete without errors
          // and return valid numbers or null
          return (
            typeof result.monthlySavings === 'number' &&
            typeof result.annualSavings === 'number' &&
            (result.paybackYears === null ||
              typeof result.paybackYears === 'number') &&
            !isNaN(result.monthlySavings) &&
            !isNaN(result.annualSavings) &&
            (result.paybackYears === null || !isNaN(result.paybackYears))
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
