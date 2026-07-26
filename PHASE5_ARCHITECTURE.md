# Phase 5: Android TV Optimization - Architecture Plan

## 🎯 Objective
Transform MyStream into a native-feeling Android TV application with full remote control support and 10-foot UI experience.

---

## 📱 Android TV Interaction Flow

```
User Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. Launch App (Android TV WebView or Browser)               │
│    ↓                                                         │
│ 2. Detect TV Environment                                    │
│    • Check user agent                                       │
│    • Check screen size                                      │
│    • Check input capabilities                               │
│    ↓                                                         │
│ 3. Initialize TV Mode                                       │
│    • Enable focus management                                │
│    • Register remote handlers                               │
│    • Apply TV-optimized layout                              │
│    ↓                                                         │
│ 4. Navigate with D-Pad                                      │
│    • UP/DOWN: Vertical rows                                 │
│    • LEFT/RIGHT: Horizontal content                         │
│    • ENTER: Select item                                     │
│    • BACK: Navigate back                                    │
│    ↓                                                         │
│ 5. Browse Content                                           │
│    • Hero banner auto-focus                                 │
│    • Carousel navigation                                    │
│    • Card focus effects                                     │
│    ↓                                                         │
│ 6. View Details                                             │
│    • Focus on Play button                                   │
│    • Navigate metadata                                      │
│    ↓                                                         │
│ 7. Watch Content                                            │
│    • Fullscreen player                                      │
│    • Large controls                                         │
│    • Remote playback control                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Focus Management Architecture

```
Focus System:
┌────────────────────────────────────────────────────────────┐
│                     TVFocusProvider                         │
│  (Context-based focus state management)                    │
│                                                             │
│  • Focus history stack                                     │
│  • Focus restoration on navigation                         │
│  • Direction-based focus movement                          │
│  • Focus trap for modals                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────┬──────────────┐
        ▼                     ▼              ▼              ▼
   TVFocusGroup          TVFocusable    TVCarousel      TVGrid
   (Container)           (Item)         (Horizontal)    (2D Grid)
        │                     │              │              │
        │                     │              │              │
   ┌────┴────┐           ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
   │ Tracks  │           │ Element │   │ Slides  │   │ Cells   │
   │ focused │           │ can be  │   │ focus   │   │ focus   │
   │ child   │           │ focused │   │ L/R     │   │ all dir │
   └─────────┘           └─────────┘   └─────────┘   └─────────┘
```

### Focus Movement Logic:
- **ArrowUp**: Move focus to element above
- **ArrowDown**: Move focus to element below
- **ArrowLeft**: Move focus to element on left OR scroll carousel left
- **ArrowRight**: Move focus to element on right OR scroll carousel right
- **Enter**: Activate focused element
- **Escape/Back**: Go back OR exit fullscreen

---

## 🎮 Remote Control Mapping

```
Physical Remote → JavaScript Events → Actions

┌──────────────────────────────────────────────────────────┐
│  D-Pad Navigation                                        │
├──────────────────────────────────────────────────────────┤
│  ↑ (UP)          → ArrowUp       → Focus previous row    │
│  ↓ (DOWN)        → ArrowDown     → Focus next row        │
│  ← (LEFT)        → ArrowLeft     → Scroll/Focus left     │
│  → (RIGHT)       → ArrowRight    → Scroll/Focus right    │
├──────────────────────────────────────────────────────────┤
│  Action Buttons                                          │
├──────────────────────────────────────────────────────────┤
│  ⏎ (SELECT/OK)   → Enter         → Activate element      │
│  ← (BACK)        → Escape        → Go back               │
├──────────────────────────────────────────────────────────┤
│  Media Keys (Optional)                                   │
├──────────────────────────────────────────────────────────┤
│  ▶ (PLAY)        → MediaPlay     → Play content          │
│  ⏸ (PAUSE)       → MediaPause    → Pause content         │
│  ⏪ (REW)         → MediaRewind   → Seek backward         │
│  ⏩ (FF)          → MediaFastFor  → Seek forward          │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 Component Changes & Enhancements

### New TV-Specific Components:

```
components/tv/
├── focus/
│   ├── tv-focus-provider.tsx     (NEW - Focus context)
│   ├── tv-focusable.tsx          (NEW - Focusable wrapper)
│   ├── tv-focus-group.tsx        (NEW - Focus container)
│   └── tv-carousel.tsx           (NEW - Horizontal carousel)
│
├── layout/
│   ├── tv-menu.tsx               (NEW - TV navigation menu)
│   ├── tv-row.tsx                (NEW - Content row)
│   └── tv-grid.tsx               (NEW - 2D grid layout)
│
├── media/
│   ├── tv-media-card.tsx         (NEW - Optimized card)
│   ├── tv-hero-banner.tsx        (NEW - TV hero)
│   └── tv-player-controls.tsx    (NEW - Large controls)
│
└── search/
    └── tv-search.tsx             (NEW - Voice search UI)
```

### Enhanced Existing Components:
- `TVButton` - Add focus memory
- `TVFocusWrapper` - Add direction navigation
- `MediaCard` - Add TV scaling effects
- `MediaCarousel` - Add carousel snap scrolling
- `VideoPlayer` - Add TV control overlay

---

## 🔧 New Utilities

```
lib/tv/
├── is-tv.ts                      (TV detection)
├── device-capabilities.ts        (Capability checks)
├── focus-manager.ts              (Focus utilities)
├── remote-handler.ts             (Remote event handling)
└── webview-bridge.ts             (Android WebView interface)
```

### TV Detection Logic:
```typescript
// is-tv.ts
function isTVDevice(): boolean {
  // Check user agent
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('tv') || ua.includes('crkey')) return true;
  
  // Check screen size (TV is typically > 720p)
  const { width, height } = window.screen;
  if (width >= 1280 && height >= 720) return true;
  
  // Check pointer capabilities (TV has no mouse)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hasNoPointer = window.matchMedia('(pointer: none)').matches;
  
  return hasNoPointer || (!hasCoarsePointer && width >= 1280);
}
```

---

## 🎨 10-Foot UI Design System

### Typography Scale (TV):
```
Hero Title:    text-6xl (3.75rem) - Readable from 3 meters
Section Title: text-4xl (2.25rem)
Card Title:    text-2xl (1.5rem)
Body Text:     text-xl (1.25rem)
Metadata:      text-lg (1.125rem)
```

### Spacing Scale (TV):
```
Card Gap:      24px → 32px (increased)
Row Padding:   32px → 48px
Button Size:   44px → 64px min height
Focus Ring:    4px → 6px width
```

### Focus States:
```css
/* Normal State */
.tv-card {
  transform: scale(1);
  opacity: 0.7;
}

/* Focused State */
.tv-card:focus {
  transform: scale(1.1);
  opacity: 1;
  box-shadow: 0 0 0 6px var(--focus-ring),
              0 8px 32px rgba(0,0,0,0.4);
  z-index: 10;
}
```

---

## 🚀 Performance Optimizations

### Lazy Loading Strategy:
```
Home Page:
├── Hero Banner          (Immediate)
├── Continue Watching    (Immediate)
├── Row 1 (Trending)     (Immediate)
├── Row 2 (Popular)      (Lazy - on scroll)
├── Row 3 (Top Rated)    (Lazy - on scroll)
└── Row 4+ (...)         (Lazy - on scroll)
```

### Virtualization:
- **Horizontal Carousels**: Render visible cards + 2 buffer cards
- **Vertical Lists**: Virtual scroll with IntersectionObserver
- **Images**: Lazy load with blur placeholder

### Memory Management:
```typescript
// Cleanup when row exits viewport
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Unload images
        // Cancel pending requests
      }
    });
  });
  
  return () => observer.disconnect();
}, []);
```

---

## 📱 WebView Compatibility

### Android TV APK Wrapper Support:

```typescript
// WebView bridge interface
interface AndroidBridge {
  // Back button handling
  onBackPressed(): boolean; // return true if handled
  
  // App lifecycle
  onPause(): void;
  onResume(): void;
  
  // Device info
  getDeviceInfo(): {
    model: string;
    isTV: boolean;
    hasKeyboard: boolean;
  };
}

// Expose to WebView
declare global {
  interface Window {
    Android?: AndroidBridge;
  }
}
```

### WebView Meta Tags:
```html
<meta name="viewport" 
      content="width=device-width, initial-scale=1.0, 
               maximum-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
```

### CSS for WebView:
```css
/* Disable text selection on TV */
.tv-mode * {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Disable tap highlight */
.tv-mode * {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 🎯 TV Settings Store

```typescript
// settings-store.ts additions
interface TVSettings {
  // Display
  animationIntensity: 'low' | 'medium' | 'high';
  focusScale: number; // 1.0 - 1.2
  
  // Behavior
  autoplayNextEpisode: boolean;
  autoplayPreviews: boolean;
  
  // Accessibility
  highContrastMode: boolean;
  reducedMotion: boolean;
  textSize: 'normal' | 'large' | 'x-large';
}
```

---

## 🧪 Testing Checklist

### Remote Navigation:
- [ ] Navigate menu with D-pad
- [ ] Scroll carousel left/right
- [ ] Select card with Enter
- [ ] Go back with Back button
- [ ] Focus visible at all times
- [ ] Focus restored on navigation

### Player:
- [ ] Enter fullscreen on play
- [ ] Show controls with OK/Enter
- [ ] Hide controls after 3s
- [ ] Exit fullscreen with Back
- [ ] Second Back returns to previous page

### Performance:
- [ ] Home loads < 3s
- [ ] Smooth carousel scrolling (60fps)
- [ ] No jank on focus change
- [ ] Images load progressively

### Devices:
- [ ] Android TV (Sony, Nvidia Shield)
- [ ] Google TV (Chromecast)
- [ ] TV Box (Fire TV, Mi Box)
- [ ] TV Browser (Native)

---

## 📦 Implementation Order

### Phase 5.1 - Foundation (Priority 1)
1. TV detection utilities
2. Device capabilities
3. Focus management system
4. Remote control handlers

### Phase 5.2 - Components (Priority 2)
5. TV focus provider & context
6. TV focusable wrapper
7. TV carousel
8. TV media card

### Phase 5.3 - Layout (Priority 3)
9. TV-optimized home page
10. TV navigation menu
11. TV row layout
12. TV grid system

### Phase 5.4 - Polish (Priority 4)
13. WebView compatibility
14. Performance optimizations
15. TV settings
16. Accessibility

---

## 🎬 Expected Outcome

After Phase 5:

✅ **Native TV Feel**
- Seamless remote navigation
- Clear focus indicators
- Smooth animations
- 10-foot UI optimization

✅ **Full Remote Support**
- D-pad navigation works everywhere
- Enter/Back buttons intuitive
- No mouse required

✅ **Performance**
- Fast loading on TV hardware
- Smooth scrolling
- Memory efficient

✅ **WebView Ready**
- Compatible with Android TV APK wrapper
- Back button handling
- Lifecycle management

---

**Ready to implement Phase 5!** 🚀

