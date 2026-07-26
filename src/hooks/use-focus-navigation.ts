import { useEffect, RefObject } from 'react';

interface UseFocusNavigationProps {
  ref: RefObject<HTMLElement>;
  onArrowDown?: () => void;
  onArrowUp?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}

export function useFocusNavigation({
  ref,
  onArrowDown,
  onArrowUp,
  onArrowLeft,
  onArrowRight,
}: UseFocusNavigationProps) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            e.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            e.preventDefault();
            onArrowRight();
          }
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, onArrowDown, onArrowUp, onArrowLeft, onArrowRight]);
}
