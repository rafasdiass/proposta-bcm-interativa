/**
 * Formatting utilities for currency, numbers, and dates
 * Provides consistent formatting for Brazilian Real (BRL) and pt-BR locale
 */

/**
 * Format currency values in Brazilian Real (BRL)
 * Uses Intl.NumberFormat with pt-BR locale for consistent formatting
 *
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "R$ 75.000,00")
 *
 * @example
 * formatCurrency(75000) // "R$ 75.000,00"
 * formatCurrency(297) // "R$ 297,00"
 * formatCurrency(1997.50) // "R$ 1.997,50"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format large numbers with Brazilian thousand separators
 * Uses pt-BR locale with proper thousand (.) and decimal (,) separators
 *
 * @param value - The numeric value to format
 * @returns Formatted number string (e.g., "150.000")
 *
 * @example
 * formatNumber(150000) // "150.000"
 * formatNumber(1000) // "1.000"
 * formatNumber(999.99) // "999,99"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Format dates in Brazilian format (dd/MM/yyyy)
 * Uses pt-BR locale for consistent date formatting
 *
 * @param date - The Date object to format
 * @returns Formatted date string (e.g., "22/05/2026")
 *
 * @example
 * formatDate(new Date('2026-05-22')) // "22/05/2026"
 * formatDate(new Date('2024-01-01')) // "01/01/2024"
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Format a number with leading zeros for display
 * Useful for countdown timers and other numeric displays
 *
 * @param num - The number to format
 * @param minDigits - Minimum number of digits (default: 2)
 * @returns Formatted number string with leading zeros
 *
 * @example
 * formatWithLeadingZeros(5) // "05"
 * formatWithLeadingZeros(42) // "42"
 * formatWithLeadingZeros(7, 3) // "007"
 */
export const formatWithLeadingZeros = (num: number, minDigits = 2): string => {
  return num.toString().padStart(minDigits, '0');
};

/**
 * Key monetary values from the proposal with consistent precision
 * These values should always be formatted with the same precision
 */
export const KEY_MONETARY_VALUES = {
  TOTAL_INVESTMENT: 75000,
  TRANCHE_1: 30000,
  TRANCHE_2: 25000,
  TRANCHE_3: 20000,
  PLAN_PROFESSIONAL: 297,
  PLAN_CLINIC: 997,
  PLAN_SCHOOL: 1997,
  CAPITAL_INVESTED: 150000,
} as const;

/**
 * Format key monetary values with consistent precision
 * Ensures that important proposal values are always displayed consistently
 *
 * @param key - The key of the monetary value to format
 * @returns Formatted currency string
 *
 * @example
 * formatKeyValue('TOTAL_INVESTMENT') // "R$ 75.000,00"
 * formatKeyValue('PLAN_PROFESSIONAL') // "R$ 297,00"
 */
export const formatKeyValue = (
  key: keyof typeof KEY_MONETARY_VALUES
): string => {
  return formatCurrency(KEY_MONETARY_VALUES[key]);
};

/**
 * Format a percentage value
 *
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(25) // "25%"
 * formatPercentage(33.333, 1) // "33,3%"
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format a compact number (e.g., 1K, 1M)
 * Useful for displaying large numbers in limited space
 *
 * @param value - The numeric value to format
 * @returns Formatted compact number string
 *
 * @example
 * formatCompactNumber(1000) // "1 mil"
 * formatCompactNumber(1000000) // "1 mi"
 */
export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
