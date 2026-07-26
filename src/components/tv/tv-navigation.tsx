'use client';

import { useEffect } from 'react';
import { TV_NAVIGATION } from '@/lib/constants';

interface TVNavigationProps {
  enabled?: boolean;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

/**
 * TV Navigation Hook
 * Handles arrow key navigation for TV remote
 */
export function useTVNavigation({ enabled = true, onNavigate }: TVNavigationProps = {}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { UP, DOWN, LEFT, RIGHT } = TV_NAVIGATION.KEYS;

      switch (e.key) {
        case UP:
          e.preventDefault();
          onNavigate?.('up');
          break;
        case DOWN:
          e.preventDefault();
          onNavigate?.('down');
          break;
        case LEFT:
          e.preventDefault();
          onNavigate?.('left');
          break;
        case RIGHT:
          e.preventDefault();
          onNavigate?.('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onNavigate]);
}

/**
 * Focus Management Utilities
 */
export class FocusManager {
  private static focusableElements: HTMLElement[] = [];

  static register(element: HTMLElement) {
    if (!this.focusableElements.includes(element)) {
      this.focusableElements.push(element);
    }
  }

  static unregister(element: HTMLElement) {
    this.focusableElements = this.focusableElements.filter((el) => el !== element);
  }

  static focusNext() {
    const currentIndex = this.getCurrentFocusIndex();
    const nextIndex = (currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[nextIndex]?.focus();
  }

  static focusPrevious() {
    const currentIndex = this.getCurrentFocusIndex();
    const prevIndex =
      currentIndex === 0 ? this.focusableElements.length - 1 : currentIndex - 1;
    this.focusableElements[prevIndex]?.focus();
  }

  static focusFirst() {
    this.focusableElements[0]?.focus();
  }

  static focusLast() {
    this.focusableElements[this.focusableElements.length - 1]?.focus();
  }

  private static getCurrentFocusIndex(): number {
    const activeElement = document.activeElement as HTMLElement;
    return this.focusableElements.indexOf(activeElement);
  }

  static clear() {
    this.focusableElements = [];
  }
}
