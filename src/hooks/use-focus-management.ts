import { useEffect, useRef, RefObject } from 'react';
import { useSettingsStore } from '@/store/settings-store';

interface UseFocusManagementOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

/**
 * Hook for managing focus in TV mode
 */
export function useFocusManagement<T extends HTMLElement>(
  options: UseFocusManagementOptions = {}
): RefObject<T> {
  const { autoFocus = false, restoreFocus = false } = options;
  const ref = useRef<T>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const isTVMode = useSettingsStore((state) => state.isTVMode);

  useEffect(() => {
    if (!isTVMode) return;

    if (autoFocus && ref.current) {
      previousFocus.current = document.activeElement as HTMLElement;
      ref.current.focus();
    }

    return () => {
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [autoFocus, restoreFocus, isTVMode]);

  return ref;
}

/**
 * Hook for trapping focus within a container
 */
export function useFocusTrap<T extends HTMLElement>(enabled: boolean = true): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const container = ref.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  return ref;
}
