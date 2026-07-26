/**
 * Online Status Hook
 * Tracks network connectivity status
 */

'use client';

import { useState, useEffect } from 'react';

interface OnlineStatusState {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOnlineStatus(): OnlineStatusState {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initialize with current status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);

      // Reset wasOffline after showing reconnection message
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    wasOffline,
  };
}
