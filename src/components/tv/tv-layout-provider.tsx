/**
 * TV Layout Provider
 * 
 * Wraps the application with TV-specific providers when in TV mode.
 * Manages focus and remote control handling.
 */

'use client';

import { ReactNode } from 'react';
import { useTVMode } from '@/hooks/use-tv-mode';
import { TVFocusProvider } from './focus/tv-focus-provider';

interface TVLayoutProviderProps {
  children: ReactNode;
}

export function TVLayoutProvider({ children }: TVLayoutProviderProps) {
  const { isTVMode } = useTVMode();

  // If not in TV mode, just render children
  if (!isTVMode) {
    return <>{children}</>;
  }

  // In TV mode, wrap with focus provider
  return (
    <TVFocusProvider>
      <div className="tv-mode" data-tv-mode="true">
        {children}
      </div>
    </TVFocusProvider>
  );
}
