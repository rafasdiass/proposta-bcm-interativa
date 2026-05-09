/**
 * ComparisonTable Component
 *
 * Displays a two-column comparison showing the gains of entering now
 * versus the risks of waiting, with optional sequential animation.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Play } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ComparisonItem {
  id: string;
  text: string;
}

export interface ComparisonData {
  enterNow: ComparisonItem[];
  wait: ComparisonItem[];
}

export const defaultComparisonData: ComparisonData = {
  enterNow: [
    {
      id: 'first-partner',
      text: 'Primeiro parceiro clínico: molda o produto desde o início',
    },
    {
      id: 'shape-product',
      text: 'Poder de moldar o produto conforme necessidades do Gradual',
    },
    {
      id: 'founder-catalog',
      text: 'Catálogo fundador: OERA como protocolo prioritário',
    },
    {
      id: 'co-authorship',
      text: 'Coautoria em publicações científicas conjuntas',
    },
    {
      id: 'scientific-narrative',
      text: 'Narrativa científica construída em parceria',
    },
  ],
  wait: [
    {
      id: 'partner-occupied',
      text: 'Outro parceiro clínico ocupa a posição de fundador',
    },
    {
      id: 'catalog-taken',
      text: 'Outro catálogo de protocolos se torna fundador',
    },
    {
      id: 'client-entry',
      text: 'Entrada apenas como cliente, sem poder de moldar',
    },
    {
      id: 'window-closes',
      text: 'Janela de oportunidade de parceria estratégica fecha',
    },
    {
      id: 'reduced-influence',
      text: 'Poder de moldar o produto diminui significativamente',
    },
  ],
};

export interface ComparisonTableProps {
  /** Comparison data to display */
  data?: ComparisonData;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show animation controls */
  showAnimationControl?: boolean;
  /** Animation delay between items in milliseconds */
  animationDelay?: number;
}

/**
 * ComparisonTable component displays a two-column comparison layout
 */
export function ComparisonTable({
  data = defaultComparisonData,
  className = '',
  showAnimationControl = true,
  animationDelay = 200,
}: ComparisonTableProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  // Show all items immediately if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) {
      const allIds = [
        ...data.enterNow.map(item => item.id),
        ...data.wait.map(item => item.id),
      ];
      setVisibleItems(new Set(allIds));
      setHasAnimated(true);
    }
  }, [prefersReducedMotion, data]);

  // Sequential animation function
  const startAnimation = useCallback(() => {
    if (prefersReducedMotion || isAnimating) return;

    setIsAnimating(true);
    setVisibleItems(new Set());
    setHasAnimated(true);

    const allItems = [
      ...data.enterNow.map((item, index) => ({
        ...item,
        column: 'enter',
        index,
      })),
      ...data.wait.map((item, index) => ({ ...item, column: 'wait', index })),
    ];

    // Interleave items from both columns
    const interleavedItems: typeof allItems = [];
    const maxLength = Math.max(data.enterNow.length, data.wait.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < data.enterNow.length) {
        interleavedItems.push({
          ...data.enterNow[i],
          column: 'enter',
          index: i,
        });
      }
      if (i < data.wait.length) {
        interleavedItems.push({ ...data.wait[i], column: 'wait', index: i });
      }
    }

    // Reveal items sequentially
    interleavedItems.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, item.id]));

        // Mark animation as complete after last item
        if (index === interleavedItems.length - 1) {
          setIsAnimating(false);
        }
      }, index * animationDelay);
    });
  }, [data, animationDelay, prefersReducedMotion, isAnimating]);

  // Auto-start animation on mount if not reduced motion and control is hidden
  useEffect(() => {
    if (!showAnimationControl && !prefersReducedMotion && !hasAnimated) {
      startAnimation();
    }
  }, [showAnimationControl, prefersReducedMotion, hasAnimated, startAnimation]);

  const isItemVisible = (itemId: string) => {
    return (
      prefersReducedMotion || hasAnimated === false || visibleItems.has(itemId)
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Animation control */}
      {showAnimationControl && !prefersReducedMotion && (
        <div className="mb-4 sm:mb-6 flex justify-center">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="
              inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3
              bg-[#1B3A6B] text-white rounded-lg text-sm sm:text-base
              hover:bg-[#2D9B8A] transition-colors duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A6B]
              min-h-[44px] touch-manipulation
            "
            aria-label="Animar comparação"
            type="button"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="font-semibold">
              {isAnimating
                ? 'Animando...'
                : hasAnimated
                  ? 'Animar novamente'
                  : 'Animar comparação'}
            </span>
          </button>
        </div>
      )}

      {/* Comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Enter Now column */}
        <div className="bg-[#101F35] rounded-lg shadow-lg shadow-black/20 overflow-hidden border border-[#263A59] border-t-4 border-t-[#2D9B8A]">
          <div className="bg-[#09221F] px-4 py-3 sm:px-6 sm:py-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white text-center">
              Se o Gradual entra agora
            </h3>
          </div>

          <ul className="p-4 sm:p-6 space-y-3 sm:space-y-4" role="list">
            {data.enterNow.map((item, index) => (
              <li
                key={item.id}
                className={`
                  flex items-start gap-2 sm:gap-3 transition-all duration-500
                  ${
                    isItemVisible(item.id)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                  }
                `}
                style={{
                  transitionDelay: prefersReducedMotion
                    ? '0ms'
                    : `${index * 50}ms`,
                }}
              >
                <CheckCircle2
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D9B8A] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wait column */}
        <div className="bg-[#101F35] rounded-lg shadow-lg shadow-black/20 overflow-hidden border border-[#263A59] border-t-4 border-t-[#F5A623]">
          <div className="bg-[#3B2608] px-4 py-3 sm:px-6 sm:py-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white text-center">
              Se o Gradual espera
            </h3>
          </div>

          <ul className="p-4 sm:p-6 space-y-3 sm:space-y-4" role="list">
            {data.wait.map((item, index) => (
              <li
                key={item.id}
                className={`
                  flex items-start gap-2 sm:gap-3 transition-all duration-500
                  ${
                    isItemVisible(item.id)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4'
                  }
                `}
                style={{
                  transitionDelay: prefersReducedMotion
                    ? '0ms'
                    : `${index * 50}ms`,
                }}
              >
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#F5A623] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Screen reader announcement for animation state */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isAnimating && 'Animação em progresso'}
        {!isAnimating && hasAnimated && 'Animação concluída'}
      </div>
    </div>
  );
}

export default ComparisonTable;
