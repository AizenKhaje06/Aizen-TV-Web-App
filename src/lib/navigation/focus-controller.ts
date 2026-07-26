/**
 * Focus Controller
 * Manages focus transitions with animations and scroll management
 */

import { FocusableElement, FocusTransitionOptions } from './types';

export class FocusController {
  // private transitionDuration: number;
  private scrollPadding: number;
  private debug: boolean;

  constructor(
    _transitionDuration = 200,
    scrollPadding = 100,
    debug = false
  ) {
    // this.transitionDuration = transitionDuration;
    this.scrollPadding = scrollPadding;
    this.debug = debug;
  }

  /**
   * Transition focus from one element to another
   */
  async transition(
    from: FocusableElement | null,
    to: FocusableElement,
    options: FocusTransitionOptions = {}
  ): Promise<void> {
    const {
      animate = true,
      scrollIntoView = true,
      // force = false,
    } = options;

    // Call leave callback
    if (from && from.onFocusLeave) {
      from.onFocusLeave();
    }

    // Focus the element
    to.element.focus({ preventScroll: scrollIntoView });

    // Scroll into view if needed
    if (scrollIntoView) {
      this.scrollToElement(to.element, animate);
    }

    // Call enter callback
    if (to.onFocusEnter) {
      to.onFocusEnter();
    }

    if (this.debug) {
      console.log('[FocusController] Transition:', from?.id, '→', to.id);
    }
  }

  /**
   * Scroll element into view with padding
   */
  private scrollToElement(element: HTMLElement, smooth = true): void {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if element is already fully visible with padding
    const isVisible =
      rect.top >= this.scrollPadding &&
      rect.bottom <= viewportHeight - this.scrollPadding &&
      rect.left >= this.scrollPadding &&
      rect.right <= viewportWidth - this.scrollPadding;

    if (isVisible) return;

    // Calculate scroll position to center element
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: smooth ? 'smooth' : 'auto',
      block: 'center',
      inline: 'center',
    };

    element.scrollIntoView(scrollOptions);
  }

  /**
   * Blur current focus
   */
  blur(element: FocusableElement): void {
    element.element.blur();
    if (element.onFocusLeave) {
      element.onFocusLeave();
    }
  }

  /**
   * Force focus an element (without transition)
   */
  forceFocus(element: FocusableElement): void {
    element.element.focus({ preventScroll: false });
    if (element.onFocusEnter) {
      element.onFocusEnter();
    }
  }

  /**
   * Check if element is currently focused
   */
  isFocused(element: FocusableElement): boolean {
    return document.activeElement === element.element;
  }

  /**
   * Get currently focused element
   */
  getCurrentFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  }

  /**
   * Restore focus to element by ID
   */
  restoreFocus(element: FocusableElement): void {
    this.forceFocus(element);
  }
}
