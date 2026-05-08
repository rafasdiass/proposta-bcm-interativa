import { useContext } from 'react';
import {
  NavigationContext,
  type NavigationContextType,
} from './NavigationTypes';

// Custom hook to use navigation context
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }

  return context;
}
