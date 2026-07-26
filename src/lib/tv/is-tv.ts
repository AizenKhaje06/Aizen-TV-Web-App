/**
 * TV device detection utilities
 * Detects Android TV, Google TV, TV browsers, and WebView environments
 */

/**
 * Check if running on Android TV or Google TV
 */
export function isTVDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Check user agent for TV identifiers
  const ua = navigator.userAgent.toLowerCase();
  const tvIdentifiers = [
    'tv',
    'googletv',
    'androidtv',
    'crkey', // Chromecast
    'smarttv',
    'nettv',
    'web0s', // LG webOS
    'tizen', // Samsung Tizen
  ];

  if (tvIdentifiers.some((id) => ua.includes(id))) {
    return true;
  }

  // Check screen size (TV is typically >= 720p)
  const { width, height } = window.screen;
  const isTVSize = width >= 1280 && height >= 720;

  // Check pointer capabilities (TV has no mouse or coarse touch)
  const hasNoPointer = window.matchMedia('(pointer: none)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // TV should have no pointer OR be large screen with coarse pointer
  return hasNoPointer || (isTVSize && !hasCoarsePointer && !isTouchDevice());
}

/**
 * Check if device has touch input
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/**
 * Check if running in Android WebView
 */
export function isWebView(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();

  // Check for WebView identifiers
  if (ua.includes('wv') || ua.includes('webview')) {
    return true;
  }

  // Check for Android WebView
  if (ua.includes('android') && !ua.includes('chrome')) {
    return true;
  }

  // Check for custom WebView interface
  return typeof window.Android !== 'undefined';
}

/**
 * Check if device is in landscape orientation
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return true;

  return window.innerWidth > window.innerHeight;
}

/**
 * Check if device has keyboard navigation
 */
export function hasKeyboardNavigation(): boolean {
  if (typeof window === 'undefined') return false;

  // TVs typically don't have physical keyboards but support D-pad navigation
  return isTVDevice() || !isTouchDevice();
}

/**
 * Get device type
 */
export function getDeviceType(): 'tv' | 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  if (isTVDevice()) return 'tv';

  const width = window.innerWidth;

  if (isTouchDevice()) {
    return width < 768 ? 'mobile' : 'tablet';
  }

  return 'desktop';
}

/**
 * Check if device should use TV mode
 * This is the main function to determine if TV UI should be enabled
 */
export function shouldUseTVMode(): boolean {
  return isTVDevice() || isWebView();
}
