/**
 * TV Layout Provider
 * 
 * Wraps the application with TV-specific providers.
 * Always renders TVFocusProvider, which handles TV mode detection internally.
 */

'use client';

import { ReactNode } from 'react';
import { TVFocusProvider } from './focus/tv-focus-provider';

interface TVLayoutProviderProps {
  children: ReactNode;
}

export function TVLayoutProvider({ children }: TVLayoutProviderProps) {
  // Always render TVFocusProvider - it will handle TV mode detection internally
  // This ensures the remote control system is initialized when TV mode is detected
  return (
    <TVFocusProvider>
      {children}
    </TVFocusProvider>
  );
}
