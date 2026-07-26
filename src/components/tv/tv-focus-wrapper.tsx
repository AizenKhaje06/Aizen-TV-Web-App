'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { focusRingVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';
import { useSettingsStore } from '@/store/settings-store';

interface TVFocusWrapperProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'onSelect' | 'children'> {
  children: React.ReactNode;
  onSelect?: () => void;
  onBack?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const TVFocusWrapper = forwardRef<HTMLDivElement, TVFocusWrapperProps>(
  ({ children, onSelect, onBack, autoFocus = false, disabled = false, className, ...props }, ref) => {
    const isTVMode = useSettingsStore((state) => state.isTVMode);
    const internalRef = useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    useEffect(() => {
      if (autoFocus && elementRef.current && isTVMode) {
        elementRef.current.focus();
      }
    }, [autoFocus, elementRef, isTVMode]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onSelect?.();
          break;
        case 'Escape':
          e.preventDefault();
          onBack?.();
          break;
      }
    };

    if (!isTVMode) {
      return <div className={className}>{children}</div>;
    }

    return (
      <motion.div
        ref={elementRef}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        variants={focusRingVariants}
        initial="initial"
        whileFocus="focused"
        className={cn(
          'relative rounded-lg transition-all',
          'focus:outline-none',
          !disabled && 'focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TVFocusWrapper.displayName = 'TVFocusWrapper';
