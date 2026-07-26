'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { TV_NAVIGATION } from '@/lib/constants';

interface FocusableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onEnter?: () => void;
  onBack?: () => void;
  autoFocus?: boolean;
  focusClassName?: string;
}

/**
 * Focusable Component
 * Wrapper for TV remote navigation
 */
export const Focusable = React.forwardRef<HTMLDivElement, FocusableProps>(
  (
    {
      children,
      onEnter,
      onBack,
      autoFocus = false,
      focusClassName,
      className,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || elementRef;

    useEffect(() => {
      if (autoFocus && combinedRef.current) {
        combinedRef.current.focus();
      }
    }, [autoFocus, combinedRef]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case TV_NAVIGATION.KEYS.ENTER:
          e.preventDefault();
          onEnter?.();
          break;
        case TV_NAVIGATION.KEYS.BACK:
          e.preventDefault();
          onBack?.();
          break;
      }
    };

    return (
      <div
        ref={combinedRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'outline-none transition-all duration-200',
          'focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'focus:scale-105',
          focusClassName,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Focusable.displayName = 'Focusable';
