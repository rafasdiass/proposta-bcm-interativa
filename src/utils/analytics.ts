/**
 * Analytics Integration Utilities
 *
 * Provides a unified interface for tracking user interactions across
 * Google Analytics and Hotjar. Handles initialization, event tracking,
 * and page view tracking with proper error handling and type safety.
 *
 * Requirements:
 * - 13.2: Form submission tracking
 * - 7.1: Countdown timer interaction tracking
 */

import type { AnalyticsEvent, AnalyticsPageView } from '@/types';

/**
 * Check if analytics is enabled based on environment configuration
 */
export const isAnalyticsEnabled = (): boolean => {
  return !!(
    import.meta.env.VITE_GA_TRACKING_ID || import.meta.env.VITE_HOTJAR_ID
  );
};

/**
 * Check if Google Analytics is configured
 */
export const isGAEnabled = (): boolean => {
  return !!import.meta.env.VITE_GA_TRACKING_ID;
};

/**
 * Check if Hotjar is configured
 */
export const isHotjarEnabled = (): boolean => {
  return !!import.meta.env.VITE_HOTJAR_ID;
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV;
};

/**
 * Initialize Google Analytics
 * Injects the GA4 script and initializes tracking
 */
export const initializeGA = (): void => {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!trackingId) {
    if (isDebugMode()) {
      console.log('[Analytics] Google Analytics not configured');
    }
    return;
  }

  try {
    // Create script element for GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    // Configure GA4
    window.gtag('js', new Date());
    window.gtag('config', trackingId, {
      send_page_view: false, // We'll handle page views manually
      anonymize_ip: true, // Privacy-friendly
    });

    if (isDebugMode()) {
      console.log('[Analytics] Google Analytics initialized:', trackingId);
    }
  } catch (error) {
    console.error('[Analytics] Failed to initialize Google Analytics:', error);
  }
};

/**
 * Initialize Hotjar
 * Injects the Hotjar tracking script
 */
export const initializeHotjar = (): void => {
  const siteId = import.meta.env.VITE_HOTJAR_ID;

  if (!siteId) {
    if (isDebugMode()) {
      console.log('[Analytics] Hotjar not configured');
    }
    return;
  }

  try {
    // Hotjar initialization script
    (function (h, o, t, j) {
      h.hj =
        h.hj ||
        function () {
          // eslint-disable-next-line prefer-rest-params
          ((h.hj as { q?: unknown[] }).q = (h.hj as { q?: unknown[] }).q || []).push(
            // eslint-disable-next-line prefer-rest-params
            arguments
          );
        };
      h._hjSettings = { hjid: parseInt(siteId, 10), hjsv: 6 };
      const a = o.getElementsByTagName('head')[0];
      const r = o.createElement('script');
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

    if (isDebugMode()) {
      console.log('[Analytics] Hotjar initialized:', siteId);
    }
  } catch (error) {
    console.error('[Analytics] Failed to initialize Hotjar:', error);
  }
};

/**
 * Initialize all analytics services
 * Call this once when the application starts
 */
export const initializeAnalytics = (): void => {
  if (!isAnalyticsEnabled()) {
    if (isDebugMode()) {
      console.log(
        '[Analytics] Analytics disabled - no tracking IDs configured'
      );
    }
    return;
  }

  initializeGA();
  initializeHotjar();
};

/**
 * Track a page view
 */
export const trackPageView = (pageView: AnalyticsPageView): void => {
  if (!isAnalyticsEnabled()) return;

  try {
    // Google Analytics page view
    if (isGAEnabled() && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pageView.page,
        page_title: pageView.title,
        mode: pageView.mode,
      });
    }

    // Hotjar virtual page view
    if (isHotjarEnabled() && window.hj) {
      window.hj('stateChange', pageView.page);
    }

    if (isDebugMode()) {
      console.log('[Analytics] Page view tracked:', pageView);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!isAnalyticsEnabled()) return;

  try {
    // Google Analytics event
    if (isGAEnabled() && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    // Hotjar event
    if (isHotjarEnabled() && window.hj) {
      window.hj('event', event.action);
    }

    if (isDebugMode()) {
      console.log('[Analytics] Event tracked:', event);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
};

/**
 * Track section view
 */
export const trackSectionView = (section: string, mode: string): void => {
  trackEvent({
    category: 'Navigation',
    action: 'section_view',
    label: `${section} (${mode})`,
  });
};

/**
 * Track mode switch
 */
export const trackModeSwitch = (from: string, to: string): void => {
  trackEvent({
    category: 'Navigation',
    action: 'mode_switch',
    label: `${from} → ${to}`,
  });
};

/**
 * Track calculator interaction
 */
export const trackCalculatorInteraction = (
  type: string,
  value: number
): void => {
  trackEvent({
    category: 'Interactive',
    action: 'calculator_interaction',
    label: type,
    value,
  });
};

/**
 * Track CTA click
 */
export const trackCTAClick = (action: string, section: string): void => {
  trackEvent({
    category: 'Conversion',
    action: 'cta_click',
    label: `${action} (${section})`,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (success: boolean): void => {
  trackEvent({
    category: 'Conversion',
    action: 'form_submission',
    label: success ? 'success' : 'failure',
    value: success ? 1 : 0,
  });
};

/**
 * Track PDF download
 */
export const trackPDFDownload = (): void => {
  trackEvent({
    category: 'Conversion',
    action: 'pdf_download',
    label: 'BCM Proposal PDF',
    value: Date.now(),
  });
};

/**
 * Track countdown timer urgency
 */
export const trackCountdownUrgency = (hoursRemaining: number): void => {
  trackEvent({
    category: 'Engagement',
    action: 'countdown_urgency',
    label: `${hoursRemaining} hours remaining`,
    value: hoursRemaining,
  });
};

/**
 * Track module card expansion
 */
export const trackModuleExpansion = (moduleId: string): void => {
  trackEvent({
    category: 'Engagement',
    action: 'module_expansion',
    label: moduleId,
  });
};

/**
 * Track protocol selector interaction
 */
export const trackProtocolSelection = (protocolGroup: string): void => {
  trackEvent({
    category: 'Engagement',
    action: 'protocol_selection',
    label: protocolGroup,
  });
};

/**
 * Track objection accordion interaction
 */
export const trackObjectionView = (objectionId: string): void => {
  trackEvent({
    category: 'Engagement',
    action: 'objection_view',
    label: objectionId,
  });
};

/**
 * Track error occurrence
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
): void => {
  trackEvent({
    category: 'Error',
    action: `${errorType}_error`,
    label: errorMessage.substring(0, 100),
    value: severity === 'critical' ? 4 : severity === 'high' ? 3 : severity === 'medium' ? 2 : 1,
  });
};

/**
 * Track performance issue
 */
export const trackPerformanceIssue = (
  metric: string,
  value: number,
  threshold: number
): void => {
  trackEvent({
    category: 'Performance',
    action: 'performance_issue',
    label: `${metric} exceeded threshold (${value}ms > ${threshold}ms)`,
    value: Math.round(value),
  });
};
