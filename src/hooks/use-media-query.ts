import { useState, useEffect } from 'react';
import { isBrowser } from '@/lib/utils';

/**
 * Hook for responsive media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)');
}

export function useIsTV() {
  return useMediaQuery('(min-width: 1920px)');
}
