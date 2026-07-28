/**
 * Remote control event handler
 * Maps physical remote buttons to actions
 */

import { moveFocus, FocusDirection } from './focus-manager';

export type RemoteKey =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'select'
  | 'back'
  | 'play'
  | 'pause'
  | 'playPause'
  | 'fastForward'
  | 'rewind'
  | 'menu';

export interface RemoteEvent {
  key: RemoteKey;
  originalEvent: KeyboardEvent;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export type RemoteEventHandler = (event: RemoteEvent) => void | boolean;

/**
 * Remote control event manager
 */
class RemoteControlManager {
  private handlers: Map<RemoteKey, Set<RemoteEventHandler>> = new Map();
  private globalHandler: RemoteEventHandler | null = null;
  private isListening = false;

  /**
   * Map keyboard events to remote keys
   */
  private mapKeyToRemote(key: string): RemoteKey | null {
    const keyMap: Record<string, RemoteKey> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      Enter: 'select',
      Escape: 'back',
      Backspace: 'back',
      MediaPlay: 'play',
      MediaPause: 'pause',
      MediaPlayPause: 'playPause',
      MediaFastForward: 'fastForward',
      MediaRewind: 'rewind',
      // Additional mappings
      ' ': 'playPause', // Spacebar
      Menu: 'menu',
    };

    return keyMap[key] || null;
  }

  /**
   * Handle keyboard event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const remoteKey = this.mapKeyToRemote(event.key);

    if (!remoteKey) return;

    console.log('[RemoteControl] Key pressed:', event.key, '-> Remote key:', remoteKey);

    // Create remote event
    const remoteEvent: RemoteEvent = {
      key: remoteKey,
      originalEvent: event,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
    };

    // Call global handler first
    if (this.globalHandler) {
      const handled = this.globalHandler(remoteEvent);
      if (handled) {
        event.preventDefault();
        return;
      }
    }

    // Call specific handlers
    const handlers = this.handlers.get(remoteKey);
    if (handlers && handlers.size > 0) {
      let handled = false;
      handlers.forEach((handler) => {
        const result = handler(remoteEvent);
        if (result) handled = true;
      });
      if (handled) {
        event.preventDefault();
        return;
      }
    }

    // Default navigation behavior
    this.handleDefaultNavigation(remoteKey, event);
  };

  /**
   * Handle default navigation (if not handled by custom handlers)
   */
  private handleDefaultNavigation(key: RemoteKey, event: KeyboardEvent): void {
    const directionMap: Record<string, FocusDirection> = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    };

    const direction = directionMap[key];

    if (direction) {
      console.log('[RemoteControl] Attempting to move focus:', direction);
      const moved = moveFocus(direction);
      console.log('[RemoteControl] Focus moved:', moved);
      if (moved) {
        event.preventDefault();
      }
    }
  }

  /**
   * Start listening to remote events
   */
  start(): void {
    if (this.isListening) return;

    window.addEventListener('keydown', this.handleKeyDown);
    this.isListening = true;
    console.log('[RemoteControl] Remote control system started - listening for arrow keys');
  }

  /**
   * Stop listening to remote events
   */
  stop(): void {
    if (!this.isListening) return;

    window.removeEventListener('keydown', this.handleKeyDown);
    this.isListening = false;
  }

  /**
   * Register handler for specific remote key
   */
  on(key: RemoteKey, handler: RemoteEventHandler): () => void {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }

    this.handlers.get(key)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(key, handler);
    };
  }

  /**
   * Unregister handler
   */
  off(key: RemoteKey, handler: RemoteEventHandler): void {
    const handlers = this.handlers.get(key);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Set global handler (receives all events)
   */
  setGlobalHandler(handler: RemoteEventHandler | null): void {
    this.globalHandler = handler;
  }

  /**
   * Clear all handlers
   */
  clearHandlers(): void {
    this.handlers.clear();
    this.globalHandler = null;
  }
}

// Singleton instance
export const remoteControl = new RemoteControlManager();

/**
 * Register remote control handlers (for use in useEffect)
 * Returns cleanup function
 */
export function registerRemoteHandlers(
  key: RemoteKey | RemoteKey[],
  handler: RemoteEventHandler
): () => void {
  const keys = Array.isArray(key) ? key : [key];
  const unsubscribers = keys.map((k) => remoteControl.on(k, handler));

  // Return cleanup function
  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Handle back button navigation
 */
export function handleBackButton(callback?: () => boolean): () => void {
  const handler = (event: RemoteEvent): boolean => {
    if (callback) {
      const handled = callback();
      if (handled) {
        event.preventDefault();
        return true;
      }
    }
    return false;
  };

  return remoteControl.on('back', handler);
}

/**
 * Handle select/OK button
 */
export function handleSelectButton(callback: () => void): () => void {
  const handler = (event: RemoteEvent): void => {
    event.preventDefault();
    callback();
  };

  return remoteControl.on('select', handler);
}

/**
 * Start remote control system
 */
export function startRemoteControl(): void {
  remoteControl.start();
}

/**
 * Stop remote control system
 */
export function stopRemoteControl(): void {
  remoteControl.stop();
}
