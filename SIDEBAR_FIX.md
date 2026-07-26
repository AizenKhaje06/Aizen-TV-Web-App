# Sidebar Expansion Fix

## Issue
The sidebar was stuck in expanded state instead of being collapsed by default.

## Root Cause
The sidebar was automatically expanding when `isTVMode` was enabled, even on desktop browsers. This happened because:
1. The TV mode hook was checking localStorage for a `tv-mode-override` setting
2. The sidebar had `isExpanded || isTVMode` checks everywhere, forcing it to expand whenever TV mode was on
3. Mouse hover wasn't working because of `!isTVMode &&` conditions preventing hover expansion

## Solution

### 1. TV Mode Detection Improvement
Changed from:
```tsx
if (isTVMode) {
  setIsExpanded(true); // Always expanded in TV mode
}
```

To:
```tsx
// Only expand if actually on a TV device, not just TV mode override
const userAgent = navigator.userAgent.toLowerCase();
const isActualTVDevice = /tv|webos|tizen|roku|smarttv|googletv|appletv/.test(userAgent);

if (isActualTVDevice && isTVMode) {
  setIsExpanded(true);
}
// Don't force expand for desktop even if TV mode is on
```

### 2. Removed TV Mode Conditions from Expansion Logic
Changed all instances of:
- `isExpanded || isTVMode` → `isExpanded`
- `!isTVMode && setIsExpanded(true)` → `setIsExpanded(true)`

This allows the sidebar to:
- **Default to collapsed** (80px width, icon-only)
- **Expand on hover** to 240px with labels
- **Work in TV mode** when on actual TV devices (not desktop browsers)

### 3. Kept TV Mode Focus Highlighting
The D-pad navigation and focus indicators for TV mode still work correctly:
- Arrow Up/Down: Navigate through menu items
- Enter: Select and navigate
- Arrow Right: Move focus to main content
- Focus rings visible in TV mode

## Testing
To test TV mode on desktop, you'll need to:
1. Set the user agent to a TV device
2. Or set localStorage override: `localStorage.setItem('tv-mode-override', 'true')`
3. Reload the page

But now the sidebar will remain functional (hover to expand) even when TV mode is accidentally enabled on desktop.

## Files Changed
- `src/components/layout/sidebar.tsx` - Fixed expansion logic and hover behavior
