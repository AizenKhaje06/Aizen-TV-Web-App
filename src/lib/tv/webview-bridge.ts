/**
 * Android WebView bridge interface
 * Enables communication between React app and native Android TV wrapper
 */

export interface AndroidBridge {
  // Navigation
  onBackPressed(): boolean;

  // Lifecycle
  onPause(): void;
  onResume(): void;
  onDestroy(): void;

  // Device info
  getDeviceInfo(): {
    model: string;
    manufacturer: string;
    androidVersion: number;
    isTV: boolean;
    hasKeyboard: boolean;
    hasTouchscreen: boolean;
  };

  // Display
  getDisplayMetrics(): {
    width: number;
    height: number;
    density: number;
    densityDpi: number;
  };

  // App info
  getAppVersion(): string;

  // Storage
  setPreference(key: string, value: string): void;
  getPreference(key: string): string | null;
  removePreference(key: string): void;

  // Network
  isNetworkAvailable(): boolean;
  getNetworkType(): 'wifi' | 'mobile' | 'none';

  // Toast/Notifications
  showToast(message: string, duration?: 'short' | 'long'): void;

  // Intent/Deep linking
  openExternalUrl(url: string): void;
  shareContent(title: string, text: string, url?: string): void;
}

/**
 * Extend Window interface for Android bridge
 */
declare global {
  interface Window {
    Android?: AndroidBridge;
  }
}

/**
 * WebView manager class
 */
class WebViewBridgeManager {
  private bridge: AndroidBridge | null = null;
  private backHandlers: Array<() => boolean> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.bridge = window.Android || null;
      this.setupEventListeners();
    }
  }

  /**
   * Check if running in Android WebView
   */
  isWebView(): boolean {
    return this.bridge !== null;
  }

  /**
   * Get Android bridge (if available)
   */
  getBridge(): AndroidBridge | null {
    return this.bridge;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle browser back button
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.handleBackPress();
      });
    }
  }

  /**
   * Register back button handler
   */
  registerBackHandler(handler: () => boolean): () => void {
    this.backHandlers.push(handler);

    // Return unregister function
    return () => {
      const index = this.backHandlers.indexOf(handler);
      if (index > -1) {
        this.backHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Handle back button press
   */
  handleBackPress(): boolean {
    // Call handlers in reverse order (most recent first)
    for (let i = this.backHandlers.length - 1; i >= 0; i--) {
      const handled = this.backHandlers[i]();
      if (handled) {
        return true;
      }
    }

    // If no handler handled it, let Android handle it
    return false;
  }

  /**
   * Get device information
   */
  getDeviceInfo() {
    if (this.bridge) {
      return this.bridge.getDeviceInfo();
    }

    // Fallback browser info
    return {
      model: 'Browser',
      manufacturer: 'Unknown',
      androidVersion: 0,
      isTV: false,
      hasKeyboard: true,
      hasTouchscreen: true,
    };
  }

  /**
   * Get display metrics
   */
  getDisplayMetrics() {
    if (this.bridge) {
      return this.bridge.getDisplayMetrics();
    }

    // Fallback browser metrics
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      density: window.devicePixelRatio || 1,
      densityDpi: window.devicePixelRatio * 160 || 160,
    };
  }

  /**
   * Check network availability
   */
  isNetworkAvailable(): boolean {
    if (this.bridge) {
      return this.bridge.isNetworkAvailable();
    }

    // Fallback browser check
    return navigator.onLine;
  }

  /**
   * Get network type
   */
  getNetworkType(): 'wifi' | 'mobile' | 'none' {
    if (this.bridge) {
      return this.bridge.getNetworkType();
    }

    // Fallback browser check
    // @ts-ignore - connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!navigator.onLine) return 'none';

    if (connection) {
      const type = connection.effectiveType;
      if (type === '4g' || type === '3g' || type === '2g') return 'mobile';
    }

    return 'wifi'; // Assume wifi by default
  }

  /**
   * Show toast message (Android) or fallback alert
   */
  showToast(message: string, duration: 'short' | 'long' = 'short'): void {
    if (this.bridge) {
      this.bridge.showToast(message, duration);
    } else {
      // Fallback: console log (or you could implement a custom toast UI)
      console.log(`[Toast] ${message}`);
    }
  }

  /**
   * Save preference
   */
  setPreference(key: string, value: string): void {
    if (this.bridge) {
      this.bridge.setPreference(key, value);
    } else {
      // Fallback: localStorage
      try {
        localStorage.setItem(`pref_${key}`, value);
      } catch (error) {
        console.error('Failed to save preference:', error);
      }
    }
  }

  /**
   * Get preference
   */
  getPreference(key: string): string | null {
    if (this.bridge) {
      return this.bridge.getPreference(key);
    } else {
      // Fallback: localStorage
      try {
        return localStorage.getItem(`pref_${key}`);
      } catch (error) {
        console.error('Failed to get preference:', error);
        return null;
      }
    }
  }

  /**
   * Remove preference
   */
  removePreference(key: string): void {
    if (this.bridge) {
      this.bridge.removePreference(key);
    } else {
      // Fallback: localStorage
      try {
        localStorage.removeItem(`pref_${key}`);
      } catch (error) {
        console.error('Failed to remove preference:', error);
      }
    }
  }

  /**
   * Open external URL
   */
  openExternalUrl(url: string): void {
    if (this.bridge) {
      this.bridge.openExternalUrl(url);
    } else {
      // Fallback: window.open
      window.open(url, '_blank');
    }
  }

  /**
   * Share content
   */
  shareContent(title: string, text: string, url?: string): void {
    if (this.bridge) {
      this.bridge.shareContent(title, text, url);
    } else {
      // Fallback: Web Share API or clipboard
      if (navigator.share) {
        navigator
          .share({
            title,
            text,
            url,
          })
          .catch((error) => console.log('Error sharing:', error));
      } else {
        // Copy to clipboard as fallback
        const shareText = `${title}\n${text}${url ? `\n${url}` : ''}`;
        navigator.clipboard
          .writeText(shareText)
          .then(() => console.log('Copied to clipboard'))
          .catch((error) => console.error('Failed to copy:', error));
      }
    }
  }

  /**
   * Notify Android of app lifecycle events
   */
  notifyPause(): void {
    if (this.bridge) {
      this.bridge.onPause();
    }
  }

  notifyResume(): void {
    if (this.bridge) {
      this.bridge.onResume();
    }
  }

  notifyDestroy(): void {
    if (this.bridge) {
      this.bridge.onDestroy();
    }
  }
}

// Singleton instance
export const webViewBridge = new WebViewBridgeManager();

/**
 * Expose back handler to Android
 * Android will call this function when hardware back button is pressed
 */
if (typeof window !== 'undefined') {
  (window as any).handleAndroidBackPress = () => {
    return webViewBridge.handleBackPress();
  };
}

/**
 * Setup lifecycle event listeners
 */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      webViewBridge.notifyPause();
    } else {
      webViewBridge.notifyResume();
    }
  });

  window.addEventListener('beforeunload', () => {
    webViewBridge.notifyDestroy();
  });
}
