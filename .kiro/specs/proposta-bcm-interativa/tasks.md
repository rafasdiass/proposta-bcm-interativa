# Implementation Plan: Interactive BCM Proposal

## Overview

This implementation plan breaks down the Interactive BCM Proposal application into discrete, executable tasks. The application is a React + TypeScript web application that transforms a static business proposal into an engaging, interactive experience with dual navigation modes, interactive calculators, and conversion-optimized design elements.

The implementation follows a progressive approach: project setup → core navigation system → interactive components → content sections → form handling → testing → optimization. Each task builds incrementally to ensure a working application at every checkpoint.

## Tasks

1- [ ] 1. Project setup and configuration
  - [x] 1.1 Initialize React + TypeScript project with Vite
    - Create new Vite project with React + TypeScript template
    - Configure TypeScript with strict mode and path aliases
    - Set up project structure with organized directories (components, contexts, hooks, types, utils, styles, data)
    - _Requirements: 18.1, 18.2_

  - [x] 1.2 Configure Tailwind CSS with custom theme
    - Install and configure Tailwind CSS 3
    - Create custom theme with brand colors (#1B3A6B, #2D9B8A, #F5A623, #8B7EC8, #F8F9FA, #102642)
    - Set up responsive breakpoints and typography scales
    - Configure Tailwind purging for production builds
    - _Requirements: 1.1, 1.3, 14.2_

  - [x] 1.3 Install and configure core dependencies
    - Install Framer Motion for animations
    - Install Lucide React for icons
    - Install React Hook Form for form handling
    - Install date-fns for date/time utilities
    - Fix exact versions in package.json as specified
    - _Requirements: 16.1, 16.3, 18.5_

  - [x] 1.4 Set up development and build scripts
    - Configure package.json scripts (dev, build, preview, lint)
    - Set up ESLint and Prettier for code quality
    - Configure Vite for static asset handling (PDF in public directory)
    - Create basic README with installation and usage instructions
    - _Requirements: 18.1, 18.3, 18.4, 18.6_

- [ ] 2. Core navigation system implementation
  - [x] 2.1 Create navigation state management
    - Implement NavigationContext with useReducer for state management
    - Define NavigationState and NavigationActions interfaces
    - Handle mode switching between landing and presentation modes
    - Implement section navigation with URL fragment updates
    - _Requirements: 2.1, 2.2, 2.6, 2.7_

  - [x] 2.2 Build ModeToggle component
    - Create toggle component for switching between navigation modes
    - Implement keyboard accessibility with proper ARIA labels
    - Preserve current section position across mode changes
    - Style with Tailwind following design system
    - _Requirements: 2.3, 15.2, 15.5_

  - [x] 2.3 Implement ProgressIndicator component
    - Show reading progress in landing mode with scroll tracking
    - Display current section indicator in presentation mode
    - Update URL fragments for bookmarkable positions
    - Ensure accessibility with proper landmarks and labels
    - _Requirements: 2.5, 2.7, 15.1_

  - [x] 2.4 Create keyboard navigation system
    - Implement keyboard controls for presentation mode (Arrow keys, PageUp/Down, Space, Home, End, Esc)
    - Handle focus management and keyboard traps
    - Ensure all interactive elements are keyboard accessible
    - _Requirements: 2.4, 15.2_

- [ ] 3. Content section system
  - [x] 3.1 Build Section component and renderer
    - Create reusable Section component with theme variants (light, dark, teal)
    - Implement SectionRenderer for dynamic section loading
    - Handle section visibility and focus management
    - Add proper semantic HTML structure with landmarks
    - _Requirements: 1.2, 1.4, 15.1_

  - [x] 3.2 Create section configuration system
    - Define SectionConfig interface and data structure
    - Implement 22 sections based on original slide content
    - Configure section variants, headers, and footers
    - Set up section routing and deep linking
    - _Requirements: 1.2, 2.6_

  - [x] 3.3 Implement scroll-triggered animations
    - Add Framer Motion animations for section reveals in landing mode
    - Implement intersection observer for viewport detection
    - Respect prefers-reduced-motion user preference
    - Limit concurrent animations for performance
    - _Requirements: 16.1, 16.2, 16.4, 16.5_

- [ ] 4. Interactive components implementation
  - [x] 4.1 Build ROI Simulator component
    - Create ROI calculator with subscriber count, plan mix, and MRR multiple inputs
    - Implement real-time calculations with <100ms response time
    - Add pre-configured scenarios (breakeven, 1K subscribers, municipal contract, national presence)
    - Format currency values in BRL using Intl.NumberFormat
    - Include disclaimer text about projections
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.9, 17.1_

  - [x] 4.2 Write property test for ROI monotonicity
    - **Property 1: ROI Calculator Monotonicity**
    - **Validates: Requirements 4.7**

  - [x] 4.3 Write property test for ROI revenue sum consistency
    - **Property 2: ROI Revenue Sum Consistency**
    - **Validates: Requirements 4.8**

  - [x] 4.4 Build Softhouse Calculator component
    - Create calculator with monthly cost input and 25% discount calculation
    - Calculate and display monthly savings, annual savings, and payback years
    - Show reference examples (R$8,000/month and R$12,000/month scenarios)
    - Handle zero cost input gracefully
    - Format all monetary values in BRL
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7_

  - [x] 4.5 Write property test for Softhouse payback formula
    - **Property 3: Softhouse Payback Formula Correctness**
    - **Validates: Requirements 5.5**

  - [x] 4.6 Create Timeline component for tranches
    - Build interactive timeline with three tranche milestones
    - Display triggers and deliverables for each tranche
    - Implement hover/touch interactions for revealing details
    - Add progress indicator with color gradients
    - Ensure keyboard accessibility
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

  - [x] 4.7 Write property test for tranche sum invariant
    - **Property 4: Tranche Sum Invariant**
    - **Validates: Requirements 6.5**

  - [x] 4.8 Implement Countdown Timer component
    - Create real-time countdown to configurable deadline (default: May 22, 2026)
    - Display days, hours, minutes, and seconds
    - Update every second with proper cleanup
    - Change colors based on urgency (72-hour threshold)
    - Handle expired state gracefully
    - Respect reduced motion preferences
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

  - [x] 4.9 Write property test for countdown monotonic decrease
    - **Property 5: Countdown Timer Monotonic Decrease**
    - **Validates: Requirements 7.5**

- [x] 5. Checkpoint - Core functionality validation
  - Ensure all interactive components render correctly
  - Verify navigation system works in both modes
  - Test keyboard accessibility and screen reader compatibility
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. UI components and content sections
  - [x] 6.1 Create Module Cards component
    - Build 12 expandable cards for product modules
    - Implement toggle functionality with proper state management
    - Add keyboard navigation with Enter/Space keys
    - Expose proper ARIA attributes (aria-expanded)
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [x] 6.2 Write property test for module card toggle idempotence
    - **Property 6: Module Card Toggle Idempotence**
    - **Validates: Requirements 9.4**

  - [x] 6.3 Build Protocol Selector component
    - Create selector for BCM defaults vs Gradual preferred protocols
    - Implement group selection with visual highlighting
    - Add priority marking for OERA protocol
    - Support combination mode selection
    - Handle default state with appropriate messaging
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 6.4 Implement Objection Accordion component
    - Create FAQ-style accordion with 6 objection items
    - Implement single-item expansion behavior
    - Add keyboard navigation following WAI-ARIA Accordion pattern
    - Ensure proper focus management and ARIA attributes
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 6.5 Create comparison component "Enter now vs Wait"
    - Build two-column comparison layout
    - Implement optional sequential animation for item reveals
    - Respect prefers-reduced-motion preference
    - Ensure balanced visual presentation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Form handling and integrations
  - [x] 7.1 Build Intent Form component
    - Create form with required fields (name, email, role) and optional fields (phone, message)
    - Implement client-side validation with real-time feedback
    - Add LGPD compliance checkbox and consent handling
    - Style form with proper error states and accessibility
    - _Requirements: 13.1, 13.3, 13.5_

  - [x] 7.2 Implement form submission and error handling
    - Set up form submission to configurable endpoint
    - Handle network errors with retry mechanism
    - Provide mailto fallback for submission failures
    - Show loading states and success/error messages
    - _Requirements: 13.2, 13.4_

  - [x] 7.3 Create Sticky CTA component
    - Build fixed-position CTA bar with three primary actions
    - Implement responsive collapse for mobile viewports
    - Ensure WCAG AA contrast compliance
    - Handle PDF download and external scheduling link
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [x] 7.4 Implement PDF download functionality
    - Serve PDF as static asset with proper caching headers
    - Handle download initiation with proper filename
    - Implement fallback for mobile browsers (open in new tab)
    - Add error handling for missing PDF files
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 8. Currency formatting and localization
  - [x] 8.1 Implement BRL currency formatting utilities
    - Create formatting functions using Intl.NumberFormat with pt-BR locale
    - Handle large numbers with proper thousand separators
    - Format dates in dd/MM/yyyy pattern
    - Ensure consistent precision for key monetary values
    - _Requirements: 17.1, 17.2, 17.3, 17.5_

  - [x] 8.2 Write property test for currency formatting purity
    - **Property 7: Currency Formatting Purity**
    - **Validates: Requirements 17.4**

- [ ] 9. Responsive design and accessibility
  - [x] 9.1 Implement responsive layouts
    - Ensure usability across viewport widths (320px to 2560px)
    - Reorganize multi-column grids to single column on mobile
    - Optimize touch targets for mobile devices (minimum 44px)
    - Test compatibility with major browsers (Chrome, Firefox, Safari, Edge)
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 9.2 Enhance accessibility compliance
    - Implement proper semantic HTML structure with landmarks
    - Ensure WCAG AA contrast ratios throughout the application
    - Add comprehensive keyboard navigation support
    - Implement screen reader optimizations with proper ARIA labels
    - _Requirements: 15.1, 15.2, 15.3, 15.5_

  - [x] 9.3 Optimize performance and loading
    - Implement lazy loading for images with explicit dimensions
    - Add code splitting for heavy components
    - Optimize bundle size and implement caching strategies
    - Ensure First Contentful Paint under 2.5 seconds
    - _Requirements: 14.4, 14.5_

- [ ] 10. Testing implementation
  - [x] 10.1 Set up testing framework
    - Configure Vitest for unit testing
    - Set up React Testing Library for component testing
    - Install and configure fast-check for property-based testing
    - Create test utilities and helpers
    - _Requirements: All property tests from design document_

  - [x] 10.2 Write unit tests for interactive components
    - Test ROI Simulator edge cases and error conditions
    - Test Softhouse Calculator validation and formatting
    - Test Timeline component interactions
    - Test Countdown Timer state management
    - Test Module Cards expansion behavior
    - Test Form validation and submission flows

  - [x] 10.3 Write integration tests
    - Test navigation system mode switching
    - Test section routing and URL fragment updates
    - Test form submission end-to-end flows
    - Test responsive behavior across breakpoints

- [ ] 11. Environment configuration and deployment preparation
  - [x] 11.1 Set up environment configuration
    - Configure environment variables for API endpoints
    - Set up scheduling link and deadline configuration
    - Add analytics integration points (GA, Hotjar)
    - Create production build configuration
    - _Requirements: 13.2, 7.1_

  - [x] 11.2 Implement error boundaries and monitoring
    - Add React error boundaries for graceful failure handling
    - Implement client-side error logging
    - Add performance monitoring and analytics events
    - Create fallback UI components for error states
    - _Requirements: Error handling throughout application_

- [ ] 12. Final integration and optimization
  - [x] 12.1 Complete content integration
    - Integrate all 22 sections with proper content and styling
    - Ensure brand consistency across all components
    - Verify all interactive elements work correctly
    - Test all user journeys and conversion paths
    - _Requirements: 1.2, 1.5_

  - [x] 12.2 Performance optimization and final testing
    - Run performance audits and optimize bundle size
    - Test accessibility compliance with automated tools
    - Verify responsive design across all target devices
    - Conduct cross-browser compatibility testing
    - _Requirements: 14.3, 14.4, 15.3_

- [-] 13. Final checkpoint - Production readiness
  - Ensure all tests pass including property-based tests
  - Verify all requirements are implemented and working
  - Test deployment build and static asset serving
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties using fast-check
- Unit tests complement property tests by covering specific examples and edge cases
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation prioritizes conversion optimization and user experience
- All interactive components include accessibility considerations from the start
- Currency formatting and localization are handled consistently throughout the application