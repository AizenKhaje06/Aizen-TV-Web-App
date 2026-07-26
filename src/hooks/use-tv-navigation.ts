import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { TV_NAVIGATION } from '@/lib/constants';

interface UseTVNavigationOptions {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
  enabled?: boolean;
}

/**
 * Hook for TV remote navigation
 */
export function useTVNavigation({
  onUp,
  onDown,
  onLeft,
  onRight,
  onEnter,
  onBack,
  enabled = true,
}: UseTVNavigationOptions = {}) {
  const isTVMode = useSettingsStore((state) => state.isTVMode);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !isTVMode) return;

      const { UP, DOWN, LEFT, RIGHT, ENTER, BACK } = TV_NAVIGATION.KEYS;

      switch (event.key) {
        case UP:
          event.preventDefault();
          onUp?.();
          break;
        case DOWN:
          event.preventDefault();
          onDown?.();
          break;
        case LEFT:
          event.preventDefault();
          onLeft?.();
          break;
        case RIGHT:
          event.preventDefault();
          onRight?.();
          break;
        case ENTER:
          event.preventDefault();
          onEnter?.();
          break;
        case BACK:
          event.preventDefault();
          onBack?.();
          break;
      }
    },
    [enabled, isTVMode, onUp, onDown, onLeft, onRight, onEnter, onBack]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { isTVMode };
}
