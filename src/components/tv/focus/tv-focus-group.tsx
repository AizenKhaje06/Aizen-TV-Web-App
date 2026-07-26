'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { useTVFocus } from './tv-focus-provider';
import { moveFocus, FocusDirection } from '@/lib/tv';

interface TVFocusGroupProps {
  children: React.ReactNode;
  groupId: string;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
  onBoundary?: (direction: FocusDirection) => void;
  defaultFocusIndex?: number;
}

export function TVFocusGroup({
  children,
  groupId,
  orientation = 'horizontal',
  className,
  onBoundary,
  defaultFocusIndex = 0,
}: TVFocusGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTVMode } = useTVFocus();
  const hasInitialized = useRef(false);

  // Focus default element on mount
  useEffect(() => {
    if (!isTVMode || !containerRef.current || hasInitialized.current) return;

    const focusableElements = containerRef.current.querySelectorAll('[data-focusable="true"]');

    if (focusableElements.length > 0 && defaultFocusIndex >= 0) {
      const defaultElement = focusableElements[defaultFocusIndex] as HTMLElement;
      if (defaultElement) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          defaultElement.focus();
        }, 100);
      }
    }

    hasInitialized.current = true;
  }, [isTVMode, defaultFocusIndex]);

  // Handle keyboard navigation within group
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTVMode) return;

    const directionMap: Record<string, FocusDirection> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };

    const direction = directionMap[e.key];

    if (!direction) return;

    // Check if movement should be restricted based on orientation
    const shouldHandle =
      orientation === 'grid' ||
      (orientation === 'horizontal' && (direction === 'left' || direction === 'right')) ||
      (orientation === 'vertical' && (direction === 'up' || direction === 'down'));

    if (!shouldHandle) {
      // Let parent handle this direction
      return;
    }

    // Try to move focus within container
    const moved = moveFocus(direction, containerRef.current || undefined);

    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    } else if (onBoundary) {
      // Hit boundary
      e.preventDefault();
      e.stopPropagation();
      onBoundary(direction);
    }
  };

  if (!isTVMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      data-focus-group={groupId}
      onKeyDown={handleKeyDown}
      className={cn('focus-group', className)}
    >
      {children}
    </div>
  );
}
