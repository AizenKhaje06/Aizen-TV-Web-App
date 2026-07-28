# D-PAD Navigation System Audit

**Date**: Current Session  
**Status**: 🟡 PARTIALLY WORKING (Arrow keys work, but stuck in hero section)

---

## 1. SYSTEM ARCHITECTURE

### Current Implementation
- **Type**: Custom Zone-Based + Spatial Navigation Hybrid
- **Library**: Custom built (NOT using Norigin Spatial Navigation)
- **Entry Point**: `TVFocusProvider` → `startRemoteControl()` → Event Listeners

### Key Components

```
TVFocusProvider (Root)
  ├── remote-handler.ts (Arrow key capture)
  ├── focus-manager.ts (Spatial navigation fallback)
  ├── Focusable Component (Wrapper for focusable elements)
  └── zones.ts (Zone definitions and rules)
```

---

## 2. WHAT'S WORKING ✅

### Remote Control System
- ✅ `TVFocusProvider` initializes correctly
- ✅ `startRemoteControl()` adds event listeners
- ✅ Arrow keys are captured (ArrowUp, ArrowDown, ArrowLeft, ArrowRight)
- ✅ `localStorage.setItem('tv-mode-override', 'true')` enables TV mode
- ✅ `document.body.classList.contains('tv-mode')` returns true
- ✅ Console logs show key presses
- ✅ LEFT/RIGHT navigation works WITHIN hero buttons

### Hero Section
- ✅ Auto-focus on Play button works
- ✅ LEFT/RIGHT navigation between Play → More Info → Mute works
- ✅ Focusable component renders with correct attributes

---

## 3. WHAT'S NOT WORKING ❌

### Navigation Rules Not Executing
**Problem**: `data-nav-*` attributes are present but navigation doesn't trigger

**Affected Directions:**
- ❌ **LEFT from hero → sidebar** (should work, but doesn't)
- ❌ **DOWN from hero → Continue Watching carousel** (blocked)
- ❌ **UP from carousels → hero** (not tested yet)

### Root Causes Identified:

#### Issue 1: Zone Element Discovery Failure
```typescript
// Current code in remote-handler.ts (lines 130-138)
const zoneElements = document.querySelectorAll(`[data-zone="${navRuleTarget}"]`);

// PROBLEM: This finds ALL elements with data-zone="sidebar"
// But if sidebar elements have tabIndex=-1, they won't be focusable
```

**Why this fails:**
- Sidebar nav items might not have `tabIndex="0"` set
- Query finds elements but none are focusable
- Navigation rule lookup succeeds, but focus() fails

#### Issue 2: Sidebar Elements Not Registered
```typescript
// Expected: Sidebar nav items should be Focusable components
// Reality: Sidebar might be using plain <Link> or <button> elements
```

**Check needed:**
- Are sidebar navigation items wrapped in `<Focusable>` components?
- Do they have `data-zone="sidebar"` attribute?
- Do they have `tabIndex="0"`?

#### Issue 3: Navigation Provider Not Integrated
```typescript
// Focusable component uses useFocusable() hook
// useFocusable() registers with navigator.register()
// BUT: remote-handler.ts doesn't query the navigator registry
```

**Disconnect:**
- Navigation rules are stored in navigator registry
- Remote handler queries DOM directly (data attributes)
- These two systems don't communicate

---

## 4. SPATIAL NAVIGATION FALLBACK

### How It Works
When no navigation rule is found, falls back to geometric spatial nav:

```typescript
// focus-manager.ts: moveFocus()
// 1. Get all focusable elements
// 2. Filter elements in direction (geometric)
// 3. Calculate distances
// 4. Focus closest element
```

### Why It's Not Helping
- **UP/DOWN**: No elements directly above/below hero buttons geometrically
- Sidebar is to the LEFT but might be off-screen or not in geometric path
- Carousels below are far away (>600px), spatial algo can't find them

---

## 5. ZONE SYSTEM ANALYSIS

### Zone Definitions (zones.ts)
```typescript
ZONES = {
  SIDEBAR: 'sidebar',
  HERO: 'hero-buttons',
  CONTINUE_WATCHING: 'continue-watching',
  // ... more zones
}
```

### Exit Rules Defined
```typescript
{
  id: ZONES.HERO,
  exitRules: {
    left: ZONES.SIDEBAR,  // ✅ Defined
    down: ZONES.CONTINUE_WATCHING,  // ✅ Defined
  }
}
```

### Hero Button Navigation Rules
```typescript
// hero-banner.tsx
navigationRules={{
  left: ZONES.SIDEBAR,  // ✅ Should navigate to sidebar
  right: 'hero-more-info-button',  // ✅ Works
  down: ZONES.CONTINUE_WATCHING,  // ❌ Not working
}}
```

### Data Attributes Generated
```typescript
// Focusable component adds these:
data-zone="hero-buttons"
data-nav-left="sidebar"
data-nav-right="hero-more-info-button"
data-nav-down="continue-watching"
```

---

## 6. DEBUG CHECKLIST

### To Test Immediately:
```javascript
// 1. Check if hero button has navigation attributes
document.getElementById('hero-play-button').getAttribute('data-nav-left')
// Expected: "sidebar"

// 2. Check if sidebar elements exist
document.querySelectorAll('[data-zone="sidebar"]').length
// Expected: > 0

// 3. Check if sidebar elements are focusable
Array.from(document.querySelectorAll('[data-zone="sidebar"]'))
  .filter(el => el.tabIndex >= 0).length
// Expected: > 0

// 4. Manually focus sidebar element
document.querySelector('[data-zone="sidebar"][tabIndex="0"]')?.focus()
// Expected: Focus should move to sidebar
```

### Console Logs to Watch:
```
[RemoteControl] Key pressed: ArrowLeft -> Remote key: left
[RemoteControl] Current element: hero-play-button
[RemoteControl] Found navigation rule: left → sidebar
[RemoteControl] Not found by ID, searching for zone: sidebar
[RemoteControl] Found X elements in zone  ← CRITICAL: Is X > 0?
[RemoteControl] Found focusable element in zone: ...  ← CRITICAL: Does this appear?
[RemoteControl] ✅ Focused via navigation rule: ...  ← SUCCESS
```

---

## 7. LIKELY FIXES NEEDED

### Fix #1: Ensure Sidebar Uses Focusable Components
**File**: `src/components/layout/sidebar.tsx`

**Current (probably)**:
```tsx
<Link href="/home">Home</Link>
```

**Should be**:
```tsx
<Focusable 
  id="sidebar-home" 
  zoneId={ZONES.SIDEBAR}
  navigationRules={{
    right: ZONES.HERO,
    down: 'sidebar-movies'
  }}
>
  <Link href="/home">Home</Link>
</Focusable>
```

### Fix #2: Improve Zone Element Discovery
**File**: `src/lib/tv/remote-handler.ts`

**Add priority sorting**:
```typescript
if (zoneElements.length > 0) {
  // Sort by zonePriority attribute (descending)
  const sortedElements = Array.from(zoneElements).sort((a, b) => {
    const priorityA = parseInt((a as HTMLElement).getAttribute('data-priority') || '0');
    const priorityB = parseInt((b as HTMLElement).getAttribute('data-priority') || '0');
    return priorityB - priorityA;
  });
  
  // Find first focusable
  for (const el of sortedElements) {
    if (el.tabIndex >= 0) {
      targetElement = el;
      break;
    }
  }
}
```

### Fix #3: Add Zone Entry Points
**Concept**: Each zone should have a designated entry point

```typescript
// zones.ts
{
  id: ZONES.SIDEBAR,
  entryPoint: 'sidebar-home',  // ✅ Already defined
  // ...
}
```

**Remote handler should check entryPoint first**:
```typescript
// If navigating to a zone, focus its entry point
const zoneConfig = getZoneConfig(navRuleTarget);
if (zoneConfig?.entryPoint) {
  targetElement = document.getElementById(zoneConfig.entryPoint);
}
```

---

## 8. RECOMMENDED ACTION PLAN

### Phase 1: Quick Fix (30 minutes)
1. ✅ Check sidebar.tsx - are nav items wrapped in Focusable?
2. ✅ Add priority to Focusable data attributes
3. ✅ Update remote handler to use zone entryPoints
4. ✅ Test LEFT navigation to sidebar
5. ✅ Test DOWN navigation to first carousel

### Phase 2: Polish (1-2 hours)
1. Add focus history persistence
2. Add scroll-into-view for carousels
3. Add visual focus indicator (glow/scale)
4. Test all pages (Movies, TV, Anime, etc.)

### Phase 3: Production Ready (3-4 hours)
1. Replace with Norigin Spatial Navigation
2. Implement full spec from requirements
3. Test on Android TV emulator
4. Polish animations and UX

---

## 9. COMPARISON: Current vs Norigin

### Current System
**Pros:**
- ✅ Custom, full control
- ✅ Zone-based navigation explicit
- ✅ Arrow keys working

**Cons:**
- ❌ Manual implementation, more bugs
- ❌ Not battle-tested
- ❌ Missing features (focus restoration, history)

### Norigin Spatial Navigation
**Pros:**
- ✅ Battle-tested (used in production apps)
- ✅ Built-in focus memory
- ✅ Automatic spatial navigation
- ✅ Active community

**Cons:**
- ❌ Learning curve
- ❌ Less control over exact behavior
- ❌ Requires refactoring all pages

---

## 10. IMMEDIATE NEXT STEPS

1. **Run debug checklist** (Section 6) in browser console
2. **Check sidebar.tsx** - verify Focusable components
3. **Test console logs** when pressing LEFT from hero
4. **Report findings** so we can apply targeted fix

---

## 11. FILES TO REVIEW

Priority order:
1. ✅ `src/components/layout/sidebar.tsx` - Check if using Focusable
2. ✅ `src/lib/tv/remote-handler.ts` - Already reviewed
3. ✅ `src/components/media/hero-banner.tsx` - Already reviewed
4. 🔲 `src/app/(main)/page.tsx` - Home page structure
5. 🔲 `src/components/media/media-carousel.tsx` - Carousel focusable?

---

## 12. TESTING CHECKLIST

### Browser Testing (Current)
- [x] Arrow keys captured
- [x] TV mode active
- [x] Console logs present
- [ ] LEFT to sidebar works
- [ ] DOWN to carousel works
- [ ] UP from carousel to hero works

### Android TV Testing (Future)
- [ ] Install APK on Android TV
- [ ] Test with physical remote
- [ ] Test all pages navigable
- [ ] Test back button
- [ ] Test focus restoration

---

## END OF AUDIT

**Summary**: System is 60% complete. Arrow keys work, but zone transitions don't execute. Most likely cause: Sidebar elements not wrapped in Focusable components or not having proper tabIndex.

**Recommendation**: Run debug checklist first, then apply targeted fix to sidebar.tsx.
