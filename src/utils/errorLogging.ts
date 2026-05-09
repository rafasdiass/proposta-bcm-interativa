/**
 * Error Logging Utilities
 *
 * Provides centralized error logging with analytics integration
 * Requirements: Task 11.2 - Error handling throughout application
 */

import { trackEvent } from './analytics';

export interface ErrorLogEntry {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  errorType: 'component' | 'network' | 'validation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
}

/**
 * Check if error logging is enabled
 */
export const isErrorLoggingEnabled = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV;
};

/**
 * Log error to console with formatting
 */
export const logErrorToConsole = (entry: ErrorLogEntry): void => {
  const emoji = {
    low: '⚠️',
    medium: '⚠️',
    high: '🚨',
    critical: '🔥',
  }[entry.severity];

  console.group(
    `${emoji} Error [${entry.severity.toUpperCase()}] - ${entry.errorType}`
  );
  console.error('Message:', entry.message);
  if (entry.stack) {
    console.error('Stack:', entry.stack);
  }
  if (entry.componentStack) {
    console.error('Component Stack:', entry.componentStack);
  }
  console.log('Timestamp:', new Date(entry.timestamp).toISOString());
  console.log('URL:', entry.url);
  console.log('User Agent:', entry.userAgent);
  if (entry.context) {
    console.log('Context:', entry.context);
  }
  console.groupEnd();
};

/**
 * Send error to analytics
 */
export const logErrorToAnalytics = (entry: ErrorLogEntry): void => {
  try {
    trackEvent({
      category: 'Error',
      action: `${entry.errorType}_error`,
      label: entry.message.substring(0, 100), // Limit label length
      value:
        entry.severity === 'critical'
          ? 4
          : entry.severity === 'high'
            ? 3
            : entry.severity === 'medium'
              ? 2
              : 1,
    });
  } catch (error) {
    // Fail silently - don't let error tracking cause more errors
    console.warn('[ErrorLogging] Failed to send error to analytics:', error);
  }
};

/**
 * Create error log entry from Error object
 */
export const createErrorLogEntry = (
  error: Error,
  errorInfo?: { componentStack?: string | null },
  options?: {
    errorType?: ErrorLogEntry['errorType'];
    severity?: ErrorLogEntry['severity'];
    context?: Record<string, unknown>;
  }
): ErrorLogEntry => {
  return {
    message: error.message || 'Unknown error',
    stack: error.stack,
    componentStack: errorInfo?.componentStack ?? undefined,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorType: options?.errorType || 'unknown',
    severity: options?.severity || 'medium',
    context: options?.context,
  };
};

/**
 * Main error logging function
 */
export const logError = (
  error: Error,
  errorInfo?: { componentStack?: string | null },
  options?: {
    errorType?: ErrorLogEntry['errorType'];
    severity?: ErrorLogEntry['severity'];
    context?: Record<string, unknown>;
  }
): void => {
  const entry = createErrorLogEntry(error, errorInfo, options);

  // Always log to console in development or debug mode
  if (isErrorLoggingEnabled()) {
    logErrorToConsole(entry);
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    logErrorToAnalytics(entry);
  }

  // Store in session storage for debugging (keep last 10 errors)
  try {
    const storedErrors = JSON.parse(
      sessionStorage.getItem('app_errors') || '[]'
    ) as ErrorLogEntry[];
    storedErrors.push(entry);
    // Keep only last 10 errors
    const recentErrors = storedErrors.slice(-10);
    sessionStorage.setItem('app_errors', JSON.stringify(recentErrors));
  } catch (storageError) {
    // Fail silently if storage is not available
    console.warn('[ErrorLogging] Failed to store error in session storage');
  }
};

/**
 * Log component error (for error boundaries)
 */
export const logComponentError = (
  error: Error,
  errorInfo: { componentStack?: string | null },
  context?: Record<string, unknown>
): void => {
  logError(error, errorInfo, {
    errorType: 'component',
    severity: 'high',
    context,
  });
};

/**
 * Log network error
 */
export const logNetworkError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  logError(error, undefined, {
    errorType: 'network',
    severity: 'medium',
    context,
  });
};

/**
 * Log validation error
 */
export const logValidationError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  logError(error, undefined, {
    errorType: 'validation',
    severity: 'low',
    context,
  });
};

/**
 * Get stored errors from session storage
 */
export const getStoredErrors = (): ErrorLogEntry[] => {
  try {
    return JSON.parse(sessionStorage.getItem('app_errors') || '[]');
  } catch {
    return [];
  }
};

/**
 * Clear stored errors
 */
export const clearStoredErrors = (): void => {
  try {
    sessionStorage.removeItem('app_errors');
  } catch {
    // Fail silently
  }
};
