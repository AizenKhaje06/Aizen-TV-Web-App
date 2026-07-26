/**
 * Focus Registry
 * Manages all focusable elements in the application
 */

import { FocusableElement, Position } from './types';

export class FocusRegistry {
  private elements: Map<string, FocusableElement> = new Map();
  private elementsByZone: Map<string, Set<string>> = new Map();
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Register a focusable element
   */
  register(element: FocusableElement): void {
    this.elements.set(element.id, element);

    // Add to zone index
    if (!this.elementsByZone.has(element.zone)) {
      this.elementsByZone.set(element.zone, new Set());
    }
    this.elementsByZone.get(element.zone)!.add(element.id);

    if (this.debug) {
      console.log('[FocusRegistry] Registered:', element.id, 'in zone:', element.zone);
    }
  }

  /**
   * Unregister a focusable element
   */
  unregister(id: string): void {
    const element = this.elements.get(id);
    if (!element) return;

    this.elements.delete(id);

    // Remove from zone index
    const zoneElements = this.elementsByZone.get(element.zone);
    if (zoneElements) {
      zoneElements.delete(id);
      if (zoneElements.size === 0) {
        this.elementsByZone.delete(element.zone);
      }
    }

    if (this.debug) {
      console.log('[FocusRegistry] Unregistered:', id);
    }
  }

  /**
   * Update element position (e.g., after scroll or resize)
   */
  updatePosition(id: string, position: Position): void {
    const element = this.elements.get(id);
    if (element) {
      element.position = position;
    }
  }

  /**
   * Get element by ID
   */
  get(id: string): FocusableElement | undefined {
    return this.elements.get(id);
  }

  /**
   * Get all elements in a zone
   */
  getByZone(zone: string): FocusableElement[] {
    const ids = this.elementsByZone.get(zone);
    if (!ids) return [];

    return Array.from(ids)
      .map((id) => this.elements.get(id))
      .filter((el): el is FocusableElement => el !== undefined)
      .sort((a, b) => b.priority - a.priority); // Higher priority first
  }

  /**
   * Get all elements
   */
  getAll(): FocusableElement[] {
    return Array.from(this.elements.values());
  }

  /**
   * Get all zones
   */
  getZones(): string[] {
    return Array.from(this.elementsByZone.keys());
  }

  /**
   * Clear all elements (useful for testing)
   */
  clear(): void {
    this.elements.clear();
    this.elementsByZone.clear();

    if (this.debug) {
      console.log('[FocusRegistry] Cleared all elements');
    }
  }

  /**
   * Get element count
   */
  get count(): number {
    return this.elements.size;
  }

  /**
   * Check if element is registered
   */
  has(id: string): boolean {
    return this.elements.has(id);
  }

  /**
   * Get debug info
   */
  getDebugInfo(): { total: number; byZone: Record<string, number> } {
    const byZone: Record<string, number> = {};
    for (const [zone, ids] of this.elementsByZone.entries()) {
      byZone[zone] = ids.size;
    }
    return {
      total: this.elements.size,
      byZone,
    };
  }
}
