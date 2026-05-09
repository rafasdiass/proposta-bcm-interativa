import { forwardRef, type ReactNode, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/utils';
import { sectionVariants } from '@/styles/theme';
import type { SectionProps } from '@/types';
import { useReducedMotion, useAnimationQueue } from '@/hooks';

/**
 * Section Component
 *
 * Reusable section component with theme variants (light, dark, teal)
 * Provides proper semantic HTML structure with landmarks
 * Handles section visibility and focus management
 * Implements scroll-triggered animations with reduced motion support
 *
 * Requirements: 1.2, 1.4, 15.1, 16.1, 16.2, 16.4, 16.5
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      id,
      title,
      variant = 'light',
      children,
      showHeader = true,
      showFooter = true,
      className,
      style,
      tabIndex,
      'aria-hidden': ariaHidden,
    },
    ref
  ) => {
    const variantConfig = sectionVariants[variant];
    const prefersReducedMotion = useReducedMotion();
    const { startAnimation, endAnimation } = useAnimationQueue(`section-${id}`);

    // Define animation variants based on reduced motion preference
    const animationVariants: Variants = prefersReducedMotion
      ? {
          // Minimal animation for reduced motion
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
        }
      : {
          // Full animation for normal motion
          hidden: {
            opacity: 0,
            y: 20,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        };

    // Animation configuration
    const animationTransition = prefersReducedMotion
      ? { duration: 0.1 } // Very fast transition for reduced motion
      : {
          duration: 0.6,
          ease: 'easeOut' as const,
        };

    // Handle animation lifecycle for queue management
    useEffect(() => {
      if (!prefersReducedMotion) {
        // Request animation slot when component mounts
        startAnimation(() => {
          // Animation started
        });

        // Release animation slot after animation completes
        const timer = setTimeout(() => {
          endAnimation();
        }, 600); // Match animation duration

        return () => {
          clearTimeout(timer);
          endAnimation();
        };
      }

      // No cleanup needed for reduced motion
      return undefined;
    }, [prefersReducedMotion, startAnimation, endAnimation]);

    return (
      <motion.section
        ref={ref}
        id={id}
        className={cn(
          'min-h-screen w-full relative',
          'flex flex-col',
          'scroll-mt-28 md:scroll-mt-32', // Account for fixed navigation
          variantConfig.className,
          className
        )}
        style={{
          backgroundColor: variantConfig.background,
          color: variantConfig.text,
          ...style,
        }}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
        variants={animationVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          margin: '-10%',
          amount: 0.1, // Trigger when 10% of section is visible
        }}
        transition={animationTransition}
        aria-labelledby={showHeader ? `${id}-title` : undefined}
      >
        {/* Section Header */}
        {showHeader && (
          <header className="w-full py-3 px-4 sm:py-4 sm:px-6 border-b border-current/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h1
                  id={`${id}-title`}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate"
                >
                  {title}
                </h1>
              </div>
              <div className="text-xs sm:text-sm opacity-75 flex-shrink-0">
                BCM · LaVita Code
              </div>
            </div>
          </header>
        )}

        {/* Section Content */}
        <div className="flex-1 w-full relative" data-section-content>
          <div className="max-w-7xl mx-auto w-full px-4 pt-28 pb-28 sm:px-6 md:pt-32 md:pb-36 lg:px-8">
            {children}
          </div>
        </div>

        {/* Section Footer */}
        {showFooter && (
          <footer className="w-full py-3 px-4 sm:py-4 sm:px-6 border-t border-current/10">
            <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm opacity-75">
              Proposta de Parceria Estratégica · Confidencial
            </div>
          </footer>
        )}
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

/**
 * Section Container
 *
 * Wrapper component for sections that don't need the full Section component
 * Useful for custom layouts while maintaining consistent styling
 */
export const SectionContainer = forwardRef<
  HTMLDivElement,
  {
    id: string;
    variant?: 'light' | 'dark' | 'teal';
    className?: string;
    children: ReactNode;
  }
>(({ id, variant = 'light', className, children, ...props }, ref) => {
  const variantConfig = sectionVariants[variant];

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        'min-h-screen w-full relative',
        'scroll-mt-28 md:scroll-mt-32',
        variantConfig.className,
        className
      )}
      style={{
        backgroundColor: variantConfig.background,
        color: variantConfig.text,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

SectionContainer.displayName = 'SectionContainer';
