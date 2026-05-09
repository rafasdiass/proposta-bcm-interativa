/**
 * Common Components
 *
 * Reusable UI components used throughout the application
 */

export { SkipLinks } from './SkipLinks';
export { LazyImage, LazyBackgroundImage } from './LazyImage';
export { TestComponent } from './TestComponent';
export { Footer } from './Footer';

// Error Boundaries
export {
  ErrorBoundary,
  AppErrorBoundary,
  SectionErrorBoundary,
  ComponentErrorBoundary,
} from './ErrorBoundary';

// Error Fallbacks
export {
  ErrorFallback,
  SectionErrorFallback,
  ComponentErrorFallback,
  NetworkErrorFallback,
  LoadingErrorFallback,
} from './ErrorFallback';
