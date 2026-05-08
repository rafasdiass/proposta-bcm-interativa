import {} from 'react';
import { Monitor, Scroll } from 'lucide-react';
import { useNavigation } from '../../contexts';

/**
 * ModeToggle Component
 *
 * Allows users to switch between landing mode (continuous scrolling) and
 * presentation mode (slide-by-slide navigation). Preserves current section
 * position across mode changes and includes full keyboard accessibility.
 *
 * Requirements: 2.3, 15.2, 15.5
 */

interface ModeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show labels alongside icons */
  showLabels?: boolean;
  /** Compact mode (icon only) */
  compact?: boolean;
}

export function ModeToggle({
  className = '',
  size = 'md',
  showLabels = true,
  compact = false,
}: ModeToggleProps) {
  const { state, actions } = useNavigation();

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      button: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-3',
    },
  };

  const config = sizeConfig[size];

  const handleModeChange = (newMode: 'landing' | 'presentation') => {
    // Only change mode if it's different from current
    if (state.mode !== newMode) {
      actions.setMode(newMode);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    targetMode: 'landing' | 'presentation'
  ) => {
    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleModeChange(targetMode);
    }
  };

  // Base button classes
  const baseButtonClasses = `
    ${config.button}
    ${config.gap}
    inline-flex items-center justify-center
    font-medium rounded-lg
    border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none
  `;

  // Get active button classes
  const getButtonClasses = (
    _mode: 'landing' | 'presentation',
    isActive: boolean
  ) => {
    const activeClasses = isActive
      ? `
        bg-blue-600 border-blue-600 text-white
        hover:bg-blue-700 hover:border-blue-700
        focus:ring-blue-500
        shadow-md
      `
      : `
        bg-white border-gray-300 text-gray-700
        hover:bg-gray-50 hover:border-gray-400
        focus:ring-blue-500
      `;

    return `${baseButtonClasses} ${activeClasses}`.trim();
  };

  // Compact mode (single toggle button)
  if (compact) {
    const currentMode = state.mode;
    const nextMode = currentMode === 'landing' ? 'presentation' : 'landing';
    const Icon = currentMode === 'landing' ? Monitor : Scroll;

    return (
      <button
        onClick={() => handleModeChange(nextMode)}
        onKeyDown={e => handleKeyDown(e, nextMode)}
        className={`
          ${baseButtonClasses}
          bg-white border-gray-300 text-gray-700
          hover:bg-gray-50 hover:border-gray-400
          focus:ring-blue-500
          ${className}
        `}
        aria-label={`Alternar para modo ${nextMode === 'landing' ? 'rolagem contínua' : 'apresentação'}`}
        aria-pressed={false}
        title={`Alternar para modo ${nextMode === 'landing' ? 'rolagem contínua' : 'apresentação'}`}
      >
        <Icon className={config.icon} aria-hidden="true" />
        {showLabels && (
          <span className="sr-only sm:not-sr-only">
            {nextMode === 'landing' ? 'Rolagem' : 'Apresentação'}
          </span>
        )}
      </button>
    );
  }

  // Full toggle group (default)
  return (
    <div
      className={`inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1 ${className}`}
      role="group"
      aria-label="Modo de navegação"
    >
      {/* Landing Mode Button */}
      <button
        onClick={() => handleModeChange('landing')}
        onKeyDown={e => handleKeyDown(e, 'landing')}
        className={getButtonClasses('landing', state.mode === 'landing')}
        aria-pressed={state.mode === 'landing'}
        aria-label="Modo rolagem contínua"
        title="Modo rolagem contínua - navegue rolando a página"
        disabled={state.isTransitioning}
      >
        <Scroll className={config.icon} aria-hidden="true" />
        {showLabels && <span>Rolagem</span>}
      </button>

      {/* Presentation Mode Button */}
      <button
        onClick={() => handleModeChange('presentation')}
        onKeyDown={e => handleKeyDown(e, 'presentation')}
        className={getButtonClasses(
          'presentation',
          state.mode === 'presentation'
        )}
        aria-pressed={state.mode === 'presentation'}
        aria-label="Modo apresentação"
        title="Modo apresentação - navegue slide por slide com teclado"
        disabled={state.isTransitioning}
      >
        <Monitor className={config.icon} aria-hidden="true" />
        {showLabels && <span>Apresentação</span>}
      </button>
    </div>
  );
}

/**
 * ModeToggleCompact - Convenience component for compact mode
 */
export function ModeToggleCompact(props: Omit<ModeToggleProps, 'compact'>) {
  return <ModeToggle {...props} compact={true} />;
}
