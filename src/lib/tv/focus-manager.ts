/**
 * Focus management utilities for TV navigation
 * Handles focus direction, memory, and restoration
 */

export type FocusDirection = 'up' | 'down' | 'left' | 'right';

export interface FocusableElement extends HTMLElement {
  dataset: {
    focusable?: string;
    focusGroup?: string;
    focusIndex?: string;
    focusRow?: string;
    focusCol?: string;
  };
}

/**
 * Focus history for restoration
 */
class FocusHistory {
  private history: HTMLElement[] = [];
  private maxSize = 10;

  push(element: HTMLElement): void {
    this.history.push(element);
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }

  pop(): HTMLElement | undefined {
    return this.history.pop();
  }

  current(): HTMLElement | undefined {
    return this.history[this.history.length - 1];
  }

  clear(): void {
    this.history = [];
  }
}

export const focusHistory = new FocusHistory();

/**
 * Get all focusable elements in the document or container
 */
export function getFocusableElements(container?: HTMLElement): FocusableElement[] {
  const root = container || document;
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[data-focusable="true"]',
  ].join(', ');

  return Array.from(root.querySelectorAll<FocusableElement>(selector)).filter((el) => {
    // Check if element is visible
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

/**
 * Get elements in a specific focus group
 */
export function getFocusGroupElements(groupId: string): FocusableElement[] {
  return getFocusableElements().filter((el) => el.dataset.focusGroup === groupId);
}

/**
 * Get element position in viewport
 */
function getElementPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

/**
 * Calculate distance between two elements
 */
function calculateDistance(from: HTMLElement, to: HTMLElement): number {
  const fromPos = getElementPosition(from);
  const toPos = getElementPosition(to);

  const dx = toPos.centerX - fromPos.centerX;
  const dy = toPos.centerY - fromPos.centerY;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if element is in the direction of another element
 */
function isInDirection(
  from: HTMLElement,
  to: HTMLElement,
  direction: FocusDirection
): boolean {
  const fromPos = getElementPosition(from);
  const toPos = getElementPosition(to);

  switch (direction) {
    case 'up':
      return toPos.centerY < fromPos.top;
    case 'down':
      return toPos.centerY > fromPos.bottom;
    case 'left':
      return toPos.centerX < fromPos.left;
    case 'right':
      return toPos.centerX > fromPos.right;
  }
}

/**
 * Find the next focusable element in a direction
 */
export function findNextFocusableElement(
  currentElement: HTMLElement,
  direction: FocusDirection,
  container?: HTMLElement
): HTMLElement | null {
  const elements = getFocusableElements(container);

  // Filter elements in the correct direction
  const candidates = elements.filter((el) => {
    if (el === currentElement) return false;
    return isInDirection(currentElement, el, direction);
  });

  if (candidates.length === 0) return null;

  // Find closest element in direction
  let closest: HTMLElement | null = null;
  let minDistance = Infinity;

  candidates.forEach((candidate) => {
    const distance = calculateDistance(currentElement, candidate);
    if (distance < minDistance) {
      minDistance = distance;
      closest = candidate;
    }
  });

  return closest;
}

/**
 * Move focus in a direction
 */
export function moveFocus(direction: FocusDirection, container?: HTMLElement): boolean {
  const current = document.activeElement as HTMLElement;

  if (!current) {
    // No element focused, focus first focusable element
    const elements = getFocusableElements(container);
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
    return false;
  }

  const next = findNextFocusableElement(current, direction, container);

  if (next) {
    next.focus();
    focusHistory.push(next);

    // Scroll element into view if needed
    next.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });

    return true;
  }

  return false;
}

/**
 * Focus first element in container
 */
export function focusFirst(container?: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    focusHistory.push(elements[0]);
    return true;
  }
  return false;
}

/**
 * Focus last element in container
 */
export function focusLast(container?: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    const last = elements[elements.length - 1];
    last.focus();
    focusHistory.push(last);
    return true;
  }
  return false;
}

/**
 * Restore focus to previously focused element
 */
export function restoreFocus(): boolean {
  const previous = focusHistory.pop();
  if (previous && document.body.contains(previous)) {
    previous.focus();
    return true;
  }
  return false;
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const elements = getFocusableElements(container);

  if (elements.length === 0) return;

  const first = elements[0];
  const last = elements[elements.length - 1];
  const current = document.activeElement as HTMLElement;

  // Tab forward
  if (event.key === 'Tab' && !event.shiftKey) {
    if (current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Tab backward
  if (event.key === 'Tab' && event.shiftKey) {
    if (current === first) {
      event.preventDefault();
      last.focus();
    }
  }
}

/**
 * Get focus index in group
 */
export function getFocusIndex(element: HTMLElement, groupId: string): number {
  const elements = getFocusGroupElements(groupId);
  return elements.indexOf(element as FocusableElement);
}

/**
 * Focus element by index in group
 */
export function focusByIndex(groupId: string, index: number): boolean {
  const elements = getFocusGroupElements(groupId);
  if (index >= 0 && index < elements.length) {
    elements[index].focus();
    focusHistory.push(elements[index]);
    return true;
  }
  return false;
}

/**
 * Clear focus (blur active element)
 */
export function clearFocus(): void {
  const current = document.activeElement as HTMLElement;
  if (current && current.blur) {
    current.blur();
  }
}
