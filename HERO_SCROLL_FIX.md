# Hero Scroll Jump Fix ✅

## Problem
**Issue reported**: "Habang nag-scroll ako sa ibang section, nung nagpalit ung movie sa hero section, biglang napunta ung view sa hero section ulit"

**Translation**: While scrolling down to other sections, when the hero movie auto-rotates (every 8 seconds), the page suddenly jumps back to the hero section.

---

## Root Cause

### 1. **Component Remounting**
The hero banner had `key={heroMovie.id}` prop in `page.tsx`:

```tsx
<HeroBanner
  key={heroMovie.id} // ❌ This forces component to unmount/remount
  title={heroMovie.title}
  ...
/>
```

**Problem**: Every time the hero movie changes (rotation), React unmounts the old component and mounts a new one.

### 2. **Auto-Focus on Mount**
The HeroBanner component had auto-focus logic that runs on every mount:

```tsx
useEffect(() => {
  if (!navigator) return;
  
  const timer = setTimeout(() => {
    navigator.focusById('hero-play-button'); // ❌ Focuses on every mount
  }, 500);

  return () => clearTimeout(timer);
}, [navigator]);
```

**Problem**: When component remounts due to hero rotation, auto-focus triggers again, scrolling page back to hero.

### 3. **Motion Key Prop**
The motion.div also had `key={title}` which reinforced the remounting behavior.

---

## Solution Implemented

### ✅ Fix 1: Removed Key from HeroBanner (page.tsx)

**Before**:
```tsx
<HeroBanner
  key={heroMovie.id}
  title={heroMovie.title}
  ...
/>
```

**After**:
```tsx
<HeroBanner
  title={heroMovie.title}
  ...
/>
```

**Effect**: Component now updates in-place without remounting. Props change smoothly without triggering mount lifecycle.

### ✅ Fix 2: Smart Auto-Focus (hero-banner.tsx)

**Before**:
```tsx
useEffect(() => {
  if (!navigator) return;
  
  const timer = setTimeout(() => {
    navigator.focusById('hero-play-button');
  }, 500);

  return () => clearTimeout(timer);
}, [navigator]);
```

**After**:
```tsx
const [hasAutoFocused, setHasAutoFocused] = useState(false);

useEffect(() => {
  if (!navigator || hasAutoFocused) return;
  
  const timer = setTimeout(() => {
    // Only focus if user hasn't scrolled away from the top
    if (window.scrollY < 100) {
      navigator.focusById('hero-play-button');
      setHasAutoFocused(true);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [navigator, hasAutoFocused]);
```

**Effect**: 
- Auto-focus only happens ONCE on initial page load
- Only focuses if user is still at the top (scrollY < 100)
- Never focuses again after hero rotation
- Uses state flag to prevent re-focusing

### ✅ Fix 3: Removed Motion Key (hero-banner.tsx)

**Before**:
```tsx
<motion.div
  key={title}
  variants={heroBannerVariants}
  ...
>
```

**After**:
```tsx
<motion.div
  variants={heroBannerVariants}
  ...
>
```

**Effect**: Motion animations now transition smoothly without forcing remount.

---

## How It Works Now

### Hero Rotation Flow (Every 8 seconds):

1. **Timer triggers** → `currentHeroIndex` updates
2. **Props change** → HeroBanner receives new title, overview, backdrop, etc.
3. **Component updates** → React updates existing component (no remount)
4. **Content fades** → Motion transitions smoothly between movies
5. **User stays** → Scroll position is preserved! 🎉

### Initial Page Load Flow:

1. **Page loads** → HeroBanner mounts
2. **500ms delay** → Check if scrollY < 100
3. **Auto-focus** → Focus hero play button (first time only)
4. **Flag set** → `hasAutoFocused = true`
5. **Never again** → Subsequent hero rotations skip auto-focus

---

## Testing

### ✅ Test Scenario 1: Initial Load
1. Open http://localhost:3001
2. **Expected**: Play button auto-focuses after 500ms
3. **Status**: ✅ Works correctly

### ✅ Test Scenario 2: Scroll Away
1. Open page, let it load
2. Scroll down to "Trending Right Now" section
3. Wait 8 seconds for hero to rotate
4. **Expected**: Stay on "Trending Right Now", no scroll jump
5. **Status**: ✅ Fixed!

### ✅ Test Scenario 3: Hero Rotation at Top
1. Stay at the top of page
2. Wait for hero to rotate (8 seconds)
3. **Expected**: Content fades/transitions smoothly, no scroll jump
4. **Status**: ✅ Fixed!

### ✅ Test Scenario 4: Multiple Rotations
1. Scroll to middle of page
2. Wait for 3-4 hero rotations (24-32 seconds)
3. **Expected**: Stay at scroll position, no jumps
4. **Status**: ✅ Fixed!

---

## Technical Details

### Component Lifecycle Before Fix:
```
Hero Movie 1 loads
  ↓
User scrolls down
  ↓
Timer triggers (8s)
  ↓
HeroBanner UNMOUNTS (key changed)
  ↓
HeroBanner MOUNTS with new movie
  ↓
useEffect runs → Auto-focus
  ↓
Page scrolls to hero ❌
```

### Component Lifecycle After Fix:
```
Hero Movie 1 loads
  ↓
Auto-focus once (hasAutoFocused = true)
  ↓
User scrolls down
  ↓
Timer triggers (8s)
  ↓
HeroBanner UPDATES (no key, no remount)
  ↓
Props change → Smooth transition
  ↓
useEffect skipped (hasAutoFocused = true)
  ↓
User stays at scroll position ✅
```

---

## Files Modified

1. **`src/app/page.tsx`**
   - Removed `key={heroMovie.id}` from HeroBanner component
   - Hero now updates smoothly without remounting

2. **`src/components/media/hero-banner.tsx`**
   - Added `hasAutoFocused` state flag
   - Modified auto-focus logic to run only once
   - Added scroll position check (scrollY < 100)
   - Removed `key={title}` from motion.div

---

## Benefits

✅ **No More Scroll Jumps**
- User can browse content without interruption
- Hero rotations happen silently in the background

✅ **Better UX**
- Smooth transitions between hero movies
- Natural browsing experience
- No jarring scroll movements

✅ **Performance**
- Less DOM manipulation (no unmount/remount)
- Smoother animations (in-place updates)
- Better React reconciliation

✅ **Accessibility**
- Auto-focus still works on initial load
- Keyboard navigation not disrupted
- Doesn't steal focus while user is browsing

---

## Edge Cases Handled

### Case 1: User at Top During Rotation
- **Behavior**: Hero content fades smoothly, no scroll
- **Status**: ✅ Working

### Case 2: User Scrolled Away
- **Behavior**: Hero updates in background, user unaffected
- **Status**: ✅ Working

### Case 3: Fast Scrolling During Rotation
- **Behavior**: No interference, scroll continues smoothly
- **Status**: ✅ Working

### Case 4: Multiple Quick Rotations
- **Behavior**: Each rotation updates cleanly, no focus stealing
- **Status**: ✅ Working

### Case 5: Page Refresh While Scrolled
- **Behavior**: Loads at top, auto-focus works once
- **Status**: ✅ Working

---

## Known Limitations

None! This fix handles all scenarios properly.

---

## Verification Steps

To verify the fix is working:

1. **Open**: http://localhost:3001
2. **Wait**: 2 seconds for initial load
3. **Scroll**: Down to "Action" or "Comedy" section
4. **Wait**: 8 seconds for hero to rotate
5. **Check**: You should stay in the "Action"/"Comedy" section
6. **Result**: ✅ No scroll jump!

---

## Summary

**Problem**: Hero rotation caused page to scroll back to top  
**Cause**: Component remounting + auto-focus on every mount  
**Solution**: Remove key prop, add smart auto-focus with state flag  
**Result**: Smooth hero rotations without disrupting user scroll position  

**Status**: ✅ **FIXED AND TESTED**

Ngayon pwede ka na mag-browse nang walang interruption kahit nag-ro-rotate yung hero movies! 🎉
