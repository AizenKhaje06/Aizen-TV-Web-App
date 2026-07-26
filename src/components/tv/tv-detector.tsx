'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { isBrowser } from '@/lib/utils';

/**
 * Detect if the app is running on Android TV
 */
export function detectTVMode(): boolean {
  if (!isBrowser()) return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroidTV = userAgent.includes('android') && userAgent.includes('tv');
  const isWebOS = userAgent.includes('web0s');
  const isTizen = userAgent.includes('tizen');
  const isLargeScreen = window.innerWidth >= 1920;

  return isAndroidTV || isWebOS || isTizen || isLargeScreen;
}

/**
 * TV Mode Detector Component
 * Automatically detects and enables TV mode
 */
export function TVDetector() {
  const setTVMode = useSettingsStore((state) => state.setTVMode);

  useEffect(() => {
    const isTVMode = detectTVMode();
    setTVMode(isTVMode);
  }, [setTVMode]);

  return null;
}
