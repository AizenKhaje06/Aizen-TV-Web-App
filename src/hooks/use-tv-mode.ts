/**
 * TV Mode Hook
 * 
 * Provides access to TV mode state and utilities.
 * Detects TV devices and provides TV-specific functionality.
 */

'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { isTVDevice } from '@/lib/tv';

export function useTVMode() {
  const tvMode = useSettingsStore((state) => state.isTVMode);
  const setTVMode = useSettingsStore((state) => state.setTVMode);

  // Auto-detect TV mode on mount
  useEffect(() => {
    // Check for manual override in localStorage (for testing)
    const override = localStorage.getItem('tv-mode-override');
    if (override === 'true') {
      setTVMode(true);
      return;
    }
    if (override === 'false') {
      setTVMode(false);
      return;
    }

    // Auto-detect based on device
    const isTV = isTVDevice();
    if (isTV !== tvMode) {
      setTVMode(isTV);
    }
  }, [tvMode, setTVMode]);

  return {
    isTVMode: tvMode,
    setTVMode,
    /**
     * Enable TV mode manually (for testing)
     */
    enableTVMode: () => {
      localStorage.setItem('tv-mode-override', 'true');
      setTVMode(true);
    },
    /**
     * Disable TV mode manually (for testing)
     */
    disableTVMode: () => {
      localStorage.setItem('tv-mode-override', 'false');
      setTVMode(false);
    },
    /**
     * Clear manual override and use auto-detection
     */
    clearOverride: () => {
      localStorage.removeItem('tv-mode-override');
      setTVMode(isTVDevice());
    },
  };
}
