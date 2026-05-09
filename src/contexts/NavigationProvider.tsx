import { useReducer, useEffect, useMemo, type ReactNode } from 'react';
import type { NavigationState, NavigationActions } from '../types';
import {
  NavigationContext,
  type NavigationContextType,
} from './NavigationTypes';
import {
  scrollToSection,
  parseSectionFromFragment,
  generateSectionFragment,
  getScrollBehavior,
} from '../utils/navigation';
import { proposalPages } from '../data/pages';

// Navigation action types
type NavigationAction =
  | { type: 'SET_MODE'; payload: 'landing' | 'presentation' }
  | { type: 'GO_TO_SECTION'; payload: number }
  | { type: 'NEXT_SECTION' }
  | { type: 'PREVIOUS_SECTION' }
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'SET_TOTAL_SECTIONS'; payload: number };

// Initial state
const initialState: NavigationState = {
  mode: 'landing',
  currentSection: 0,
  totalSections: proposalPages.length,
  isTransitioning: false,
};

// Navigation reducer
function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        isTransitioning: true,
      };

    case 'GO_TO_SECTION': {
      const targetSection = Math.max(
        0,
        Math.min(action.payload, state.totalSections - 1)
      );
      return {
        ...state,
        currentSection: targetSection,
        isTransitioning: true,
      };
    }

    case 'NEXT_SECTION':
      return {
        ...state,
        currentSection: Math.min(
          state.currentSection + 1,
          state.totalSections - 1
        ),
        isTransitioning: true,
      };

    case 'PREVIOUS_SECTION':
      return {
        ...state,
        currentSection: Math.max(state.currentSection - 1, 0),
        isTransitioning: true,
      };

    case 'UPDATE_PROGRESS': {
      // Update current section based on scroll progress (0-1)
      const sectionIndex = Math.floor(action.payload * state.totalSections);
      const clampedIndex = Math.max(
        0,
        Math.min(sectionIndex, state.totalSections - 1)
      );
      return {
        ...state,
        currentSection: clampedIndex,
      };
    }

    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
      };

    case 'SET_TOTAL_SECTIONS':
      return {
        ...state,
        totalSections: action.payload,
      };

    default:
      return state;
  }
}

// Provider props
interface NavigationProviderProps {
  children: ReactNode;
}

// Navigation provider component
export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  // Actions object - memoized to prevent unnecessary re-renders
  const actions: NavigationActions = useMemo(
    () => ({
      setMode: (mode: 'landing' | 'presentation') => {
        dispatch({ type: 'SET_MODE', payload: mode });
      },

      goToSection: (index: number) => {
        dispatch({ type: 'GO_TO_SECTION', payload: index });
      },

      nextSection: () => {
        dispatch({ type: 'NEXT_SECTION' });
      },

      previousSection: () => {
        dispatch({ type: 'PREVIOUS_SECTION' });
      },

      updateProgress: (progress: number) => {
        dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
      },
    }),
    []
  );

  // URL fragment management
  useEffect(() => {
    const updateURLFragment = () => {
      const sectionFragment = generateSectionFragment(state.currentSection);
      const currentFragment = window.location.hash.slice(1);

      if (currentFragment !== sectionFragment) {
        // Update URL without triggering a page reload
        window.history.replaceState(null, '', `#${sectionFragment}`);
      }
    };

    updateURLFragment();
  }, [state.currentSection]);

  // Handle URL fragment changes (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const sectionIndex = parseSectionFromFragment(hash);

      if (
        sectionIndex !== null &&
        sectionIndex >= 0 &&
        sectionIndex < state.totalSections
      ) {
        dispatch({ type: 'GO_TO_SECTION', payload: sectionIndex });

        // Scroll to section in landing mode
        if (state.mode === 'landing') {
          scrollToSection(sectionIndex, { behavior: getScrollBehavior() });
        }
      }
    };

    // Handle initial URL fragment on load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [state.totalSections, state.mode]);

  // Reset transitioning state after a short delay
  useEffect(() => {
    if (state.isTransitioning) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TRANSITIONING', payload: false });
      }, 300); // Match typical animation duration

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state.isTransitioning]);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard navigation in presentation mode
      if (state.mode !== 'presentation') return;

      // Prevent default behavior for navigation keys
      const navigationKeys = [
        'ArrowRight',
        'ArrowLeft',
        'PageDown',
        'PageUp',
        'Space',
        'Home',
        'End',
        'Escape',
      ];

      if (navigationKeys.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'ArrowRight':
        case 'PageDown':
        case 'Space':
          actions.nextSection();
          break;

        case 'ArrowLeft':
        case 'PageUp':
          actions.previousSection();
          break;

        case 'Home':
          actions.goToSection(0);
          break;

        case 'End':
          actions.goToSection(state.totalSections - 1);
          break;

        case 'Escape':
          actions.setMode('landing');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.mode, state.totalSections, actions]);

  const contextValue: NavigationContextType = {
    state,
    actions,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}
