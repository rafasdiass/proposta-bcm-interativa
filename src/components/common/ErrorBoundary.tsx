/**
 * Error Boundary Components
 *
 * Provides error boundary wrappers at different levels of the component tree
 * Requirements: Task 11.2 - Add React error boundaries for graceful failure handling
 */

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { logComponentError } from '@/utils/errorLogging';
import {
  ErrorFallback,
  SectionErrorFallback,
  ComponentErrorFallback,
} from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: FallbackProps) => ReactNode;
  onReset?: () => void;
  level?: 'app' | 'section' | 'component';
}

/**
 * Error handler that logs errors
 */
const handleError = (error: unknown, info: { componentStack?: string | null }) => {
  logComponentError(error instanceof Error ? error : new Error(String(error)), info, {
    boundary: 'ErrorBoundary',
  });
};

/**
 * Generic error boundary wrapper
 */
export function ErrorBoundary({
  children,
  fallback,
  onReset,
  level = 'component',
}: ErrorBoundaryProps) {
  // Select default fallback based on level
  const defaultFallback =
    level === 'app'
      ? ErrorFallback
      : level === 'section'
        ? SectionErrorFallback
        : ComponentErrorFallback;

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || defaultFallback}
      onError={handleError}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * App-level error boundary (catches all errors)
 */
export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const handleReset = () => {
    // Clear any error state and reload
    window.location.href = '/';
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        logComponentError(
          error instanceof Error ? error : new Error(String(error)),
          info,
          {
            boundary: 'AppErrorBoundary',
            level: 'critical',
          }
        );
      }}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Section-level error boundary (isolates section errors)
 */
export function SectionErrorBoundary({
  children,
  sectionId,
}: {
  children: ReactNode;
  sectionId?: string;
}) {
  const handleReset = () => {
    // Attempt to reload just this section
    window.location.reload();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={SectionErrorFallback}
      onError={(error, info) => {
        logComponentError(
          error instanceof Error ? error : new Error(String(error)),
          info,
          {
            boundary: 'SectionErrorBoundary',
            sectionId,
            level: 'high',
          }
        );
      }}
      onReset={handleReset}
      resetKeys={[sectionId]} // Reset when section changes
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Component-level error boundary (minimal disruption)
 */
export function ComponentErrorBoundary({
  children,
  componentName,
}: {
  children: ReactNode;
  componentName?: string;
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ComponentErrorFallback}
      onError={(error, info) => {
        logComponentError(
          error instanceof Error ? error : new Error(String(error)),
          info,
          {
            boundary: 'ComponentErrorBoundary',
            componentName,
            level: 'medium',
          }
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
