/**
 * Interactive BCM Proposal - Theme Configuration
 *
 * Centralized theme configuration with brand colors, typography,
 * and responsive breakpoints as specified in requirements.
 */

export const theme = {
  colors: {
    // Brand colors from requirements
    primary: '#1B3A6B', // blue-trust
    secondary: '#2D9B8A', // green-growth
    accent: '#F5A623', // amber-urgency
    purple: '#8B7EC8', // purple-accent
    base: {
      light: '#F8F9FA', // light base
      dark: '#08111F', // dark base
    },

    // Semantic color mappings
    trust: '#1B3A6B',
    growth: '#2D9B8A',
    urgency: '#F5A623',

    // Extended palette for UI components
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },

    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    presentation: '1024px', // Custom breakpoint for presentation mode
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    full: '9999px',
  },

  shadows: {
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    medium:
      '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    strong:
      '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
  },

  animation: {
    duration: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
    },

    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      sharp: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Type definitions for theme
export type Theme = typeof theme;
export type ThemeColors = keyof typeof theme.colors;
export type ThemeBreakpoints = keyof typeof theme.breakpoints;

// Section theme variants as specified in requirements
export const sectionVariants = {
  light: {
    background: theme.colors.base.dark,
    text: '#ffffff',
    className: 'section-light',
  },
  dark: {
    background: theme.colors.base.dark,
    text: '#ffffff',
    className: 'section-dark',
  },
  teal: {
    background: theme.colors.secondary,
    text: '#ffffff',
    className: 'section-teal',
  },
} as const;

export type SectionVariant = keyof typeof sectionVariants;

// Currency formatting configuration for BRL
export const currencyConfig = {
  locale: 'pt-BR',
  currency: 'BRL',
  options: {
    style: 'currency' as const,
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
};

// Key monetary values from requirements (immutable)
export const monetaryConstants = {
  totalInvestment: 75000, // R$ 75.000
  tranche1: 30000, // R$ 30.000
  tranche2: 25000, // R$ 25.000
  tranche3: 20000, // R$ 20.000
  planProfessional: 297, // R$ 297
  planClinic: 997, // R$ 997
  planSchool: 1997, // R$ 1.997
  capitalInvested: 150000, // R$ 150.000
} as const;

// Responsive design utilities
export const responsive = {
  // Mobile-first breakpoint helpers
  mobile: `@media (max-width: ${theme.breakpoints.md})`,
  tablet: `@media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`,
  desktop: `@media (min-width: ${theme.breakpoints.lg})`,

  // Container max widths
  maxWidth: {
    content: '1200px',
    prose: '65ch',
    presentation: '1400px',
  },
} as const;

export default theme;
