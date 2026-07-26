/**
 * Navigation System Type Definitions
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NavigationRules {
  up?: string | null;
  down?: string | null;
  left?: string | null;
  right?: string | null;
  preventUpWrap?: boolean;
  preventDownWrap?: boolean;
  preventLeftWrap?: boolean;
  preventRightWrap?: boolean;
}

export interface FocusableMetadata {
  sectionIndex?: number;
  cardIndex?: number;
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
  isFirstInSection?: boolean;
  isLastInSection?: boolean;
  [key: string]: any;
}

export interface FocusableElement {
  id: string;
  element: HTMLElement;
  zone: string;
  position: Position;
  priority: number;
  metadata: FocusableMetadata;
  navigationRules?: NavigationRules;
  onFocusEnter?: () => void;
  onFocusLeave?: () => void;
}

export interface NavigationContext {
  currentFocus: string | null;
  previousFocus: string | null;
  focusHistory: string[];
  activeZone: string | null;
  isNavigating: boolean;
}

export interface FocusTransitionOptions {
  animate?: boolean;
  scrollIntoView?: boolean;
  updateHistory?: boolean;
  force?: boolean;
}

export interface SpatialNavigatorConfig {
  debug?: boolean;
  enableFocusMemory?: boolean;
  scrollPadding?: number;
  transitionDuration?: number;
  distancePenalty?: number; // Penalty factor for secondary axis offset
}

export interface ZoneConfig {
  id: string;
  priority: number;
  entryPoint?: string; // Element ID to focus when entering zone
  exitRules?: Partial<Record<Direction, string | null>>; // Zone ID or null to block
}
