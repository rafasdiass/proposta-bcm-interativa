import { useNavigation } from '../contexts';

/**
 * Hook to get current mode information for conditional rendering
 */
export function useModeToggle() {
  const { state, actions } = useNavigation();

  return {
    currentMode: state.mode,
    isLandingMode: state.mode === 'landing',
    isPresentationMode: state.mode === 'presentation',
    isTransitioning: state.isTransitioning,
    setMode: actions.setMode,
    toggleMode: () => {
      const newMode = state.mode === 'landing' ? 'presentation' : 'landing';
      actions.setMode(newMode);
    },
  };
}
