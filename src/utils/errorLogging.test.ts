/**
 * Error Logging Utilities Tests
 *
 * Tests for error logging functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createErrorLogEntry,
  logError,
  logComponentError,
  logNetworkError,
  logValidationError,
  getStoredErrors,
  clearStoredErrors,
} from './errorLogging';

describe('errorLogging', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    // Mock console methods
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createErrorLogEntry', () => {
    it('should create error log entry with basic error', () => {
      const error = new Error('Test error');
      const entry = createErrorLogEntry(error);

      expect(entry.message).toBe('Test error');
      expect(entry.errorType).toBe('unknown');
      expect(entry.severity).toBe('medium');
      expect(entry.timestamp).toBeGreaterThan(0);
      expect(entry.url).toBe(window.location.href);
      expect(entry.userAgent).toBe(navigator.userAgent);
    });

    it('should create error log entry with component stack', () => {
      const error = new Error('Component error');
      const errorInfo = { componentStack: 'at Component\n  at App' };
      const entry = createErrorLogEntry(error, errorInfo);

      expect(entry.componentStack).toBe('at Component\n  at App');
    });

    it('should create error log entry with custom options', () => {
      const error = new Error('Custom error');
      const entry = createErrorLogEntry(error, undefined, {
        errorType: 'network',
        severity: 'high',
        context: { endpoint: '/api/data' },
      });

      expect(entry.errorType).toBe('network');
      expect(entry.severity).toBe('high');
      expect(entry.context).toEqual({ endpoint: '/api/data' });
    });
  });

  describe('logError', () => {
    it('should store error in session storage', () => {
      const error = new Error('Storage test');
      logError(error);

      const storedErrors = getStoredErrors();
      expect(storedErrors).toHaveLength(1);
      expect(storedErrors[0].message).toBe('Storage test');
    });

    it('should keep only last 10 errors', () => {
      // Add 15 errors
      for (let i = 0; i < 15; i++) {
        logError(new Error(`Error ${i}`));
      }

      const storedErrors = getStoredErrors();
      expect(storedErrors).toHaveLength(10);
      // Should keep the last 10 (5-14)
      expect(storedErrors[0].message).toBe('Error 5');
      expect(storedErrors[9].message).toBe('Error 14');
    });
  });

  describe('logComponentError', () => {
    it('should log component error with high severity', () => {
      const error = new Error('Component failed');
      const errorInfo = { componentStack: 'at MyComponent' };
      const context = { componentName: 'MyComponent' };

      logComponentError(error, errorInfo, context);

      const storedErrors = getStoredErrors();
      expect(storedErrors).toHaveLength(1);
      expect(storedErrors[0].errorType).toBe('component');
      expect(storedErrors[0].severity).toBe('high');
      expect(storedErrors[0].componentStack).toBe('at MyComponent');
      expect(storedErrors[0].context).toEqual({ componentName: 'MyComponent' });
    });
  });

  describe('logNetworkError', () => {
    it('should log network error with medium severity', () => {
      const error = new Error('Network request failed');
      const context = { url: '/api/data', status: 500 };

      logNetworkError(error, context);

      const storedErrors = getStoredErrors();
      expect(storedErrors).toHaveLength(1);
      expect(storedErrors[0].errorType).toBe('network');
      expect(storedErrors[0].severity).toBe('medium');
      expect(storedErrors[0].context).toEqual({ url: '/api/data', status: 500 });
    });
  });

  describe('logValidationError', () => {
    it('should log validation error with low severity', () => {
      const error = new Error('Invalid email format');
      const context = { field: 'email', value: 'invalid' };

      logValidationError(error, context);

      const storedErrors = getStoredErrors();
      expect(storedErrors).toHaveLength(1);
      expect(storedErrors[0].errorType).toBe('validation');
      expect(storedErrors[0].severity).toBe('low');
      expect(storedErrors[0].context).toEqual({ field: 'email', value: 'invalid' });
    });
  });

  describe('getStoredErrors', () => {
    it('should return empty array when no errors stored', () => {
      const errors = getStoredErrors();
      expect(errors).toEqual([]);
    });

    it('should return stored errors', () => {
      logError(new Error('Error 1'));
      logError(new Error('Error 2'));

      const errors = getStoredErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toBe('Error 1');
      expect(errors[1].message).toBe('Error 2');
    });

    it('should handle corrupted session storage gracefully', () => {
      sessionStorage.setItem('app_errors', 'invalid json');
      const errors = getStoredErrors();
      expect(errors).toEqual([]);
    });
  });

  describe('clearStoredErrors', () => {
    it('should clear all stored errors', () => {
      logError(new Error('Error 1'));
      logError(new Error('Error 2'));

      expect(getStoredErrors()).toHaveLength(2);

      clearStoredErrors();

      expect(getStoredErrors()).toEqual([]);
    });
  });
});
