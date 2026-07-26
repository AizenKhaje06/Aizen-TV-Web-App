/**
 * TV utilities index
 * Central export for all TV-related utilities
 */

// Device detection
export {
  isTVDevice,
  isTouchDevice,
  isWebView,
  isLandscape,
  hasKeyboardNavigation,
  getDeviceType,
  shouldUseTVMode,
} from './is-tv';

// Device capabilities
export {
  getDeviceCapabilities,
  isLowEndDevice,
  getRecommendedAnimationLevel,
  getRecommendedImageQuality,
  shouldOptimizePerformance,
  type DeviceCapabilities,
} from './device-capabilities';

// Focus management
export {
  getFocusableElements,
  getFocusGroupElements,
  findNextFocusableElement,
  moveFocus,
  focusFirst,
  focusLast,
  restoreFocus,
  trapFocus,
  getFocusIndex,
  focusByIndex,
  clearFocus,
  focusHistory,
  type FocusDirection,
  type FocusableElement,
} from './focus-manager';

// Remote control
export {
  remoteControl,
  registerRemoteHandlers,
  handleBackButton,
  handleSelectButton,
  startRemoteControl,
  stopRemoteControl,
  type RemoteKey,
  type RemoteEvent,
  type RemoteEventHandler,
} from './remote-handler';

// WebView bridge
export {
  webViewBridge,
  type AndroidBridge,
} from './webview-bridge';
