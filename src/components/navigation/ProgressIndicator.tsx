import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigation } from '../../contexts/useNavigation';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { theme } from '../../styles/theme';

interface ProgressIndicatorProps {
  /** Array of section titles for navigation */
  sectionTitles?: string[];
  /** Whether to show section navigation controls */
  showNavigation?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * ProgressIndicator Component
 *
 * Shows reading progress in landing mode with scroll tracking and displays
 * current section indicator in presentation mode. Updates URL fragments
 * for bookmarkable positions and ensures accessibility compliance.
 *
 * Requirements: 2.5, 2.7, 15.1
 */
export function ProgressIndicator({
  sectionTitles = [],
  showNavigation = true,
  className = '',
}: ProgressIndicatorProps) {
  const { state, actions } = useNavigation();
  const { progress } = useScrollProgress({ enabled: state.mode === 'landing' });
  // Visibility state - starts true, managed by mode changes
  const [isVisible, setIsVisible] = useState(true);

  // Handle mode-specific visibility logic
  useEffect(() => {
    let timer: number | undefined;

    if (state.mode === 'presentation') {
      // In presentation mode, show initially then hide after delay
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      timer = window.setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } else {
      // In landing mode, always visible
      setIsVisible(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state.mode, state.currentSection]);

  // Show indicator on mouse movement in presentation mode
  useEffect(() => {
    if (state.mode !== 'presentation') return;

    const handleMouseMove = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.mode]);

  const handleSectionClick = (sectionIndex: number) => {
    actions.goToSection(sectionIndex);
  };

  const handlePreviousSection = () => {
    if (state.currentSection > 0) {
      actions.previousSection();
    }
  };

  const handleNextSection = () => {
    if (state.currentSection < state.totalSections - 1) {
      actions.nextSection();
    }
  };

  // Calculate progress percentage
  const progressPercentage =
    state.mode === 'landing'
      ? progress * 100
      : ((state.currentSection + 1) / state.totalSections) * 100;

  // Get current section title
  const currentSectionTitle =
    sectionTitles[state.currentSection] || `Seção ${state.currentSection + 1}`;

  if (state.mode === 'landing') {
    return (
      <div
        className={`fixed top-0 left-0 right-0 z-sticky bg-white/95 backdrop-blur-sm border-b border-gray-200 ${className}`}
        role="banner"
        aria-label="Indicador de progresso de leitura"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-teal-600"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={Math.round(progressPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso de leitura: ${Math.round(progressPercentage)}%`}
          />
        </div>

        {/* Section indicator */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-900">
              {currentSectionTitle}
            </span>
            <span className="text-xs text-gray-500">
              {state.currentSection + 1} de {state.totalSections}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% concluído
          </div>
        </div>

        {/* Section navigation dropdown (optional) */}
        {showNavigation && sectionTitles.length > 0 && (
          <div className="px-4 pb-2">
            <select
              value={state.currentSection}
              onChange={e => handleSectionClick(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Navegar para seção"
            >
              {sectionTitles.map((title, index) => (
                <option key={index} value={index}>
                  {index + 1}. {title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  // Presentation mode indicator
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-sticky ${className}`}
          role="navigation"
          aria-label="Controles de navegação da apresentação"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-6 py-3">
            <div className="flex items-center space-x-4">
              {/* Previous button */}
              <button
                onClick={handlePreviousSection}
                disabled={state.currentSection === 0}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Seção anterior"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              {/* Section indicator */}
              <div className="flex flex-col items-center min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate max-w-48">
                  {currentSectionTitle}
                </div>
                <div className="text-xs text-gray-500">
                  {state.currentSection + 1} de {state.totalSections}
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={handleNextSection}
                disabled={state.currentSection === state.totalSections - 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Próxima seção"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center mt-3 space-x-1">
              {Array.from({ length: state.totalSections }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === state.currentSection
                      ? 'bg-blue-600'
                      : index < state.currentSection
                        ? 'bg-teal-600'
                        : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para seção ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Compact version of ProgressIndicator for mobile devices
 */
export function ProgressIndicatorCompact({
  className = '',
}: Omit<ProgressIndicatorProps, 'showNavigation' | 'sectionTitles'>) {
  const { state } = useNavigation();
  const { progress } = useScrollProgress({ enabled: state.mode === 'landing' });

  const progressPercentage =
    state.mode === 'landing'
      ? progress * 100
      : ((state.currentSection + 1) / state.totalSections) * 100;

  if (state.mode === 'landing') {
    return (
      <div
        className={`fixed top-0 left-0 right-0 z-sticky bg-white/95 backdrop-blur-sm ${className}`}
        role="banner"
        aria-label="Indicador de progresso"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={Math.round(progressPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progressPercentage)}% concluído`}
          />
        </div>

        {/* Compact section info */}
        <div className="px-3 py-1 flex items-center justify-between text-xs">
          <span className="text-gray-900 font-medium truncate">
            {state.currentSection + 1}/{state.totalSections}
          </span>
          <span className="text-gray-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    );
  }

  // Presentation mode - minimal indicator
  return (
    <div
      className={`fixed bottom-4 right-4 z-sticky bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg ${className}`}
      role="status"
      aria-label="Posição na apresentação"
    >
      <div className="text-xs font-medium text-gray-900">
        {state.currentSection + 1}/{state.totalSections}
      </div>
    </div>
  );
}

export default ProgressIndicator;
