import type { AppConfig } from '@/types';

export const appConfig: AppConfig = {
  proposal: {
    title: 'BCM · LaVita Code',
    subtitle: 'Proposta de Parceria Estratégica · Confidencial',
    validUntil: new Date(
      import.meta.env.VITE_PROPOSAL_DEADLINE || '2026-05-22T23:59:59-03:00'
    ),
    totalInvestment: 75000, // R$ 75,000
  },
  endpoints: {
    intentSubmission: import.meta.env.VITE_INTENT_ENDPOINT || '/api/intent',
    schedulingLink:
      import.meta.env.VITE_SCHEDULING_URL || 'https://calendly.com/lavitacode',
  },
  assets: {
    pdfUrl: '/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf',
  },
};

export const themeConfig = {
  colors: {
    primary: '#1B3A6B', // blue-trust
    secondary: '#2D9B8A', // green-growth
    accent: '#F5A623', // amber-urgency
    purple: '#8B7EC8', // purple-accent
    lightBase: '#F8F9FA', // light base
    darkBase: '#102642', // dark base
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

/**
 * Analytics configuration
 * Centralized configuration for Google Analytics and Hotjar
 */
export const analyticsConfig = {
  googleAnalytics: {
    enabled: !!import.meta.env.VITE_GA_TRACKING_ID,
    trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  },
  hotjar: {
    enabled: !!import.meta.env.VITE_HOTJAR_ID,
    siteId: import.meta.env.VITE_HOTJAR_ID || '',
  },
  debug: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  performanceMonitoring:
    import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
} as const;

/**
 * Build configuration
 * Production build settings
 */
export const buildConfig = {
  appUrl: import.meta.env.VITE_APP_URL || 'https://example.com',
  sourcemap: import.meta.env.VITE_SOURCEMAP === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
