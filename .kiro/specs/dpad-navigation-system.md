# D-Pad Navigation System

## Overview
Implement a unified spatial navigation system for Android TV D-pad controls across the entire application, ensuring seamless focus management and intuitive navigation flow between all UI sections.

## Status
- **Phase**: Design
- **Priority**: High
- **Estimated Effort**: 3-4 days

---

## Design

### Architecture

#### 1. Spatial Navigation Manager (Core System)
A centralized focus management service that handles all D-pad navigation logic.

**Key Components:**
- **Focus Registry**: Track all focusable elements with metadata (position, section, priority)
- **Spatial Calculator**: Determine nearest focusable element based on direction
- **Focus Controller**: Handle focus transitions with animations and callbacks
- **Navigation History**: Track focus path for back navigation

**Benefits:**
- Single source of truth for navigation state
- Consistent behavior across all sections
- Prevents focus conflicts and ghost selections
- Supports custom navigation rules per section

#### 2. Navigation Zones
Divide UI into logical navigation zones with defined entry/exit points.

**Zones:**
```
┌─────────────────────────────────────────────┐
│ SIDEBAR (Zone 1)                            │
│  - Search button                            │
│  - Nav items (Home, Movies, TV, etc.)      │
│  - Collapse/Expand button                   │
│                                             │
│  Entry: Right arrow from main content       │
│  Exit: Right arrow → Hero zone              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ HERO BANNER (Zone 2)                        │
│  - Play button                              │
│  - More Info button                         │
│  - Mute button (right side)                 │
│                                             │
│  Entry: Left from sidebar, Down from top    │
│  Exit: Down → Next section first card       │
│        Right → Mute button (edge case)      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CONTENT SECTIONS (Zone 3+)                  │
│  Each section contains:                     │
│  - Section header (focusable for context)   │
│  - Horizontal carousel of cards             │
│                                             │
│  Entry: Down from hero / Up from below      │
│  Exit: Up → Previous section                │
│        Down → Next section                  │
│        Left → Sidebar (when at first card)  │
└─────────────────────────────────────────────┘
```

#### 3. Focus States & Visual Feedback

**Focus Ring Hierarchy:**
1. **Primary Focus** (cyan ring): Currently selected element
2. **Section Focus** (subtle glow): Active section indicator
3. **Hover State** (scale + shadow): Mouse interaction feedback

**Card Focus Behavior:**
- Scale: 1.05x on hover, 1.08x on focus
- Z-index: 10 when focused (lift above siblings)
- Focus ring: 2px cyan border with rounded corners
- Smooth transitions: 200ms ease-in-out

#### 4. Navigation Flow Rules

**Horizontal Navigation (Left/Right):**
- Within carousel: Move between cards
- At first card + Left: Return to sidebar
- At last card + Right: Wrap to first card OR stay (configurable)

**Vertical Navigation (Up/Down):**
- Between sections: Focus first card of target section
- From hero More Info + Down: Jump to first section's first card
- At top section + Up: Return to hero buttons
- At bottom section + Down: Stay (or wrap to top, configurable)

**Cross-Zone Navigation:**
- Hero Play + Right: Focus More Info
- Hero More Info + Right: Focus Mute (edge)
- Hero More Info + Down: Focus first card in Continue Watching
- Sidebar last item + Right: Focus hero Play button
- Any card + Left (when first in carousel): Focus sidebar

#### 5. D-Pad Event Handling Strategy

**Problem with Current Implementation:**
- Browser native focus behavior interferes with custom navigation
- Double-press issue: First press moves focus to container, second to element

**Solution:**
```javascript
// Prevent default browser behavior
event.preventDefault();

// Manual focus management
const nextElement = spatialNavigator.getNextFocusable(
  currentElement, 
  direction, 
  currentZone
);

if (nextElement) {
  focusController.transition(currentElement, nextElement, {
    animate: true,
    scrollIntoView: true,
    updateHistory: true
  });
}
```

#### 6. Component Integration Pattern

**Focusable Component Wrapper:**
```typescript
interface FocusableProps {
  zoneId: string;
  zonePriority?: number;
  onFocusEnter?: () => void;
  onFocusLeave?: () => void;
  navigationRules?: NavigationRules;
  children: ReactNode;
}

<Focusable
  zoneId="hero-buttons"
  zonePriority={1}
  navigationRules={{
    down: 'continue-watching-section',
    right: 'hero-mute-button',
    preventUpWrap: true
  }}
>
  <Button>More Info</Button>
</Focusable>
```

### Technical Specifications

#### Data Structures

**Focus Registry Entry:**
```typescript
interface FocusableElement {
  id: string;
  element: HTMLElement;
  zone: string;
  position: { x: number; y: number; width: number; height: number };
  priority: number;
  metadata: {
    sectionIndex?: number;
    cardIndex?: number;
    isFirstInRow?: boolean;
    isLastInRow?: boolean;
  };
  navigationRules?: Partial<Record<Direction, string | null>>;
}
```

**Navigation Context:**
```typescript
interface NavigationContext {
  currentFocus: string | null;
  previousFocus: string | null;
  focusHistory: string[];
  activeZone: string;
  isNavigating: boolean;
}
```

#### Key Algorithms

**1. Spatial Distance Calculator:**
```
For direction D and element E:
1. Filter candidates: Only elements in direction D from E
2. Calculate distances:
   - Primary axis distance (aligned with D)
   - Secondary axis offset (perpendicular to D)
3. Score = primary_distance + (secondary_offset * penalty_factor)
4. Return element with lowest score
```

**2. Zone Boundary Detection:**
```
When navigation reaches zone boundary:
1. Check exit rule for current zone + direction
2. If exit allowed:
   - Find target zone entry point
   - Transition focus to entry element
3. If exit blocked:
   - Stay at current element
   - Optional: Visual feedback (bounce animation)
```

### User Experience Enhancements

**1. Focus Memory:**
- Remember last focused card in each section
- When returning to section, restore previous focus
- Persist across page navigation (session storage)

**2. Smart Scrolling:**
- Auto-scroll container to keep focused element visible
- Smooth scroll with padding (element centered, not at edge)
- Prevent scroll jank during rapid navigation

**3. Visual Breadcrumbs:**
- Subtle section header highlight when section is active
- Focus trail animation for fast navigation
- Minimap indicator (optional) for long pages

**4. Accessibility:**
- ARIA live regions announce section changes
- Screen reader support for navigation state
- Reduced motion support (disable scale animations)

### Performance Considerations

**1. Element Registration:**
- Lazy registration: Only register visible elements
- Batch updates: Debounce registry updates during scroll
- Cleanup: Unregister elements on unmount

**2. Spatial Calculations:**
- Cache element positions (invalidate on resize/scroll)
- Pre-calculate common navigation paths
- Use requestAnimationFrame for smooth transitions

**3. Event Handling:**
- Throttle D-pad events (prevent double-trigger)
- Use event delegation for carousel cards
- Debounce zone transition logic

---

## Requirements

### Functional Requirements

#### FR1: Sidebar Navigation
- **FR1.1**: Sidebar items navigable with Up/Down arrows
- **FR1.2**: Right arrow from sidebar navigates to main content (hero)
- **FR1.3**: Left arrow from main content returns to sidebar
- **FR1.4**: Sidebar collapse button accessible via D-pad
- **FR1.5**: Search button focusable and activatable

#### FR2: Hero Banner Navigation
- **FR2.1**: Play button is default focus on page load
- **FR2.2**: Right arrow: Play → More Info → Mute
- **FR2.3**: Left arrow: Reverse of FR2.2
- **FR2.4**: Down arrow from More Info: Navigate to first card in next section
- **FR2.5**: Up arrow from More Info: No action (stay in hero)

#### FR3: Section Card Navigation
- **FR3.1**: Cards navigable with Left/Right arrows within carousel
- **FR3.2**: First card in section marked with `data-first-card="true"`
- **FR3.3**: Down arrow from hero focuses first card in Continue Watching
- **FR3.4**: Up arrow from section focuses previous section's first card
- **FR3.5**: Down arrow from section focuses next section's first card
- **FR3.6**: Left arrow from first card returns to sidebar
- **FR3.7**: No ghost selections or intermediary focus states

#### FR4: Focus Visual Feedback
- **FR4.1**: Focused element has 2px cyan focus ring
- **FR4.2**: Focused card scales to 1.08x
- **FR4.3**: Focused card has z-index 10 (lifts above siblings)
- **FR4.4**: Focus transitions animated (200ms)
- **FR4.5**: No clipping of scaled cards (overflow: visible on containers)

#### FR5: Cross-Browser Compatibility
- **FR5.1**: Works on Chrome (desktop + Android WebView)
- **FR5.2**: Works on Firefox
- **FR5.3**: Works on Safari (desktop + iOS)
- **FR5.4**: Works on TV browsers (WebOS, Tizen, Android TV)

### Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1**: Navigation response < 50ms
- **NFR1.2**: Smooth 60fps animations
- **NFR1.3**: No layout thrashing during navigation

#### NFR2: Accessibility
- **NFR2.1**: WCAG 2.1 Level AA compliant
- **NFR2.2**: Screen reader announces navigation state
- **NFR2.3**: Keyboard navigation works (Tab key as fallback)
- **NFR2.4**: Focus visible for all interactive elements

#### NFR3: Maintainability
- **NFR3.1**: Centralized navigation logic (DRY)
- **NFR3.2**: Component integration via simple props/hooks
- **NFR3.3**: Navigation rules configurable per component
- **NFR3.4**: Comprehensive logging for debugging

---

## Tasks

### Task 1: Create Spatial Navigation Manager
**Status**: pending  
**Priority**: high  
**Estimated Effort**: 6-8 hours

**Description:**
Build the core spatial navigation service with focus registry, spatial calculator, and focus controller.

**Acceptance Criteria:**
- [ ] FocusRegistry class with add/remove/update methods
- [ ] SpatialCalculator with distance-based element selection
- [ ] FocusController with transition animations
- [ ] NavigationContext state management
- [ ] Unit tests for spatial calculations

**Files to Create:**
- `src/lib/navigation/spatial-navigator.ts`
- `src/lib/navigation/focus-registry.ts`
- `src/lib/navigation/focus-controller.ts`
- `src/lib/navigation/types.ts`

**Files to Modify:**
- None

---

### Task 2: Create Focusable Component Wrapper
**Status**: pending  
**Priority**: high  
**Estimated Effort**: 4-5 hours

**Description:**
Build a reusable React component wrapper that registers elements with the navigation manager and handles focus events.

**Acceptance Criteria:**
- [ ] Focusable component with zone/priority props
- [ ] Auto-registration on mount, cleanup on unmount
- [ ] Custom navigation rules support
- [ ] onFocusEnter/onFocusLeave callbacks
- [ ] TypeScript definitions

**Files to Create:**
- `src/components/navigation/focusable.tsx`
- `src/hooks/use-focusable.ts`

**Files to Modify:**
- None

---

### Task 3: Integrate Navigation in Sidebar
**Status**: pending  
**Priority**: high  
**Estimated Effort**: 3-4 hours

**Description:**
Wrap sidebar elements with Focusable component and configure zone navigation rules.

**Acceptance Criteria:**
- [ ] All sidebar items registered in "sidebar" zone
- [ ] Right arrow exits to hero zone
- [ ] Collapse button accessible
- [ ] Focus state persists across sidebar expand/collapse

**Files to Create:**
- None

**Files to Modify:**
- `src/components/layout/sidebar.tsx`

**Implementation Notes:**
- Replace current `focusedIndex` state with spatial navigator
- Remove manual key handlers, use Focusable wrapper
- Configure zone exit: Right → "hero-buttons"

---

### Task 4: Integrate Navigation in Hero Banner
**Status**: pending  
**Priority**: high  
**Estimated Effort**: 3-4 hours

**Description:**
Update hero banner buttons to use spatial navigation with proper cross-zone linking.

**Acceptance Criteria:**
- [ ] Play button is default focus on load
- [ ] Right arrow: Play → More Info → Mute
- [ ] Down arrow from More Info: Navigate to continue-watching zone
- [ ] No custom onKeyDown handlers (use navigation rules)

**Files to Create:**
- None

**Files to Modify:**
- `src/components/media/hero-banner.tsx`

**Implementation Notes:**
- Wrap buttons in Focusable with "hero-buttons" zone
- Configure navigation rules:
  ```typescript
  Play: { right: 'hero-more-info', down: null }
  More Info: { left: 'hero-play', right: 'hero-mute', down: 'continue-watching-first-card' }
  Mute: { left: 'hero-more-info' }
  ```

---

### Task 5: Integrate Navigation in Media Cards
**Status**: pending  
**Priority**: high  
**Estimated Effort**: 5-6 hours

**Description:**
Update SimpleMediaCard to use spatial navigation, ensuring no double-press issues and proper focus flow.

**Acceptance Criteria:**
- [ ] Cards register with section-based zone IDs
- [ ] First card in section has proper metadata
- [ ] Left/Right navigation within carousel
- [ ] Up/Down navigation between sections
- [ ] No ghost selections or intermediary focus

**Files to Create:**
- None

**Files to Modify:**
- `src/components/media/simple-media-card.tsx`
- `src/components/media/simple-media-carousel.tsx`

**Implementation Notes:**
- Remove `tabIndex={0}` (managed by Focusable)
- Remove manual `onKeyDown` handlers
- Wrap card in Focusable with dynamic zoneId based on section
- Configure first card: `navigationRules={{ up: 'hero-buttons' }}`

---

### Task 6: Configure Zone Transitions
**Status**: pending  
**Priority**: medium  
**Estimated Effort**: 3-4 hours

**Description:**
Define and test all cross-zone navigation paths to ensure seamless flow.

**Acceptance Criteria:**
- [ ] All zone entry/exit points documented
- [ ] Hero → Continue Watching transition works
- [ ] Section → Section transitions work
- [ ] Sidebar ↔ Main content transitions work
- [ ] Edge cases handled (wrap, boundaries)

**Files to Create:**
- `src/lib/navigation/zone-config.ts`

**Files to Modify:**
- `src/lib/navigation/spatial-navigator.ts`

**Implementation Notes:**
- Define zone graph with connections
- Implement zone transition logic
- Add visual feedback for blocked transitions

---

### Task 7: Add Focus Memory & Scroll Management
**Status**: pending  
**Priority**: medium  
**Estimated Effort**: 4-5 hours

**Description:**
Implement focus memory for sections and smart scrolling to keep focused elements visible.

**Acceptance Criteria:**
- [ ] Last focused card remembered per section
- [ ] Smooth scroll to focused element
- [ ] Element centered in viewport (not at edge)
- [ ] Focus memory persists across navigation

**Files to Create:**
- `src/lib/navigation/focus-memory.ts`
- `src/lib/navigation/scroll-manager.ts`

**Files to Modify:**
- `src/lib/navigation/focus-controller.ts`

---

### Task 8: Add Visual Feedback & Animations
**Status**: pending  
**Priority**: low  
**Estimated Effort**: 3-4 hours

**Description:**
Enhance navigation with visual feedback, section indicators, and smooth transitions.

**Acceptance Criteria:**
- [ ] Focus ring animation on transition
- [ ] Section header highlights when active
- [ ] Bounce animation for blocked navigation
- [ ] Reduced motion support

**Files to Create:**
- `src/styles/navigation-animations.ts`

**Files to Modify:**
- `src/components/navigation/focusable.tsx`
- `src/lib/navigation/focus-controller.ts`

---

### Task 9: Testing & Debugging Tools
**Status**: pending  
**Priority**: medium  
**Estimated Effort**: 4-5 hours

**Description:**
Create debug overlays and testing utilities for navigation development.

**Acceptance Criteria:**
- [ ] Debug overlay showing focus registry
- [ ] Navigation path visualizer
- [ ] Keyboard shortcut to toggle debug mode
- [ ] Console logging for navigation events (dev only)

**Files to Create:**
- `src/components/navigation/debug-overlay.tsx`
- `src/lib/navigation/debug-utils.ts`

**Files to Modify:**
- None

---

### Task 10: Documentation & Migration Guide
**Status**: pending  
**Priority**: low  
**Estimated Effort**: 2-3 hours

**Description:**
Document the navigation system API, patterns, and migration steps for existing components.

**Acceptance Criteria:**
- [ ] API documentation for SpatialNavigator
- [ ] Component integration guide
- [ ] Migration examples for existing code
- [ ] Troubleshooting section

**Files to Create:**
- `docs/NAVIGATION_SYSTEM.md`
- `docs/NAVIGATION_MIGRATION.md`

**Files to Modify:**
- `README.md` (add navigation section)

---

## Testing Strategy

### Unit Tests
- Spatial distance calculations
- Zone boundary detection
- Focus registry operations
- Navigation rule parsing

### Integration Tests
- Cross-zone navigation flows
- Focus memory persistence
- Scroll behavior during navigation
- Event handler cleanup

### E2E Tests
- Complete user journey (home to content)
- D-pad navigation scenarios
- Cross-browser compatibility
- TV device testing (WebOS, Tizen, Android TV)

### Manual Testing Checklist
- [ ] Sidebar navigation (up/down, left/right)
- [ ] Hero button navigation
- [ ] Section card navigation
- [ ] Cross-zone transitions
- [ ] Focus visual feedback
- [ ] Scroll behavior
- [ ] Edge cases (first/last elements)
- [ ] Mouse + D-pad hybrid usage

---

## Dependencies

### External
- `framer-motion`: Already in use for animations
- No additional dependencies required

### Internal
- `src/hooks/use-tv-mode.ts`: Detect TV mode
- `src/lib/constants.ts`: Navigation key codes
- `src/components/media/simple-media-card.tsx`: Card component
- `src/components/layout/sidebar.tsx`: Sidebar component
- `src/components/media/hero-banner.tsx`: Hero component

---

## Risks & Mitigations

### Risk 1: Performance Degradation
**Impact**: High  
**Likelihood**: Medium  
**Mitigation**: 
- Implement lazy registration
- Cache spatial calculations
- Use requestAnimationFrame for transitions
- Profile with Chrome DevTools

### Risk 2: Browser Inconsistencies
**Impact**: High  
**Likelihood**: Medium  
**Mitigation**:
- Test on all target browsers early
- Use feature detection
- Implement browser-specific workarounds
- Fall back to native focus for unsupported browsers

### Risk 3: Regression in Existing Behavior
**Impact**: Medium  
**Likelihood**: High  
**Mitigation**:
- Implement behind feature flag initially
- Extensive regression testing
- Gradual rollout (one zone at a time)
- Keep existing code until verified

### Risk 4: Complex State Management
**Impact**: Medium  
**Likelihood**: Medium  
**Mitigation**:
- Use proven state management patterns
- Comprehensive unit tests
- Debug tools for development
- Clear documentation

---

## Success Metrics

### Qualitative
- [ ] Smooth, intuitive navigation flow
- [ ] No ghost selections or double-press issues
- [ ] Consistent behavior across all sections
- [ ] Positive user feedback from TV testing

### Quantitative
- [ ] Navigation response time < 50ms (P95)
- [ ] Zero focus loss incidents
- [ ] 100% keyboard accessibility coverage
- [ ] 60fps maintained during navigation

---

## Future Enhancements

### Phase 2
- Voice control integration
- Gesture navigation (swipe on mobile)
- Multi-axis navigation (grid layouts)
- Smart focus prediction (ML-based)

### Phase 3
- Navigation analytics
- A/B testing framework
- User preference learning
- Advanced accessibility features

---

## Notes

- Current Top 10 section cards work correctly - use as reference
- Sidebar navigation partially working - needs spatial navigator integration
- Hero button navigation has custom handlers - will be replaced
- Main issue is in SimpleMediaCard - double focus behavior

---

## References

- [Spatial Navigation Spec (W3C)](https://www.w3.org/TR/css-nav-1/)
- [TV Input Framework (Android)](https://developer.android.com/training/tv/start)
- [WebOS TV Development Guide](https://webostv.developer.lge.com/)
- Existing TV navigation implementation: `src/hooks/use-tv-navigation.ts`
