'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useTVFocus } from './tv-focus-provider';
import { useSettingsStore } from '@/store/settings-store';

interface TVFocusableProps extends Omit<HTMLMotionProps<'div'>, 'onSelect'> {
  children: React.ReactNode;
  onSelect?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  focusKey?: string;
  className?: string;
}

export interface TVFocusableHandle {
  focus: () => void;
  blur: () => void;
  element: HTMLDivElement | null;
}

export const TVFocusable = forwardRef<TVFocusableHandle, TVFocusableProps>(
  (
    {
      children,
      onSelect,
      onFocus,
      onBlur,
      autoFocus = false,
      disabled = false,
      focusKey,
      className,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const { isTVMode, registerFocusable } = useTVFocus();
    const tvSettings = useSettingsStore((state) => state.tvSettings);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      focus: () => elementRef.current?.focus(),
      blur: () => elementRef.current?.blur(),
      element: elementRef.current,
    }));

    // Register element when TV mode is enabled
    useEffect(() => {
      if (!isTVMode || !elementRef.current || disabled) return;

      const unregister = registerFocusable(elementRef.current);
      return unregister;
    }, [isTVMode, disabled, registerFocusable]);

    // Auto focus
    useEffect(() => {
      if (autoFocus && elementRef.current && isTVMode && !disabled) {
        elementRef.current.focus();
      }
    }, [autoFocus, isTVMode, disabled]);

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.();
      }
    };

    // Handle focus events
    const handleFocus = () => {
      if (!disabled) {
        onFocus?.();
      }
    };

    const handleBlur = () => {
      if (!disabled) {
        onBlur?.();
      }
    };

    // If not in TV mode, render simple wrapper
    if (!isTVMode) {
      return (
        <div className={className} onClick={disabled ? undefined : onSelect}>
          {children}
        </div>
      );
    }

    // TV mode: render focusable element
    const focusScale = tvSettings.focusScale;
    const showOutline = tvSettings.showFocusOutline;

    return (
      <motion.div
        ref={elementRef}
        tabIndex={disabled ? -1 : 0}
        data-focusable="true"
        data-focus-key={focusKey}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        initial={{ scale: 1 }}
        whileFocus={{
          scale: focusScale,
          zIndex: 10,
          transition: { duration: 0.2 },
        }}
        className={cn(
          'relative transition-all outline-none',
          showOutline && 'focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TVFocusable.displayName = 'TVFocusable';
