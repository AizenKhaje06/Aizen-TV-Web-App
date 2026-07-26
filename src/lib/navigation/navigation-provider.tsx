/**
 * Navigation Provider
 * React context provider for spatial navigation
 */

'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { SpatialNavigator } from './spatial-navigator';
import { NavigationContext as NavigationContextType, SpatialNavigatorConfig } from './types';
import { initializeZones } from './zones';

interface NavigationContextValue {
  navigator: SpatialNavigator;
  context: NavigationContextType;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

interface NavigationProviderProps {
  children: ReactNode;
  config?: SpatialNavigatorConfig;
}

export function NavigationProvider({ children, config }: NavigationProviderProps) {
  const navigatorRef = useRef<SpatialNavigator | null>(null);
  const [context, setContext] = React.useState<NavigationContextType>({
    currentFocus: null,
    previousFocus: null,
    focusHistory: [],
    activeZone: null,
    isNavigating: false,
  });

  // Initialize navigator on client-side only
  useEffect(() => {
    if (!navigatorRef.current && typeof window !== 'undefined') {
      navigatorRef.current = new SpatialNavigator(config);
      // Initialize all zones
      initializeZones(navigatorRef.current);

      // Subscribe to navigation changes
      const unsubscribe = navigatorRef.current.subscribe((newContext) => {
        setContext(newContext);
      });

      return () => {
        unsubscribe();
        navigatorRef.current?.destroy();
      };
    }
    return undefined;
  }, [config]);

  return (
    <NavigationContext.Provider
      value={navigatorRef.current ? { navigator: navigatorRef.current, context } : null}
    >
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access the spatial navigator
 * Returns null if navigator is not yet initialized
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  return context;
}

/**
 * Hook to access just the navigator instance
 * Returns null if navigator is not yet initialized
 */
export function useNavigator() {
  const context = useNavigation();
  return context?.navigator ?? null;
}

/**
 * Hook to access navigation context
 */
export function useNavigationContext() {
  const context = useNavigation();
  return context?.context ?? {
    currentFocus: null,
    previousFocus: null,
    focusHistory: [],
    activeZone: null,
    isNavigating: false,
  };
}
