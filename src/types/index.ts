// Core application types for the Interactive BCM Proposal

export interface NavigationState {
  mode: 'landing' | 'presentation';
  currentSection: number;
  totalSections: number;
  isTransitioning: boolean;
}

export interface NavigationActions {
  setMode: (mode: 'landing' | 'presentation') => void;
  goToSection: (index: number) => void;
  nextSection: () => void;
  previousSection: () => void;
  updateProgress: (progress: number) => void;
}

export interface SectionConfig {
  id: string;
  slug: string;
  title: string;
  variant: 'light' | 'dark' | 'teal';
  component: React.ComponentType;
  showHeader: boolean;
  showFooter: boolean;
  order: number;
}

export interface SectionProps {
  id: string;
  title: string;
  variant: 'light' | 'dark' | 'teal';
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  'aria-hidden'?: boolean;
}

export interface AppConfig {
  proposal: {
    title: string;
    subtitle: string;
    validUntil: Date;
    totalInvestment: number;
  };
  endpoints: {
    intentSubmission: string;
    schedulingLink: string;
  };
  assets: {
    pdfUrl: string;
  };
}

export interface ThemeConfig {
  colors: {
    primary: string; // #1B3A6B (blue-trust)
    secondary: string; // #2D9B8A (green-growth)
    accent: string; // #F5A623 (amber-urgency)
    purple: string; // #8B7EC8 (purple-accent)
    lightBase: string; // #F8F9FA
    darkBase: string; // #102642
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Environment configuration types
export interface EnvironmentConfig {
  // API endpoints
  VITE_INTENT_ENDPOINT: string;
  VITE_SCHEDULING_URL: string;

  // Proposal configuration
  VITE_PROPOSAL_DEADLINE: string;

  // Analytics
  VITE_GA_TRACKING_ID?: string;
  VITE_HOTJAR_ID?: string;

  // Production build
  VITE_APP_URL?: string;
  VITE_SOURCEMAP?: string;

  // Feature flags
  VITE_DEBUG_MODE?: string;
  VITE_ENABLE_PERFORMANCE_MONITORING?: string;
}

// Analytics event types
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface AnalyticsPageView {
  page: string;
  title: string;
  mode?: 'landing' | 'presentation';
}

export interface AnalyticsEvents {
  section_view: { section: string; mode: string };
  mode_switch: { from: string; to: string };
  calculator_interaction: { type: string; value: number };
  cta_click: { action: string; section: string };
  form_submission: { success: boolean };
  pdf_download: { timestamp: number };
}

// Extend Window interface for analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    hj?: {
      (command: string, ...args: unknown[]): void;
      q?: unknown[];
    };
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
    dataLayer?: unknown[];
  }
}
