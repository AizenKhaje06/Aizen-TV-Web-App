/**
 * PWA Install Prompt Hook
 * Handles beforeinstallprompt event and installation flow
 */

'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  isInstallable: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<boolean>;
  dismissPrompt: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault();

      // Store event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      // Store installed state in localStorage
      try {
        localStorage.setItem('pwa-installed', 'true');
      } catch (error) {
        console.error('Failed to save install state:', error);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Show install prompt
   */
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      // Show install prompt
      await deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      // Clear deferred prompt
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        setIsInstallable(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    }
  };

  /**
   * Dismiss install prompt
   */
  const dismissPrompt = () => {
    setIsInstallable(false);

    // Store dismissed state (don't show again for 7 days)
    try {
      const dismissedUntil = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      localStorage.setItem('pwa-prompt-dismissed', dismissedUntil.toString());
    } catch (error) {
      console.error('Failed to save dismiss state:', error);
    }
  };

  // Check if prompt was recently dismissed
  useEffect(() => {
    try {
      const dismissedUntil = localStorage.getItem('pwa-prompt-dismissed');
      if (dismissedUntil) {
        const timestamp = parseInt(dismissedUntil, 10);
        if (Date.now() < timestamp) {
          setIsInstallable(false);
        }
      }
    } catch (error) {
      // Ignore localStorage errors
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    dismissPrompt,
  };
}
