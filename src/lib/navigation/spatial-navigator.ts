/**
 * Spatial Navigator
 * Main navigation manager that orchestrates focus management
 */

import { FocusRegistry } from './focus-registry';
import { SpatialCalculator } from './spatial-calculator';
import { FocusController } from './focus-controller';
import {
  Direction,
  FocusableElement,
  NavigationContext,
  SpatialNavigatorConfig,
  FocusTransitionOptions,
  ZoneConfig,
} from './types';

export class SpatialNavigator {
  private registry: FocusRegistry;
  private calculator: SpatialCalculator;
  private controller: FocusController;
  private context: NavigationContext;
  private config: Required<SpatialNavigatorConfig>;
  private zones: Map<string, ZoneConfig> = new Map();
  private focusMemory: Map<string, string> = new Map(); // zone -> last focused element ID
  private listeners: Set<(context: NavigationContext) => void> = new Set();

  constructor(config: SpatialNavigatorConfig = {}) {
    this.config = {
      debug: config.debug ?? false,
      enableFocusMemory: config.enableFocusMemory ?? true,
      scrollPadding: config.scrollPadding ?? 100,
      transitionDuration: config.transitionDuration ?? 200,
      distancePenalty: config.distancePenalty ?? 2,
    };

    this.registry = new FocusRegistry(this.config.debug);
    this.calculator = new SpatialCalculator(this.config.distancePenalty);
    this.controller = new FocusController(
      this.config.transitionDuration,
      this.config.scrollPadding,
      this.config.debug
    );

    this.context = {
      currentFocus: null,
      previousFocus: null,
      focusHistory: [],
      activeZone: null,
      isNavigating: false,
    };

    this.setupEventListeners();
  }

  /**
   * Register a focusable element
   */
  register(element: FocusableElement): void {
    this.registry.register(element);
  }

  /**
   * Unregister a focusable element
   */
  unregister(id: string): void {
    // Clear from focus memory
    for (const [zone, focusedId] of this.focusMemory.entries()) {
      if (focusedId === id) {
        this.focusMemory.delete(zone);
      }
    }

    // Clear from context
    if (this.context.currentFocus === id) {
      this.context.currentFocus = null;
    }

    this.registry.unregister(id);
  }

  /**
   * Register a navigation zone
   */
  registerZone(zone: ZoneConfig): void {
    this.zones.set(zone.id, zone);
    if (this.config.debug) {
      console.log('[SpatialNavigator] Registered zone:', zone.id);
    }
  }

  /**
   * Navigate in a direction
   */
  navigate(direction: Direction, options?: FocusTransitionOptions): boolean {
    if (this.context.isNavigating) return false;

    this.context.isNavigating = true;

    const currentElement = this.getCurrentElement();
    if (!currentElement) {
      this.context.isNavigating = false;
      return this.focusDefault();
    }

    const nextElement = this.getNextElement(currentElement, direction);

    if (nextElement) {
      this.transitionTo(nextElement, options);
      this.context.isNavigating = false;
      return true;
    }

    this.context.isNavigating = false;
    return false;
  }

  /**
   * Get the next element in a direction
   */
  private getNextElement(
    current: FocusableElement,
    direction: Direction
  ): FocusableElement | null {
    // Check custom navigation rules first
    if (current.navigationRules?.[direction] !== undefined) {
      const targetId = current.navigationRules[direction];

      // null means block navigation in this direction
      if (targetId === null) {
        if (this.config.debug) {
          console.log('[SpatialNavigator] Navigation blocked by rule');
        }
        return null;
      }

      // Explicit target element
      const target = this.registry.get(targetId);
      if (target) {
        if (this.config.debug) {
          console.log('[SpatialNavigator] Using navigation rule:', targetId);
        }
        return target;
      }
    }

    // Try to find element in same zone
    const sameZoneCandidates = this.registry.getByZone(current.zone);
    const nextInZone = this.calculator.findNearest(
      current,
      sameZoneCandidates.filter((el) => el.id !== current.id),
      direction
    );

    if (nextInZone) {
      return nextInZone;
    }

    // Try cross-zone navigation
    return this.findCrossZoneElement(current, direction);
  }

  /**
   * Find element in another zone
   */
  private findCrossZoneElement(
    current: FocusableElement,
    direction: Direction
  ): FocusableElement | null {
    const currentZone = this.zones.get(current.zone);
    if (!currentZone || !currentZone.exitRules) return null;

    const targetZoneId = currentZone.exitRules[direction];
    if (!targetZoneId) return null;

    if (targetZoneId === null) {
      if (this.config.debug) {
        console.log('[SpatialNavigator] Zone exit blocked');
      }
      return null;
    }

    // Get target zone entry point or use focus memory
    const targetZone = this.zones.get(targetZoneId);
    if (!targetZone) return null;

    // Check focus memory first
    if (this.config.enableFocusMemory) {
      const lastFocusedId = this.focusMemory.get(targetZoneId);
      if (lastFocusedId) {
        const lastFocused = this.registry.get(lastFocusedId);
        if (lastFocused) {
          if (this.config.debug) {
            console.log('[SpatialNavigator] Restoring focus memory:', lastFocusedId);
          }
          return lastFocused;
        }
      }
    }

    // Use entry point if specified
    if (targetZone.entryPoint) {
      const entryElement = this.registry.get(targetZone.entryPoint);
      if (entryElement) return entryElement;
    }

    // Find nearest element in target zone
    const targetZoneCandidates = this.registry.getByZone(targetZoneId);
    if (targetZoneCandidates.length === 0) return null;

    return this.calculator.findNearest(current, targetZoneCandidates, direction);
  }

  /**
   * Transition to an element
   */
  private async transitionTo(
    element: FocusableElement,
    options?: FocusTransitionOptions
  ): Promise<void> {
    const currentElement = this.getCurrentElement();

    await this.controller.transition(currentElement, element, options);

    // Update context
    this.context.previousFocus = this.context.currentFocus;
    this.context.currentFocus = element.id;
    this.context.activeZone = element.zone;

    // Update focus memory
    if (this.config.enableFocusMemory) {
      this.focusMemory.set(element.zone, element.id);
    }

    // Update history
    if (options?.updateHistory !== false) {
      this.context.focusHistory.push(element.id);
      // Limit history size
      if (this.context.focusHistory.length > 50) {
        this.context.focusHistory.shift();
      }
    }

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Focus an element by ID
   */
  focusById(id: string, options?: FocusTransitionOptions): boolean {
    const element = this.registry.get(id);
    if (!element) return false;

    this.transitionTo(element, options);
    return true;
  }

  /**
   * Focus default element (first registered)
   */
  focusDefault(): boolean {
    const allElements = this.registry.getAll();
    if (allElements.length === 0) return false;

    // Sort by priority
    allElements.sort((a, b) => b.priority - a.priority);

    this.transitionTo(allElements[0]);
    return true;
  }

  /**
   * Get current focused element
   */
  getCurrentElement(): FocusableElement | null {
    if (!this.context.currentFocus) return null;
    return this.registry.get(this.context.currentFocus) || null;
  }

  /**
   * Get navigation context
   */
  getContext(): NavigationContext {
    return { ...this.context };
  }

  /**
   * Subscribe to navigation changes
   */
  subscribe(callback: (context: NavigationContext) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.getContext());
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Track focus changes
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      
      // Find if this is a registered element
      const allElements = this.registry.getAll();
      const element = allElements.find((el) => el.element === target);

      if (element && element.id !== this.context.currentFocus) {
        this.context.previousFocus = this.context.currentFocus;
        this.context.currentFocus = element.id;
        this.context.activeZone = element.zone;

        if (this.config.enableFocusMemory) {
          this.focusMemory.set(element.zone, element.id);
        }

        this.notifyListeners();
      }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle arrow keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      const directionMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = directionMap[e.key];
      if (!direction) return;

      // Prevent default browser behavior
      e.preventDefault();
      e.stopPropagation();

      // Navigate
      this.navigate(direction, {
        animate: true,
        scrollIntoView: true,
        updateHistory: true,
      });
    });
  }

  /**
   * Clear focus memory for a zone
   */
  clearFocusMemory(zone?: string): void {
    if (zone) {
      this.focusMemory.delete(zone);
    } else {
      this.focusMemory.clear();
    }
  }

  /**
   * Get debug information
   */
  getDebugInfo(): {
    registry: ReturnType<FocusRegistry['getDebugInfo']>;
    context: NavigationContext;
    zones: string[];
    focusMemory: Record<string, string>;
  } {
    return {
      registry: this.registry.getDebugInfo(),
      context: this.getContext(),
      zones: Array.from(this.zones.keys()),
      focusMemory: Object.fromEntries(this.focusMemory),
    };
  }

  /**
   * Destroy the navigator (cleanup)
   */
  destroy(): void {
    this.registry.clear();
    this.zones.clear();
    this.focusMemory.clear();
    this.listeners.clear();
  }
}
