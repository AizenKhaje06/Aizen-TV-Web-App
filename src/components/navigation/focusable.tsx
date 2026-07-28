/**
 * Focusable Component
 * Wrapper component for elements that should be navigable via spatial navigation
 */

'use client';

import React, { forwardRef, useEffect } from 'react';
import { useFocusable } from '@/hooks/use-focusable';
import { NavigationRules, FocusableMetadata } from '@/lib/navigation/types';
import { cn } from '@/lib/cn';

interface FocusableProps {
  id: string;
  zoneId: string;
  zonePriority?: number;
  navigationRules?: NavigationRules;
  metadata?: FocusableMetadata;
  onFocusEnter?: () => void;
  onFocusLeave?: () => void;
  enabled?: boolean;
  className?: string;
  focusClassName?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any; // Allow any other props
}

export const Focusable = forwardRef<HTMLElement, FocusableProps>(
  (
    {
      id,
      zoneId,
      zonePriority = 0,
      navigationRules,
      metadata = {},
      onFocusEnter,
      onFocusLeave,
      enabled = true,
      className,
      focusClassName = 'ring-2 ring-cyan-400',
      children,
      as: Component = 'div',
      ...rest
    },
    forwardedRef
  ) => {
    const { ref } = useFocusable({
      id,
      zone: zoneId,
      priority: zonePriority,
      navigationRules,
      metadata,
      onFocusEnter,
      onFocusLeave,
      enabled,
    });

    const [focused, setFocused] = React.useState(false);

    // Track focus state for styling
    useEffect(() => {
      if (!ref.current) return;

      const element = ref.current;

      const handleFocus = () => setFocused(true);
      const handleBlur = () => setFocused(false);

      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);

      return () => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
      };
    }, [ref]);

    // Merge refs
    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(ref.current);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = ref.current;
      }
    }, [forwardedRef, ref]);

    return React.createElement(
      Component,
      {
        ref,
        tabIndex: enabled ? 0 : -1,
        'data-zone': zoneId,
        'data-nav-up': navigationRules?.up || undefined,
        'data-nav-down': navigationRules?.down || undefined,
        'data-nav-left': navigationRules?.left || undefined,
        'data-nav-right': navigationRules?.right || undefined,
        className: cn(
          className,
          focused && focusClassName,
          'focus:outline-none transition-all duration-200'
        ),
        ...rest,
      },
      children
    );
  }
);

Focusable.displayName = 'Focusable';
