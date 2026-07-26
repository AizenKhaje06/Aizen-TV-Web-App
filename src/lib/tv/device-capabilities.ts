/**
 * Device capability detection
 * Determines what features and optimizations should be enabled
 */

import { isTVDevice, isTouchDevice, isWebView } from './is-tv';

export interface DeviceCapabilities {
  // Device type
  isTV: boolean;
  isTouch: boolean;
  isWebView: boolean;

  // Input methods
  hasRemote: boolean;
  hasKeyboard: boolean;
  hasMouse: boolean;
  hasGamepad: boolean;

  // Display
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  pixelRatio: number;

  // Performance
  hardwareConcurrency: number;
  memory?: number; // GB
  connection?: string;

  // Features
  supportsFullscreen: boolean;
  supportsServiceWorker: boolean;
  supportsLocalStorage: boolean;
}

/**
 * Detect all device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return getServerCapabilities();
  }

  const isTV = isTVDevice();
  const isTouch = isTouchDevice();
  const isWV = isWebView();

  return {
    // Device type
    isTV,
    isTouch,
    isWebView: isWV,

    // Input methods
    hasRemote: isTV,
    hasKeyboard: !isTouch || isTV,
    hasMouse: !isTouch && !isTV,
    hasGamepad: checkGamepadSupport(),

    // Display
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isLandscape: window.innerWidth > window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,

    // Performance
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    memory: getDeviceMemory(),
    connection: getConnectionType(),

    // Features
    supportsFullscreen: checkFullscreenSupport(),
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsLocalStorage: checkLocalStorageSupport(),
  };
}

/**
 * Get device memory in GB (if available)
 */
function getDeviceMemory(): number | undefined {
  // @ts-ignore - deviceMemory is experimental
  return navigator.deviceMemory;
}

/**
 * Get connection type
 */
function getConnectionType(): string | undefined {
  // @ts-ignore - connection is experimental
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return conn?.effectiveType;
}

/**
 * Check if fullscreen is supported
 */
function checkFullscreenSupport(): boolean {
  const doc = document.documentElement as any;
  return !!(
    doc.requestFullscreen ||
    doc.webkitRequestFullscreen ||
    doc.mozRequestFullScreen ||
    doc.msRequestFullscreen
  );
}

/**
 * Check if gamepad is supported
 */
function checkGamepadSupport(): boolean {
  return 'getGamepads' in navigator;
}

/**
 * Check if localStorage is supported
 */
function checkLocalStorageSupport(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Default capabilities for server-side rendering
 */
function getServerCapabilities(): DeviceCapabilities {
  return {
    isTV: false,
    isTouch: false,
    isWebView: false,
    hasRemote: false,
    hasKeyboard: true,
    hasMouse: true,
    hasGamepad: false,
    screenWidth: 1920,
    screenHeight: 1080,
    isLandscape: true,
    pixelRatio: 1,
    hardwareConcurrency: 4,
    supportsFullscreen: true,
    supportsServiceWorker: true,
    supportsLocalStorage: true,
  };
}

/**
 * Check if device is low-end (for performance optimizations)
 */
export function isLowEndDevice(): boolean {
  const caps = getDeviceCapabilities();

  // Check CPU cores
  if (caps.hardwareConcurrency <= 2) return true;

  // Check memory (if available)
  if (caps.memory && caps.memory <= 2) return true;

  // Check connection (if available)
  if (caps.connection === 'slow-2g' || caps.connection === '2g') return true;

  return false;
}

/**
 * Get recommended animation settings based on device
 */
export function getRecommendedAnimationLevel(): 'low' | 'medium' | 'high' {
  if (isLowEndDevice()) return 'low';

  const caps = getDeviceCapabilities();

  // TV devices should use medium animations
  if (caps.isTV) return 'medium';

  // High-end devices can use full animations
  if (caps.hardwareConcurrency >= 4) return 'high';

  return 'medium';
}

/**
 * Get recommended image quality based on device
 */
export function getRecommendedImageQuality(): 'low' | 'medium' | 'high' {
  const caps = getDeviceCapabilities();

  // Low-end or slow connection
  if (isLowEndDevice() || caps.connection === 'slow-2g' || caps.connection === '2g') {
    return 'low';
  }

  // TV devices should use high quality
  if (caps.isTV) return 'high';

  // Fast connection
  if (caps.connection === '4g' || !caps.connection) {
    return 'high';
  }

  return 'medium';
}

/**
 * Check if device should enable aggressive performance optimizations
 */
export function shouldOptimizePerformance(): boolean {
  return isLowEndDevice() || isTVDevice();
}
