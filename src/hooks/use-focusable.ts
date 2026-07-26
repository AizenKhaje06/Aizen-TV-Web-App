/**
 * useFocusable Hook
 * Register an element with the spatial navigator
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNavigator } from '@/lib/navigation/navigation-provider';
import { FocusableElement, NavigationRules, FocusableMetadata } from '@/lib/navigation/types';

interface UseFocusableOptions {
  id: string;
  zone: string;
  priority?: number;
  navigationRules?: NavigationRules;
  metadata?: FocusableMetadata;
  onFocusEnter?: () => void;
  onFocusLeave?: () => void;
  enabled?: boolean;
}

export function useFocusable({
  id,
  zone,
  priority = 0,
  navigationRules,
  metadata = {},
  onFocusEnter,
  onFocusLeave,
  enabled = true,
}: UseFocusableOptions) {
  const navigator = useNavigator();
  const elementRef = useRef<HTMLElement | null>(null);
  const registeredRef = useRef(false);

  /**
   * Update element position in registry
   */
  const updatePosition = useCallback(() => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };

    navigator.register({
      id,
      element: elementRef.current,
      zone,
      position,
      priority,
      metadata,
      navigationRules,
      onFocusEnter,
      onFocusLeave,
    } as FocusableElement);

    registeredRef.current = true;
  }, [id, zone, priority, navigationRules, metadata, onFocusEnter, onFocusLeave, navigator]);

  /**
   * Register element
   */
  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    updatePosition();

    // Update position on resize/scroll
    const handleUpdate = () => updatePosition();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      if (registeredRef.current) {
        navigator.unregister(id);
        registeredRef.current = false;
      }
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [id, enabled, navigator, updatePosition]);

  /**
   * Focus this element programmatically
   */
  const focus = useCallback(() => {
    navigator.focusById(id);
  }, [navigator, id]);

  /**
   * Check if this element is currently focused
   */
  const isFocused = useCallback(() => {
    const context = navigator.getContext();
    return context.currentFocus === id;
  }, [navigator, id]);

  return {
    ref: elementRef,
    focus,
    isFocused,
  };
}
