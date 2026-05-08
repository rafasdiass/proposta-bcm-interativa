/**
 * Unit tests for formatting utilities
 * Tests specific examples, edge cases, and error conditions
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatWithLeadingZeros,
  formatKeyValue,
  formatPercentage,
  formatCompactNumber,
  KEY_MONETARY_VALUES,
} from './formatting';

describe('formatCurrency', () => {
  it('should format positive currency values correctly', () => {
    expect(formatCurrency(75000)).toBe('R$\u00A075.000,00');
    expect(formatCurrency(297)).toBe('R$\u00A0297,00');
    expect(formatCurrency(997)).toBe('R$\u00A0997,00');
    expect(formatCurrency(1997)).toBe('R$\u00A01.997,00');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('R$\u00A00,00');
  });

  it('should format negative values correctly', () => {
    expect(formatCurrency(-100)).toBe('-R$\u00A0100,00');
  });

  it('should format decimal values correctly', () => {
    expect(formatCurrency(1997.5)).toBe('R$\u00A01.997,50');
    expect(formatCurrency(100.99)).toBe('R$\u00A0100,99');
  });

  it('should format large numbers with proper thousand separators', () => {
    expect(formatCurrency(1000000)).toBe('R$\u00A01.000.000,00');
    expect(formatCurrency(150000)).toBe('R$\u00A0150.000,00');
  });

  it('should handle very small decimal values', () => {
    expect(formatCurrency(0.01)).toBe('R$\u00A00,01');
    expect(formatCurrency(0.99)).toBe('R$\u00A00,99');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(100.999)).toBe('R$\u00A0101,00');
    expect(formatCurrency(100.994)).toBe('R$\u00A0100,99');
  });
});

describe('formatNumber', () => {
  it('should format integers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1.000');
    expect(formatNumber(150000)).toBe('150.000');
    expect(formatNumber(1000000)).toBe('1.000.000');
  });

  it('should format numbers without thousand separator when less than 1000', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(1)).toBe('1');
  });

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should format negative numbers correctly', () => {
    expect(formatNumber(-1000)).toBe('-1.000');
    expect(formatNumber(-999)).toBe('-999');
  });

  it('should format decimal numbers with comma separator', () => {
    expect(formatNumber(999.99)).toBe('999,99');
    expect(formatNumber(1000.5)).toBe('1.000,5');
  });
});

describe('formatDate', () => {
  it('should format dates in dd/MM/yyyy pattern', () => {
    // Use explicit date construction to avoid timezone issues
    expect(formatDate(new Date(2026, 4, 22))).toBe('22/05/2026'); // Month is 0-indexed
    expect(formatDate(new Date(2024, 0, 1))).toBe('01/01/2024');
    expect(formatDate(new Date(2024, 11, 31))).toBe('31/12/2024');
  });

  it('should handle single-digit days and months with leading zeros', () => {
    expect(formatDate(new Date(2024, 0, 5))).toBe('05/01/2024');
    expect(formatDate(new Date(2024, 8, 9))).toBe('09/09/2024');
  });

  it('should format current date correctly', () => {
    const now = new Date();
    const formatted = formatDate(now);
    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('formatWithLeadingZeros', () => {
  it('should add leading zeros to single-digit numbers', () => {
    expect(formatWithLeadingZeros(0)).toBe('00');
    expect(formatWithLeadingZeros(5)).toBe('05');
    expect(formatWithLeadingZeros(9)).toBe('09');
  });

  it('should not modify two-digit numbers', () => {
    expect(formatWithLeadingZeros(10)).toBe('10');
    expect(formatWithLeadingZeros(42)).toBe('42');
    expect(formatWithLeadingZeros(99)).toBe('99');
  });

  it('should handle custom minimum digits', () => {
    expect(formatWithLeadingZeros(7, 3)).toBe('007');
    expect(formatWithLeadingZeros(42, 4)).toBe('0042');
    expect(formatWithLeadingZeros(1, 1)).toBe('1');
  });

  it('should not truncate numbers larger than minDigits', () => {
    expect(formatWithLeadingZeros(100, 2)).toBe('100');
    expect(formatWithLeadingZeros(1234, 3)).toBe('1234');
  });
});

describe('KEY_MONETARY_VALUES', () => {
  it('should contain all required key values', () => {
    expect(KEY_MONETARY_VALUES.TOTAL_INVESTMENT).toBe(75000);
    expect(KEY_MONETARY_VALUES.TRANCHE_1).toBe(30000);
    expect(KEY_MONETARY_VALUES.TRANCHE_2).toBe(25000);
    expect(KEY_MONETARY_VALUES.TRANCHE_3).toBe(20000);
    expect(KEY_MONETARY_VALUES.PLAN_PROFESSIONAL).toBe(297);
    expect(KEY_MONETARY_VALUES.PLAN_CLINIC).toBe(997);
    expect(KEY_MONETARY_VALUES.PLAN_SCHOOL).toBe(1997);
    expect(KEY_MONETARY_VALUES.CAPITAL_INVESTED).toBe(150000);
  });

  it('should have tranches that sum to total investment', () => {
    const sum =
      KEY_MONETARY_VALUES.TRANCHE_1 +
      KEY_MONETARY_VALUES.TRANCHE_2 +
      KEY_MONETARY_VALUES.TRANCHE_3;
    expect(sum).toBe(KEY_MONETARY_VALUES.TOTAL_INVESTMENT);
  });
});

describe('formatKeyValue', () => {
  it('should format all key monetary values consistently', () => {
    expect(formatKeyValue('TOTAL_INVESTMENT')).toBe('R$\u00A075.000,00');
    expect(formatKeyValue('TRANCHE_1')).toBe('R$\u00A030.000,00');
    expect(formatKeyValue('TRANCHE_2')).toBe('R$\u00A025.000,00');
    expect(formatKeyValue('TRANCHE_3')).toBe('R$\u00A020.000,00');
    expect(formatKeyValue('PLAN_PROFESSIONAL')).toBe('R$\u00A0297,00');
    expect(formatKeyValue('PLAN_CLINIC')).toBe('R$\u00A0997,00');
    expect(formatKeyValue('PLAN_SCHOOL')).toBe('R$\u00A01.997,00');
    expect(formatKeyValue('CAPITAL_INVESTED')).toBe('R$\u00A0150.000,00');
  });

  it('should always return the same format for the same key', () => {
    // Test idempotence
    const key = 'TOTAL_INVESTMENT';
    const result1 = formatKeyValue(key);
    const result2 = formatKeyValue(key);
    const result3 = formatKeyValue(key);
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });
});

describe('formatPercentage', () => {
  it('should format percentages without decimals by default', () => {
    expect(formatPercentage(25)).toBe('25%');
    expect(formatPercentage(50)).toBe('50%');
    expect(formatPercentage(100)).toBe('100%');
  });

  it('should format percentages with specified decimal places', () => {
    expect(formatPercentage(33.333, 1)).toBe('33,3%');
    expect(formatPercentage(66.666, 2)).toBe('66,67%');
  });

  it('should handle zero and negative percentages', () => {
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(-10)).toBe('-10%');
  });

  it('should handle percentages over 100', () => {
    expect(formatPercentage(150)).toBe('150%');
  });
});

describe('formatCompactNumber', () => {
  it('should format thousands with "mil"', () => {
    expect(formatCompactNumber(1000)).toBe('1\u00A0mil');
    expect(formatCompactNumber(5000)).toBe('5\u00A0mil');
  });

  it('should format millions with "mi"', () => {
    expect(formatCompactNumber(1000000)).toBe('1\u00A0mi');
    expect(formatCompactNumber(5000000)).toBe('5\u00A0mi');
  });

  it('should not compact numbers less than 1000', () => {
    expect(formatCompactNumber(999)).toBe('999');
    expect(formatCompactNumber(500)).toBe('500');
  });

  it('should handle zero', () => {
    expect(formatCompactNumber(0)).toBe('0');
  });
});

describe('Formatting consistency', () => {
  it('should produce consistent output for the same input (purity)', () => {
    const testValue = 75000;
    const results = Array.from({ length: 10 }, () => formatCurrency(testValue));
    const allSame = results.every(result => result === results[0]);
    expect(allSame).toBe(true);
  });

  it('should maintain precision for key monetary values', () => {
    // All key values should have exactly 2 decimal places
    const keys = Object.keys(KEY_MONETARY_VALUES) as Array<
      keyof typeof KEY_MONETARY_VALUES
    >;
    keys.forEach(key => {
      const formatted = formatKeyValue(key);
      expect(formatted).toMatch(/,\d{2}$/); // Should end with comma and 2 digits
    });
  });

  it('should use proper thousand separators for large numbers', () => {
    const largeNumbers = [1000, 10000, 100000, 1000000];
    largeNumbers.forEach(num => {
      const formatted = formatCurrency(num);
      // Should contain at least one period as thousand separator
      expect(formatted).toMatch(/\d\.\d/);
    });
  });

  it('should use comma as decimal separator', () => {
    const decimals = [100.5, 200.99, 1000.01];
    decimals.forEach(num => {
      const formatted = formatCurrency(num);
      // Should contain comma as decimal separator
      expect(formatted).toMatch(/,\d{2}$/);
    });
  });
});
