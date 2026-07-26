/**
 * Service Worker Update Hook
 * Detects and handles service worker updates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerUpdateState {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  updateServiceWorker: () => void;
  dismissUpdate: () => void;
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleControllerChange = () => {
      // Service worker has been updated and activated
      setIsUpdating(false);
      
      // Reload page to use new service worker
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Check for waiting service worker
    const checkForWaitingWorker = () => {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }

        // Listen for new service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is waiting
                setWaitingWorker(newWorker);
                setIsUpdateAvailable(true);
              }
            });
          }
        });
      });
    };

    checkForWaitingWorker();

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  /**
   * Update service worker
   */
  const updateServiceWorker = useCallback(() => {
    if (!waitingWorker) {
      return;
    }

    setIsUpdating(true);

    // Tell waiting worker to skip waiting and become active
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  /**
   * Dismiss update notification
   */
  const dismissUpdate = useCallback(() => {
    setIsUpdateAvailable(false);
  }, []);

  return {
    isUpdateAvailable,
    isUpdating,
    updateServiceWorker,
    dismissUpdate,
  };
}
