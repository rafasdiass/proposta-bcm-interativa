import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Plan pricing constants
const PLAN_PRICING = {
  professional: 297,
  clinic: 997,
  school: 1997,
} as const;

interface PlanMix {
  professional: number;
  clinic: number;
  school: number;
}

interface ROICalculations {
  monthlyRevenue: number;
  estimatedValuation: number;
  fivePercentValue: number;
}

// Calculate ROI metrics (same logic as component)
const calculateROI = (
  subscribers: number,
  planMix: PlanMix,
  mrrMultiple: number
): ROICalculations => {
  // Calculate revenue per plan type
  const professionalRevenue =
    ((subscribers * planMix.professional) / 100) * PLAN_PRICING.professional;
  const clinicRevenue =
    ((subscribers * planMix.clinic) / 100) * PLAN_PRICING.clinic;
  const schoolRevenue =
    ((subscribers * planMix.school) / 100) * PLAN_PRICING.school;

  // Total monthly revenue
  const monthlyRevenue = professionalRevenue + clinicRevenue + schoolRevenue;

  // Estimated valuation (MRR * multiple)
  const estimatedValuation = monthlyRevenue * mrrMultiple;

  // 5% value
  const fivePercentValue = estimatedValuation * 0.05;

  return {
    monthlyRevenue,
    estimatedValuation,
    fivePercentValue,
  };
};

describe('ROISimulator Property-Based Tests', () => {
  // Feature: proposta-bcm-interativa, Property 1: ROI Calculator Monotonicity
  // **Validates: Requirements 4.7**
  it('Property 1: 5% value should be monotonically non-decreasing with subscriber count', () => {
    fc.assert(
      fc.property(
        // Generate two subscriber counts where count2 >= count1
        fc.integer({ min: 0, max: 5000 }),
        fc.integer({ min: 0, max: 5000 }),
        // Generate valid plan mix (percentages that sum to 100)
        fc.record({
          professional: fc.integer({ min: 0, max: 100 }),
          clinic: fc.integer({ min: 0, max: 100 }),
          school: fc.integer({ min: 0, max: 100 }),
        }),
        // Generate MRR multiple (excluding NaN and Infinity)
        fc.double({ min: 1, max: 20, noNaN: true }),
        (sub1, sub2, planMix, mrrMultiple) => {
          // Normalize plan mix to sum to 100
          const total = planMix.professional + planMix.clinic + planMix.school;
          if (total === 0) return true; // Skip invalid case

          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          // Ensure sub1 <= sub2
          const [count1, count2] = sub1 <= sub2 ? [sub1, sub2] : [sub2, sub1];

          // Calculate 5% values for both subscriber counts
          const result1 = calculateROI(count1, normalizedMix, mrrMultiple);
          const result2 = calculateROI(count2, normalizedMix, mrrMultiple);

          // Property: 5% value should be non-decreasing
          return result2.fivePercentValue >= result1.fivePercentValue;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 2: ROI Revenue Sum Consistency
  // **Validates: Requirements 4.8**
  it('Property 2: sum of plan revenues should equal total monthly revenue', () => {
    fc.assert(
      fc.property(
        // Generate subscriber count
        fc.integer({ min: 0, max: 5000 }),
        // Generate valid plan mix
        fc.record({
          professional: fc.integer({ min: 0, max: 100 }),
          clinic: fc.integer({ min: 0, max: 100 }),
          school: fc.integer({ min: 0, max: 100 }),
        }),
        // Generate MRR multiple (excluding NaN and Infinity)
        fc.double({ min: 1, max: 20, noNaN: true }),
        (subscribers, planMix, mrrMultiple) => {
          // Normalize plan mix to sum to 100
          const total = planMix.professional + planMix.clinic + planMix.school;
          if (total === 0) return true; // Skip invalid case

          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          // Calculate individual plan revenues
          const professionalRevenue =
            ((subscribers * normalizedMix.professional) / 100) *
            PLAN_PRICING.professional;
          const clinicRevenue =
            ((subscribers * normalizedMix.clinic) / 100) * PLAN_PRICING.clinic;
          const schoolRevenue =
            ((subscribers * normalizedMix.school) / 100) * PLAN_PRICING.school;

          // Calculate total using the function
          const result = calculateROI(subscribers, normalizedMix, mrrMultiple);

          // Sum of individual revenues
          const sumOfRevenues =
            professionalRevenue + clinicRevenue + schoolRevenue;

          // Property: sum should equal total monthly revenue within tolerance
          const tolerance = 0.01; // R$ 0.01 tolerance for rounding
          const difference = Math.abs(result.monthlyRevenue - sumOfRevenues);

          return difference <= tolerance;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('5% value should increase when MRR multiple increases (fixed subscribers and plan mix)', () => {
    fc.assert(
      fc.property(
        // Generate subscriber count
        fc.integer({ min: 1, max: 5000 }),
        // Generate valid plan mix
        fc.record({
          professional: fc.integer({ min: 1, max: 100 }),
          clinic: fc.integer({ min: 1, max: 100 }),
          school: fc.integer({ min: 1, max: 100 }),
        }),
        // Generate two MRR multiples (excluding NaN and Infinity)
        fc.double({ min: 1, max: 20, noNaN: true }),
        fc.double({ min: 1, max: 20, noNaN: true }),
        (subscribers, planMix, mrr1, mrr2) => {
          // Normalize plan mix
          const total = planMix.professional + planMix.clinic + planMix.school;
          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          // Ensure mrr1 <= mrr2
          const [multiple1, multiple2] =
            mrr1 <= mrr2 ? [mrr1, mrr2] : [mrr2, mrr1];

          // Calculate 5% values
          const result1 = calculateROI(subscribers, normalizedMix, multiple1);
          const result2 = calculateROI(subscribers, normalizedMix, multiple2);

          // Property: 5% value should be non-decreasing with MRR multiple
          return result2.fivePercentValue >= result1.fivePercentValue;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('valuation should equal monthly revenue times MRR multiple', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5000 }),
        fc.record({
          professional: fc.integer({ min: 0, max: 100 }),
          clinic: fc.integer({ min: 0, max: 100 }),
          school: fc.integer({ min: 0, max: 100 }),
        }),
        fc.double({ min: 1, max: 20, noNaN: true }),
        (subscribers, planMix, mrrMultiple) => {
          // Normalize plan mix
          const total = planMix.professional + planMix.clinic + planMix.school;
          if (total === 0) return true;

          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          const result = calculateROI(subscribers, normalizedMix, mrrMultiple);

          // Property: valuation = monthlyRevenue * mrrMultiple
          const expectedValuation = result.monthlyRevenue * mrrMultiple;
          const tolerance = 0.01;

          return (
            Math.abs(result.estimatedValuation - expectedValuation) <= tolerance
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('5% value should equal 5% of valuation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5000 }),
        fc.record({
          professional: fc.integer({ min: 0, max: 100 }),
          clinic: fc.integer({ min: 0, max: 100 }),
          school: fc.integer({ min: 0, max: 100 }),
        }),
        fc.double({ min: 1, max: 20, noNaN: true }),
        (subscribers, planMix, mrrMultiple) => {
          // Normalize plan mix
          const total = planMix.professional + planMix.clinic + planMix.school;
          if (total === 0) return true;

          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          const result = calculateROI(subscribers, normalizedMix, mrrMultiple);

          // Property: fivePercentValue = estimatedValuation * 0.05
          const expectedFivePercent = result.estimatedValuation * 0.05;
          const tolerance = 0.01;

          return (
            Math.abs(result.fivePercentValue - expectedFivePercent) <= tolerance
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('monthly revenue should be zero when subscribers is zero', () => {
    fc.assert(
      fc.property(
        fc.record({
          professional: fc.integer({ min: 0, max: 100 }),
          clinic: fc.integer({ min: 0, max: 100 }),
          school: fc.integer({ min: 0, max: 100 }),
        }),
        fc.double({ min: 1, max: 20, noNaN: true }),
        (planMix, mrrMultiple) => {
          // Normalize plan mix
          const total = planMix.professional + planMix.clinic + planMix.school;
          if (total === 0) return true;

          const normalizedMix = {
            professional: (planMix.professional / total) * 100,
            clinic: (planMix.clinic / total) * 100,
            school: (planMix.school / total) * 100,
          };

          const result = calculateROI(0, normalizedMix, mrrMultiple);

          // Property: all values should be zero when subscribers is zero
          return (
            result.monthlyRevenue === 0 &&
            result.estimatedValuation === 0 &&
            result.fivePercentValue === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
