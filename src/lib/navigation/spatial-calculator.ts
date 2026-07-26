/**
 * Spatial Calculator
 * Calculates spatial relationships between focusable elements
 */

import { FocusableElement, Direction, Position } from './types';

export class SpatialCalculator {
  private distancePenalty: number;

  constructor(distancePenalty = 2) {
    this.distancePenalty = distancePenalty; // Penalty for misalignment
  }

  /**
   * Find the nearest element in a given direction
   */
  findNearest(
    from: FocusableElement,
    candidates: FocusableElement[],
    direction: Direction
  ): FocusableElement | null {
    const validCandidates = candidates.filter((candidate) =>
      this.isInDirection(from.position, candidate.position, direction)
    );

    if (validCandidates.length === 0) return null;

    // Score each candidate
    const scored = validCandidates.map((candidate) => ({
      element: candidate,
      score: this.calculateScore(from.position, candidate.position, direction),
    }));

    // Sort by score (lower is better)
    scored.sort((a, b) => a.score - b.score);

    return scored[0].element;
  }

  /**
   * Check if target is in the given direction from source
   */
  private isInDirection(
    source: Position,
    target: Position,
    direction: Direction
  ): boolean {
    const sourceCenter = this.getCenter(source);
    const targetCenter = this.getCenter(target);

    switch (direction) {
      case 'up':
        return targetCenter.y < sourceCenter.y;
      case 'down':
        return targetCenter.y > sourceCenter.y;
      case 'left':
        return targetCenter.x < sourceCenter.x;
      case 'right':
        return targetCenter.x > sourceCenter.x;
    }
  }

  /**
   * Calculate navigation score (lower is better)
   */
  private calculateScore(
    source: Position,
    target: Position,
    direction: Direction
  ): number {
    const sourceCenter = this.getCenter(source);
    const targetCenter = this.getCenter(target);

    let primaryDistance: number;
    let secondaryOffset: number;

    switch (direction) {
      case 'up':
      case 'down':
        // Vertical navigation
        primaryDistance = Math.abs(targetCenter.y - sourceCenter.y);
        secondaryOffset = Math.abs(targetCenter.x - sourceCenter.x);
        break;
      case 'left':
      case 'right':
        // Horizontal navigation
        primaryDistance = Math.abs(targetCenter.x - sourceCenter.x);
        secondaryOffset = Math.abs(targetCenter.y - sourceCenter.y);
        break;
    }

    // Score = primary distance + (secondary offset * penalty)
    return primaryDistance + secondaryOffset * this.distancePenalty;
  }

  /**
   * Get center point of a position
   */
  private getCenter(position: Position): { x: number; y: number } {
    return {
      x: position.x + position.width / 2,
      y: position.y + position.height / 2,
    };
  }

  /**
   * Check if two elements overlap on an axis
   */
  hasAxisOverlap(a: Position, b: Position, axis: 'x' | 'y'): boolean {
    if (axis === 'x') {
      return !(a.x + a.width < b.x || b.x + b.width < a.x);
    } else {
      return !(a.y + a.height < b.y || b.y + b.height < a.y);
    }
  }

  /**
   * Get distance between two positions
   */
  getDistance(a: Position, b: Position): number {
    const centerA = this.getCenter(a);
    const centerB = this.getCenter(b);

    const dx = centerB.x - centerA.x;
    const dy = centerB.y - centerA.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if element is within viewport
   */
  isInViewport(position: Position, viewport?: { width: number; height: number }): boolean {
    const vp = viewport || {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + position.width <= vp.width &&
      position.y + position.height <= vp.height
    );
  }
}
