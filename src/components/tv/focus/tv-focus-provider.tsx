'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { startRemoteControl, stopRemoteControl } from '@/lib/tv';
import { shouldUseTVMode } from '@/lib/tv';
import { useSettingsStore } from '@/store/settings-store';

interface FocusContextValue {
  isTVMode: boolean;
  focusedElement: HTMLElement | null;
  setFocusedElement: (element: HTMLElement | null) => void;
  registerFocusable: (element: HTMLElement) => () => void;
  unregisterFocusable: (element: HTMLElement) => void;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

interface TVFocusProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function TVFocusProvider({ children, enabled = true }: TVFocusProviderProps) {
  const [isTVMode, setIsTVMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusableElements] = useState<Set<HTMLElement>>(new Set());
  const setStoreTVMode = useSettingsStore((state) => state.setTVMode);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect TV mode on client
  useEffect(() => {
    if (!isClient) return;

    // Check for manual override in localStorage (for testing)
    let isTV = false;
    const override = localStorage.getItem('tv-mode-override');
    
    if (override === 'true') {
      isTV = true;
      console.log('[TVFocusProvider] TV mode override detected: true');
    } else if (override === 'false') {
      isTV = false;
      console.log('[TVFocusProvider] TV mode override detected: false');
    } else {
      // Auto-detect based on device
      isTV = enabled && shouldUseTVMode();
      console.log('[TVFocusProvider] Auto-detect TV mode:', isTV);
    }
    
    setIsTVMode(isTV);
    setStoreTVMode(isTV);

    if (isTV) {
      // Start remote control system
      startRemoteControl();

      // Add TV mode class to body
      document.body.classList.add('tv-mode');
      document.body.style.userSelect = 'none';

      console.log('[TVFocusProvider] TV mode enabled - remote control started');
    } else {
      console.log('[TVFocusProvider] TV mode disabled');
    }

    return () => {
      if (isTV) {
        stopRemoteControl();
        document.body.classList.remove('tv-mode');
        document.body.style.userSelect = '';
      }
    };
  }, [isClient, enabled, setStoreTVMode]);

  // Track focused element
  useEffect(() => {
    if (!isTVMode) return;

    const handleFocusChange = (event: FocusEvent) => {
      setFocusedElement(event.target as HTMLElement);
    };

    document.addEventListener('focus', handleFocusChange, true);

    return () => {
      document.removeEventListener('focus', handleFocusChange, true);
    };
  }, [isTVMode]);

  // Register focusable element
  const registerFocusable = useCallback((element: HTMLElement) => {
    focusableElements.add(element);

    return () => {
      focusableElements.delete(element);
    };
  }, [focusableElements]);

  // Unregister focusable element
  const unregisterFocusable = useCallback((element: HTMLElement) => {
    focusableElements.delete(element);
  }, [focusableElements]);

  const value: FocusContextValue = {
    isTVMode,
    focusedElement,
    setFocusedElement,
    registerFocusable,
    unregisterFocusable,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

/**
 * Hook to access TV focus context
 */
export function useTVFocus() {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error('useTVFocus must be used within TVFocusProvider');
  }

  return context;
}

/**
 * Hook to check if TV mode is enabled
 */
export function useIsTVMode() {
  const context = useContext(FocusContext);
  return context?.isTVMode ?? false;
}
