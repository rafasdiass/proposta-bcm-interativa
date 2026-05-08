import { createContext } from 'react';
import type { NavigationState, NavigationActions } from '../types';

// Context type
export interface NavigationContextType {
  state: NavigationState;
  actions: NavigationActions;
}

// Create context
export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);
