import { Suspense, useRef, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigation } from '@/contexts/useNavigation';
import { getPageSections, proposalPages } from '@/data/pages';
import { Section } from './Section';
import { SectionSkeleton } from './SectionSkeleton';
import { SectionErrorFallback } from './SectionErrorFallback';
import { logComponentError } from '@/utils/errorLogging';

/**
 * SectionRenderer Component
 *
 * Dynamically renders proposal pages, each grouping related sections.
 * Handles page visibility and focus management.
 * Provides error boundaries and loading states
 *
 * Requirements: 1.2, 1.4, 15.1, Task 11.2
 */
export function SectionRenderer() {
  const { state, actions } = useNavigation();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const activePage = proposalPages[state.currentSection] ?? proposalPages[0];
  const activeSections = getPageSections(activePage);

  // Initialize section refs array
  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, proposalPages.length);
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
              // Update current page without triggering navigation.
              const progress = sectionIndex / (proposalPages.length - 1);
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
    <div className="min-h-screen">
      <Section
        ref={el => {
          sectionRefs.current[state.currentSection] = el;
        }}
        id={activePage.slug}
        title={activePage.title}
        variant={activePage.variant}
        showHeader={false}
        showFooter={false}
        tabIndex={-1}
      >
        <div className="mb-12 w-full max-w-4xl">
          <h1
            className={
              activePage.variant === 'light'
                ? 'mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-white'
                : 'mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-white'
            }
          >
            {activePage.title}
          </h1>
          <p
            className={
              activePage.variant === 'light'
                ? 'prose-measure mt-4 text-lg md:text-xl text-slate-300 leading-relaxed'
                : 'prose-measure mt-4 text-lg md:text-xl text-white/80 leading-relaxed'
            }
          >
            {activePage.subtitle}
          </p>
        </div>

        <div className="space-y-32">
          {activeSections.map(sectionConfig => {
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
                      sectionIndex: sectionConfig.order,
                    }
                  );
                }}
              >
                <article id={sectionConfig.slug} className="scroll-mt-32">
                  <Suspense fallback={<SectionSkeleton />}>
                    <SectionComponent />
                  </Suspense>
                </article>
              </ErrorBoundary>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

