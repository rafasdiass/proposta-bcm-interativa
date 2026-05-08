import { Suspense, useRef, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigation } from '@/contexts/useNavigation';
import { sectionConfigs } from '@/data/sections';
import { Section } from './Section';
import { SectionSkeleton } from './SectionSkeleton';
import { SectionErrorFallback } from './SectionErrorFallback';
import { logComponentError } from '@/utils/errorLogging';

/**
 * SectionRenderer Component
 *
 * Dynamically renders all 22 sections of the proposal
 * Handles section visibility and focus management
 * Provides error boundaries and loading states
 *
 * Requirements: 1.2, 1.4, 15.1, Task 11.2
 */
export function SectionRenderer() {
  const { state, actions } = useNavigation();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize section refs array
  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sectionConfigs.length);
  }, []);

  // Handle section visibility in presentation mode
  useEffect(() => {
    if (
      state.mode === 'presentation' &&
      sectionRefs.current[state.currentSection]
    ) {
      const currentSectionElement = sectionRefs.current[state.currentSection];
      if (currentSectionElement) {
        // Focus the current section for accessibility
        currentSectionElement.focus({ preventScroll: true });

        // Scroll to section if needed
        currentSectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [state.currentSection, state.mode]);

  // Intersection Observer for landing mode progress tracking
  useEffect(() => {
    if (state.mode !== 'landing') return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.current.findIndex(
              ref => ref === entry.target
            );
            if (sectionIndex !== -1 && sectionIndex !== state.currentSection) {
              // Update current section without triggering navigation
              const progress = sectionIndex / (sectionConfigs.length - 1);
              actions.updateProgress(progress);
            }
          }
        });
      },
      {
        threshold: 0.5, // Section is considered "current" when 50% visible
        rootMargin: '-10% 0px -10% 0px', // Add some margin for better UX
      }
    );

    // Observe all sections
    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [state.mode, state.currentSection, actions]);

  return (
    <div
      className={`
        ${
          state.mode === 'presentation'
            ? 'h-screen overflow-hidden'
            : 'min-h-screen'
        }
      `}
    >
      {sectionConfigs.map((sectionConfig, index) => {
        const SectionComponent = sectionConfig.component;

        return (
          <ErrorBoundary
            key={sectionConfig.id}
            FallbackComponent={({ error, resetErrorBoundary }) => (
              <SectionErrorFallback
                error={error as Error}
                resetErrorBoundary={resetErrorBoundary}
                sectionTitle={sectionConfig.title}
                sectionId={sectionConfig.id}
              />
            )}
            onError={(error, info) => {
              logComponentError(
                error instanceof Error ? error : new Error(String(error)),
                info,
                {
                  boundary: 'SectionRenderer',
                  sectionId: sectionConfig.id,
                  sectionTitle: sectionConfig.title,
                  sectionIndex: index,
                }
              );
            }}
            onReset={() => {
              // Optionally reload the section or take other recovery actions
              console.log(`Resetting error for section: ${sectionConfig.id}`);
            }}
          >
            <Section
              ref={el => {
                sectionRefs.current[index] = el;
              }}
              id={sectionConfig.id}
              title={sectionConfig.title}
              variant={sectionConfig.variant}
              showHeader={sectionConfig.showHeader}
              showFooter={sectionConfig.showFooter}
              className={`
                ${
                  state.mode === 'presentation'
                    ? index === state.currentSection
                      ? 'block'
                      : 'hidden'
                    : 'block'
                }
              `}
              tabIndex={state.mode === 'presentation' ? 0 : -1}
              aria-hidden={
                state.mode === 'presentation'
                  ? index !== state.currentSection
                  : false
              }
            >
              <Suspense fallback={<SectionSkeleton />}>
                <SectionComponent />
              </Suspense>
            </Section>
          </ErrorBoundary>
        );
      })}
    </div>
  );
}

/**
 * SectionNavigation Component
 *
 * Provides navigation controls for presentation mode
 */
export function SectionNavigation() {
  const { state, actions } = useNavigation();

  if (state.mode !== 'presentation') return null;

  const currentSection = sectionConfigs[state.currentSection];
  const isFirstSection = state.currentSection === 0;
  const isLastSection = state.currentSection === sectionConfigs.length - 1;

  return (
    <nav
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      aria-label="Navegação entre seções"
    >
      <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <button
          onClick={actions.previousSection}
          disabled={isFirstSection}
          className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          aria-label="Seção anterior"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-sm font-medium text-gray-700 min-w-0">
          <div className="truncate max-w-xs">{currentSection?.title}</div>
          <div className="text-xs text-gray-500 text-center">
            {state.currentSection + 1} de {sectionConfigs.length}
          </div>
        </div>

        <button
          onClick={actions.nextSection}
          disabled={isLastSection}
          className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          aria-label="Próxima seção"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
