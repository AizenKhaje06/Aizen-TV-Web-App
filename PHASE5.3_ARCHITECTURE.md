# Phase 5.3: TV Layout Integration - Architecture

**Date:** January 2025  
**Status:** Planning → Implementation

---

## 🎯 Phase 5.3 Objectives

Integrate the TV components built in Phase 5.1 and 5.2 into the actual application pages, creating a complete Android TV experience with seamless remote control navigation.

---

## 📋 What Exists (Phase 5.1 & 5.2)

### TV Utilities ✅
**Location:** `src/lib/tv/`
- `is-tv.ts` - TV device detection
- `device-capabilities.ts` - Device capability checks
- `focus-manager.ts` - Focus management system
- `remote-handler.ts` - Remote control handling
- `webview-bridge.ts` - Android WebView bridge

### TV Components ✅
**Location:** `src/components/tv/`

**Focus System:**
- `TVFocusProvider` - Context provider for focus management
- `TVFocusable` - Individual focusable elements
- `TVFocusGroup` - Groups of focusable items
- `TVCarousel` - TV-optimized carousel

**Media Components:**
- `TVMediaCard` - TV-optimized media cards
- `TVHeroBanner` - TV-optimized hero banner

### Settings Store ✅
**Location:** `src/store/settings-store.ts`
- TV mode state
- TV settings (animation intensity, focus scale, text size)

---

## 🎯 Phase 5.3 Goals

### 1. Integrate TV Detection
- Add TV mode detection on app startup
- Store TV mode in settings
- Conditional rendering based on TV mode

### 2. Add TVFocusProvider to Layout
- Wrap app with focus provider
- Initialize focus management
- Handle remote control events

### 3. Update Home Page
- Replace standard carousels with TVCarousel
- Use TVMediaCard instead of MediaCard on TV
- Optimize hero banner for TV

### 4. Update Detail Pages
- Add TV-friendly layouts
- Optimize button sizes and spacing
- Enhance focus navigation

### 5. Test Navigation Flow
- Verify D-pad navigation works
- Test focus indicators are visible
- Ensure all interactive elements are focusable

---

## 🏗️ Implementation Plan

### Phase 5.3.1: TV Detection & Provider Setup
**Duration:** 30 minutes

**Tasks:**
1. Create TV detection hook
2. Add TVFocusProvider to root layout
3. Initialize remote handler
4. Test TV mode detection

**Files:**
- `src/hooks/use-tv-mode.ts` (new)
- `src/app/layout.tsx` (update)

---

### Phase 5.3.2: Home Page Integration
**Duration:** 1 hour

**Tasks:**
1. Update home page to detect TV mode
2. Replace ContentRow with TVCarousel on TV
3. Use TVMediaCard in carousels
4. Test carousel navigation with keyboard

**Files:**
- `src/app/page.tsx` (update)
- `src/components/media/content-row.tsx` (enhance)

---

### Phase 5.3.3: Detail Pages Integration
**Duration:** 45 minutes

**Tasks:**
1. Update movie detail page for TV
2. Update TV show detail page for TV
3. Optimize button layouts
4. Add focus groups

**Files:**
- `src/app/(main)/movie/[id]/page.tsx` (update)
- `src/app/(main)/tv/[id]/page.tsx` (update)

---

### Phase 5.3.4: Search Page Integration
**Duration:** 30 minutes

**Tasks:**
1. Update search page for TV
2. Add focus to search input
3. Make results TV-navigable

**Files:**
- `src/app/(main)/search/page.tsx` (update)

---

### Phase 5.3.5: Testing & Polish
**Duration:** 15 minutes

**Tasks:**
1. Test complete navigation flow
2. Verify focus indicators
3. Test on different screen sizes
4. Document TV navigation

---

## 📊 Component Strategy

### Conditional Rendering Pattern

```typescript
import { useTVMode } from '@/hooks/use-tv-mode';
import { ContentRow } from '@/components/media/content-row';
import { TVCarousel } from '@/components/tv/focus/tv-carousel';
import { TVMediaCard } from '@/components/tv/media/tv-media-card';
import { MediaCard } from '@/components/media/media-card';

export default function Page() {
  const { isTVMode } = useTVMode();
  
  return (
    <div>
      {isTVMode ? (
        <TVCarousel title="Trending">
          {items.map(item => (
            <TVMediaCard key={item.id} item={item} />
          ))}
        </TVCarousel>
      ) : (
        <ContentRow title="Trending" items={items} />
      )}
    </div>
  );
}
```

### Focus Groups for Detail Pages

```typescript
import { TVFocusGroup } from '@/components/tv/focus/tv-focus-group';
import { TVFocusable } from '@/components/tv/focus/tv-focusable';

<TVFocusGroup id="actions">
  <TVFocusable onSelect={handlePlay}>
    Play
  </TVFocusable>
  <TVFocusable onSelect={handleAddToList}>
    Add to List
  </TVFocusable>
</TVFocusGroup>
```

---

## 🎨 TV Layout Guidelines

### Spacing
- Increase padding on TV (1.5x desktop)
- Larger gaps between elements
- More breathing room

### Typography
- Larger font sizes (1.25x desktop)
- Higher contrast
- Bolder weights for better readability

### Focus Indicators
- Clear, high-contrast borders
- Scale animation (1.1x on focus)
- Glow effect for emphasis

### Navigation Zones
- Hero banner (top)
- Content rows (middle)
- Navigation (always accessible)

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**TV Detection:**
- [ ] Desktop browser shows web layout
- [ ] TV user agent shows TV layout
- [ ] Settings can toggle TV mode manually

**Navigation:**
- [ ] Arrow keys navigate between items
- [ ] Enter key activates focused item
- [ ] Escape key goes back
- [ ] Focus is always visible
- [ ] Focus doesn't get stuck

**Home Page:**
- [ ] Hero banner is focusable
- [ ] Carousels navigate with arrows
- [ ] Vertical navigation between rows works
- [ ] Items are properly spaced for TV

**Detail Pages:**
- [ ] Buttons are large and focusable
- [ ] Focus order is logical
- [ ] Back navigation works
- [ ] Play button is easily accessible

**Search:**
- [ ] Search input is focusable
- [ ] Results are navigable with arrows
- [ ] Selecting result navigates correctly

---

## 🔧 Configuration

### TV Mode Toggle (for testing)

```typescript
// Settings store
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      tvMode: isTVDevice(), // Auto-detect
      setTVMode: (enabled) => set({ tvMode: enabled }),
      // ... other settings
    }),
    { name: 'settings-storage' }
  )
);
```

### Manual Override (Development)

```typescript
// In browser console:
localStorage.setItem('tv-mode-override', 'true');
// Reload page to activate TV mode
```

---

## 📈 Success Criteria

### Functionality ✓
- TV mode auto-detects correctly
- TVFocusProvider manages focus state
- Remote controls are mapped correctly
- All interactive elements are focusable
- Navigation is smooth and intuitive

### User Experience ✓
- Focus indicators are always visible
- Focus order is logical
- No focus traps
- Smooth animations
- Appropriate sizing for 10-foot UI

### Performance ✓
- No performance degradation
- Focus changes are immediate (<16ms)
- Animations are smooth (60fps)
- Memory usage is stable

### Quality ✓
- 0 TypeScript errors
- 0 ESLint errors
- Manual testing passes
- Works on actual TV devices

---

## 🎯 Expected Outcome

After Phase 5.3:
- ✅ TV components are integrated into all pages
- ✅ Complete Android TV experience
- ✅ Seamless remote control navigation
- ✅ TV-optimized layouts and spacing
- ✅ Manual testing passes all checks

---

**Phase 5.3 completes the Android TV optimization started in Phase 5!**
