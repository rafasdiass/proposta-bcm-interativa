/**
 * Performance Monitoring Utilities
 *
 * Provides utilities for monitoring and optimizing application performance
 * Requirements: 14.4 - First Contentful Paint under 2.5 seconds
 */

/**
 * Performance Metrics Interface
 */
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  domContentLoaded?: number;
  loadComplete?: number;
}

/**
 * Get Web Vitals metrics
 */
export function getWebVitals(): Promise<PerformanceMetrics> {
  return new Promise(resolve => {
    const metrics: PerformanceMetrics = {};

    // Get navigation timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const navigationStart = timing.navigationStart;

      metrics.ttfb = timing.responseStart - navigationStart;
      metrics.domContentLoaded =
        timing.domContentLoadedEventEnd - navigationStart;
      metrics.loadComplete = timing.loadEventEnd - navigationStart;
    }

    // Get paint timing
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
      });
    }

    // Use PerformanceObserver for LCP, FID, CLS
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number;
            loadTime?: number;
          };
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            const fidEntry = entry as PerformanceEntry & {
              processingStart?: number;
            };
            if (fidEntry.processingStart) {
              metrics.fid = fidEntry.processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            const layoutShiftEntry = entry as PerformanceEntry & {
              value?: number;
              hadRecentInput?: boolean;
            };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value || 0;
            }
          });
          metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Resolve after a delay to collect metrics
        setTimeout(() => {
          resolve(metrics);
        }, 3000);
      } catch (error) {
        console.warn('PerformanceObserver not fully supported:', error);
        resolve(metrics);
      }
    } else {
      resolve(metrics);
    }
  });
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (import.meta.env.DEV) {
    console.group('📊 Performance Metrics');
    console.log('First Contentful Paint (FCP):', metrics.fcp?.toFixed(2), 'ms');
    console.log(
      'Largest Contentful Paint (LCP):',
      metrics.lcp?.toFixed(2),
      'ms'
    );
    console.log('First Input Delay (FID):', metrics.fid?.toFixed(2), 'ms');
    console.log('Cumulative Layout Shift (CLS):', metrics.cls?.toFixed(4));
    console.log('Time to First Byte (TTFB):', metrics.ttfb?.toFixed(2), 'ms');
    console.log(
      'DOM Content Loaded:',
      metrics.domContentLoaded?.toFixed(2),
      'ms'
    );
    console.log('Load Complete:', metrics.loadComplete?.toFixed(2), 'ms');
    console.groupEnd();

    // Check against thresholds
    if (metrics.fcp && metrics.fcp > 2500) {
      console.warn('⚠️ FCP exceeds 2.5s threshold:', metrics.fcp, 'ms');
    }
    if (metrics.lcp && metrics.lcp > 2500) {
      console.warn('⚠️ LCP exceeds 2.5s threshold:', metrics.lcp, 'ms');
    }
    if (metrics.cls && metrics.cls > 0.1) {
      console.warn('⚠️ CLS exceeds 0.1 threshold:', metrics.cls);
    }
  }
}

/**
 * Send performance metrics to analytics
 */
export function sendPerformanceMetrics(metrics: PerformanceMetrics): void {
  // Only send in production if performance monitoring is enabled
  if (
    import.meta.env.PROD &&
    import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false'
  ) {
    // Send to Google Analytics if configured
    if (window.gtag && import.meta.env.VITE_GA_TRACKING_ID) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'Web Vitals',
        value: Math.round(metrics.fcp || 0),
        fcp: Math.round(metrics.fcp || 0),
        lcp: Math.round(metrics.lcp || 0),
        cls: Math.round((metrics.cls || 0) * 1000) / 1000,
        fid: Math.round(metrics.fid || 0),
        ttfb: Math.round(metrics.ttfb || 0),
      });

      // Track performance issues
      if (metrics.fcp && metrics.fcp > 2500) {
        window.gtag('event', 'performance_issue', {
          event_category: 'Performance',
          event_label: 'FCP exceeds threshold',
          value: Math.round(metrics.fcp),
        });
      }
      if (metrics.lcp && metrics.lcp > 2500) {
        window.gtag('event', 'performance_issue', {
          event_category: 'Performance',
          event_label: 'LCP exceeds threshold',
          value: Math.round(metrics.lcp),
        });
      }
      if (metrics.cls && metrics.cls > 0.1) {
        window.gtag('event', 'performance_issue', {
          event_category: 'Performance',
          event_label: 'CLS exceeds threshold',
          value: Math.round(metrics.cls * 1000),
        });
      }
    }

    // Log for debugging if debug mode is enabled
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('[Performance] Metrics sent to analytics:', metrics);
    }
  } else if (import.meta.env.DEV) {
    console.log('[Performance] Metrics (dev mode):', metrics);
  }
}

/**
 * Monitor performance and log/send metrics
 */
export function monitorPerformance(): void {
  if (typeof window === 'undefined') return;

  // Wait for page load
  if (document.readyState === 'complete') {
    collectMetrics();
  } else {
    window.addEventListener('load', collectMetrics);
  }
}

function collectMetrics(): void {
  getWebVitals().then(metrics => {
    logPerformanceMetrics(metrics);
    sendPerformanceMetrics(metrics);
  });
}

/**
 * Prefetch a resource
 */
export function prefetchResource(url: string, as: string = 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Preload a critical resource
 */
export function preloadResource(url: string, as: string, type?: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  if (type) {
    link.type = type;
  }
  document.head.appendChild(link);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed
 */
export function getConnectionSpeed(): string {
  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        saveData?: boolean;
      };
    }
  ).connection;

  if (!connection) return 'unknown';

  return connection.effectiveType || 'unknown';
}

/**
 * Check if connection is slow
 */
export function isSlowConnection(): boolean {
  const speed = getConnectionSpeed();
  return speed === 'slow-2g' || speed === '2g';
}

/**
 * Optimize images based on connection speed
 */
export function shouldLoadHighQualityImages(): boolean {
  const speed = getConnectionSpeed();
  return speed === '4g' || speed === 'unknown';
}
