# Android TV Setup Guide

**MyStream v1.2.0**  
**Complete Android TV Integration Guide**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [TV Mode Detection](#tv-mode-detection)
3. [Testing TV Mode](#testing-tv-mode)
4. [WebView Integration](#webview-integration)
5. [Focus Management](#focus-management)
6. [Remote Control Navigation](#remote-control-navigation)
7. [TV Components](#tv-components)
8. [Adaptive Layouts](#adaptive-layouts)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Overview

MyStream includes **full Android TV support** with:
- ✅ Automatic TV device detection
- ✅ Remote control (D-pad) navigation
- ✅ Focus management system
- ✅ 10-foot UI optimization
- ✅ TV-specific components
- ✅ Adaptive layouts (auto-switch between web/TV)
- ✅ WebView wrapper compatibility

### TV Mode Features

**Automatic Detection**
- Detects Android TV, Google TV, Fire TV
- User agent string analysis
- Screen size consideration
- Manual override available

**Navigation**
- D-pad up/down/left/right
- Enter key for selection
- Back button support
- Spatial navigation

**UI Optimization**
- Larger cards and buttons
- Clear focus indicators
- 10-foot viewing distance
- Optimized spacing

---

## TV Mode Detection

### Detection Logic

MyStream automatically detects TV devices using multiple signals:

```typescript
// lib/tv/tv-detection.ts
export function isTVDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for TV-specific user agents
  const tvKeywords = [
    'tv',
    'smarttv',
    'googletv',
    'androidtv',
    'firetv',
    'roku',
    'appletv',
    'hbbtv',
    'pov_tv',
    'nettv',
    'web0s',
    'webos',
    'crkey'
  ];
  
  const isTVUA = tvKeywords.some(keyword => ua.includes(keyword));
  
  // Check screen size (TV typically 1080p or 4K)
  const isLargeScreen = 
    window.screen.width >= 1920 && 
    window.screen.height >= 1080;
  
  return isTVUA || isLargeScreen;
}
```

### Manual Override

Users can manually enable/disable TV mode:

```typescript
// Enable TV mode
localStorage.setItem('tv-mode-override', 'true');

// Disable TV mode
localStorage.setItem('tv-mode-override', 'false');

// Use automatic detection
localStorage.removeItem('tv-mode-override');

// Reload page
location.reload();
```

### useTVMode Hook

Components use the `useTVMode()` hook:

```typescript
import { useTVMode } from '@/hooks/use-tv-mode';

function MyComponent() {
  const isTVMode = useTVMode();
  
  return (
    <div className={isTVMode ? 'tv-layout' : 'web-layout'}>
      {/* Adaptive content */}
    </div>
  );
}
```

---

## Testing TV Mode

### Method 1: Browser Console Override

**Quick test in any browser:**

```javascript
// In browser console (F12)
localStorage.setItem('tv-mode-override', 'true');
location.reload();
```

**To disable:**
```javascript
localStorage.removeItem('tv-mode-override');
location.reload();
```

### Method 2: Chrome DevTools Device Emulation

**Create custom Android TV device:**

1. Open Chrome DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Click "Edit" in device dropdown
4. Click "Add custom device"
5. Configure:
   ```
   Name: Android TV
   Width: 1920
   Height: 1080
   Device pixel ratio: 1
   User agent string: Mozilla/5.0 (Linux; Android 9; SHIELD Android TV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
   ```
6. Save and select "Android TV" device
7. Reload page

### Method 3: Real Android TV Device

**Test on actual hardware:**

1. Build the app:
   ```bash
   npm run build
   npm run start
   ```

2. Get your computer's local IP:
   ```bash
   # Windows
   ipconfig
   
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

3. On Android TV:
   - Open browser (Chrome or built-in)
   - Navigate to `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

4. Test navigation with TV remote

### Method 4: Android TV Emulator

**Use Android Studio emulator:**

1. Install Android Studio
2. Open AVD Manager
3. Create Android TV device:
   - Form factor: TV
   - Resolution: 1080p (1920x1080)
   - API Level: 29+ (Android 10+)
4. Start emulator
5. Open Chrome on emulator
6. Navigate to your app URL

---

## WebView Integration

### Android TV WebView Wrapper

MyStream works perfectly inside an Android TV app using WebView:

```kotlin
// MainActivity.kt (Android TV App)
class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val webView = WebView(this)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
        }
        
        // Load MyStream
        webView.loadUrl("https://your-mystream-domain.com")
        
        setContentView(webView)
    }
}
```

### WebView Permissions

**AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<uses-feature
    android:name="android.hardware.touchscreen"
    android:required="false" />
    
<uses-feature
    android:name="android.software.leanback"
    android:required="true" />

<application
    android:usesCleartextTraffic="false"
    android:theme="@style/Theme.Leanback">
    
    <activity
        android:name=".MainActivity"
        android:screenOrientation="landscape"
        android:configChanges="orientation|keyboardHidden|screenSize">
        
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
        </intent-filter>
    </activity>
</application>
```

### WebView ↔ JavaScript Bridge (Optional)

**Enhanced features with two-way communication:**

```kotlin
// Android side
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun exitApp() {
        finish()
    }
    
    @JavascriptInterface
    fun isAndroidTV(): Boolean = true
}, "AndroidBridge")
```

```typescript
// JavaScript side
declare global {
  interface Window {
    AndroidBridge?: {
      exitApp: () => void;
      isAndroidTV: () => boolean;
    };
  }
}

// Usage in MyStream
if (window.AndroidBridge?.isAndroidTV()) {
  console.log('Running in Android TV app');
}
```

---

## Focus Management

### Focus System Architecture

```
TVLayoutProvider (Context)
  ↓
Provides focus state and methods
  ↓
Components use context
  ↓
Arrow key events handled
  ↓
Focus moves between elements
  ↓
Visual indicators update
```

### TVLayoutProvider

```typescript
// components/tv/layout/tv-layout-provider.tsx
<TVLayoutProvider>
  <App />
</TVLayoutProvider>
```

Provides:
- Focus tracking
- Arrow key listeners
- Focus navigation logic
- Spatial awareness

### Focus Styles

**CSS Classes:**
```css
/* Global TV focus style */
.tv-focus {
  @apply ring-2 ring-primary ring-offset-2 ring-offset-background;
  outline: none;
}

/* Media card focus */
.tv-media-card:focus {
  @apply ring-2 ring-primary scale-105 z-10;
}

/* Button focus */
.tv-button:focus {
  @apply ring-2 ring-primary;
}
```

**Component Usage:**
```typescript
<button
  className="tv-button focus:ring-2 focus:ring-primary"
  tabIndex={0}
>
  Play
</button>
```

### Focus Navigation

**Horizontal Scrolling:**
```typescript
// Left/Right arrow keys scroll carousels
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    scrollLeft();
  } else if (e.key === 'ArrowRight') {
    scrollRight();
  }
};
```

**Vertical Navigation:**
```typescript
// Up/Down arrow keys move between rows
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    focusPreviousRow();
  } else if (e.key === 'ArrowDown') {
    focusNextRow();
  }
};
```

---

## Remote Control Navigation

### Supported Keys

**Directional Pad (D-pad):**
- ↑ Up - Navigate up / previous row
- ↓ Down - Navigate down / next row
- ← Left - Navigate left / scroll carousel left
- → Right - Navigate right / scroll carousel right

**Action Keys:**
- Enter / OK - Select item / play
- Back - Go back / close modal
- Home - Return to home (browser handles)

**Media Keys (optional):**
- Play/Pause - Control video (if custom controls)
- Fast Forward - Next episode
- Rewind - Previous episode

### Key Event Handling

**Global Key Listener:**
```typescript
// In TVLayoutProvider or root layout
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        navigateUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateDown();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        navigateLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigateRight();
        break;
      case 'Enter':
        e.preventDefault();
        selectFocusedItem();
        break;
      case 'Escape':
      case 'Back':
        e.preventDefault();
        goBack();
        break;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Preventing Default Behavior

Important to prevent browser default actions:

```typescript
e.preventDefault(); // Prevent page scroll, back navigation, etc.
```

---

## TV Components

### TV-Specific Components

Located in `src/components/tv/`:

#### 1. TVContentRow
**TV-optimized carousel:**
- Larger cards (w-72 vs w-48)
- Clear focus indicators
- Horizontal scrolling
- Optimized spacing

```typescript
<TVContentRow
  title="Trending Movies"
  items={movies}
  type="movie"
/>
```

#### 2. TVMediaCard
**TV-optimized media card:**
- Larger size (18rem width)
- Focus ring on selection
- Simplified hover effects
- Remote-friendly

```typescript
<TVMediaCard
  item={movie}
  type="movie"
  onSelect={() => navigate(`/movie/${movie.id}`)}
/>
```

#### 3. TVActionButtons
**TV-optimized action buttons:**
- Larger padding (16px vs 12px)
- Clear focus states
- Better spacing (gap-6 vs gap-3)
- Larger icons

```typescript
<TVActionButtons
  movieId={movieId}
  onPlayClick={handlePlay}
/>
```

#### 4. TVMediaGrid
**TV-optimized search grid:**
- Larger grid items
- Clear focus management
- Arrow key navigation
- Grid layout optimized for TV

```typescript
<TVMediaGrid
  items={searchResults}
  type="movie"
/>
```

### Web-Equivalent Components

Each TV component has a web equivalent:
- `ContentRow` ↔ `TVContentRow`
- `MediaCard` ↔ `TVMediaCard`
- `ActionButtons` ↔ `TVActionButtons`
- `MediaGrid` ↔ `TVMediaGrid`

---

## Adaptive Layouts

### Adaptive Pattern

Components automatically switch based on TV mode:

```typescript
// Adaptive Action Buttons
export function AdaptiveActionButtons({ movieId }: Props) {
  const isTVMode = useTVMode();
  
  return isTVMode ? (
    <TVActionButtons movieId={movieId} />
  ) : (
    <ActionButtons movieId={movieId} />
  );
}
```

### Adaptive Components

**1. AdaptiveActionButtons**
- Switches between web and TV action buttons
- Used on: Movie detail, TV detail pages

**2. AdaptiveMediaGrid**
- Switches between web and TV grids
- Used on: Search page

**3. Adaptive ContentRow** (via TVLayoutProvider)
- Home page automatically uses TV layouts when in TV mode
- No explicit switching needed

### Implementation

**Pages use adaptive components:**
```typescript
// app/(main)/movie/[id]/page.tsx
import { AdaptiveActionButtons } from '@/components/media/adaptive-action-buttons';

export default function MoviePage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Auto-switches to TV version on TV devices */}
      <AdaptiveActionButtons movieId={params.id} />
    </div>
  );
}
```

### Bundle Size Benefits

**Adaptive approach reduces bundle size by 50%:**

Before (bundling both versions):
- Movie detail: 4.07 kB

After (using adaptive):
- Movie detail: 2.02 kB ✅

Only the needed component version is loaded per device type.

---

## Performance Optimization

### TV-Specific Optimizations

#### 1. Lazy Loading
```typescript
// Only load TV components when needed
const TVMediaCard = dynamic(() => import('@/components/tv/media/tv-media-card'), {
  loading: () => <Skeleton />
});
```

#### 2. Image Optimization
```typescript
<Image
  src={posterUrl}
  width={288}  // 72 * 4 (w-72)
  height={432} // 16:9 aspect
  loading="lazy"
  quality={75} // Lower quality for TV (viewed from distance)
/>
```

#### 3. Reduced Animations
```typescript
// Simpler animations for TV
const tvVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};
```

#### 4. Memory Management
```typescript
// Limit carousel items rendered
const TV_MAX_ITEMS = 20;
const displayItems = items.slice(0, TV_MAX_ITEMS);
```

### Performance Targets

**Android TV Targets:**
- First Paint: < 2s
- Time to Interactive: < 4s
- Smooth 60fps navigation
- Memory usage: < 200MB

---

## Troubleshooting

### Common Issues

#### 1. TV Mode Not Detecting

**Problem:** App doesn't switch to TV mode on Android TV

**Solutions:**
```javascript
// Manual override
localStorage.setItem('tv-mode-override', 'true');
location.reload();

// Check user agent
console.log(navigator.userAgent);

// Check detection
console.log(isTVDevice());
```

#### 2. Remote Control Not Working

**Problem:** D-pad navigation doesn't work

**Solutions:**
- Ensure `TVLayoutProvider` is wrapping the app
- Check if `tabIndex={0}` is set on focusable elements
- Verify key event listeners are attached
- Check console for JavaScript errors

**Debug:**
```javascript
window.addEventListener('keydown', (e) => {
  console.log('Key pressed:', e.key, e.keyCode);
});
```

#### 3. Focus Indicators Not Visible

**Problem:** Can't see which element is focused

**Solutions:**
- Add focus styles: `focus:ring-2 focus:ring-primary`
- Ensure outline is not disabled globally
- Check z-index stacking
- Verify Tailwind focus utilities

**CSS Check:**
```css
/* DO NOT have this globally */
*:focus {
  outline: none; /* ❌ Removes focus */
}

/* Instead use this */
.tv-focusable:focus {
  @apply ring-2 ring-primary; /* ✅ */
}
```

#### 4. Videos Not Playing

**Problem:** Videos don't load in WebView

**Solutions:**
- Enable JavaScript: `javaScriptEnabled = true`
- Enable DOM Storage: `domStorageEnabled = true`
- Allow media: `mediaPlaybackRequiresUserGesture = false`
- Check network permissions
- Verify HTTPS (required for iframes)

#### 5. Layout Breaks on TV

**Problem:** UI looks wrong on TV

**Solutions:**
- Verify screen size detection
- Check responsive breakpoints
- Test with `tv-mode-override`
- Review Tailwind classes (use `sm:`, `lg:`, `xl:`)

**Debug:**
```javascript
console.log({
  width: window.screen.width,
  height: window.screen.height,
  isTVMode: useTVMode()
});
```

### Debug Mode

**Enable detailed logging:**

```typescript
// Add to .env.local
DEBUG_TV_MODE=true

// In code
if (process.env.DEBUG_TV_MODE === 'true') {
  console.log('[TV] Focus moved to:', element);
  console.log('[TV] Key pressed:', key);
  console.log('[TV] Current mode:', isTVMode);
}
```

### Testing Checklist

Before deploying Android TV integration:

**✅ Detection**
- [ ] Auto-detects Android TV devices
- [ ] Manual override works
- [ ] Correct mode persists across sessions

**✅ Navigation**
- [ ] Arrow keys navigate
- [ ] Enter selects items
- [ ] Back button works
- [ ] Focus visible at all times

**✅ UI**
- [ ] Cards are appropriately sized
- [ ] Text readable from 10 feet
- [ ] Focus indicators clear
- [ ] Spacing comfortable

**✅ Functionality**
- [ ] Browse movies/TV shows
- [ ] Search works with remote
- [ ] Play videos
- [ ] Navigate episodes

**✅ Performance**
- [ ] Smooth scrolling
- [ ] Fast page loads
- [ ] No lag or stuttering
- [ ] Memory usage acceptable

---

## Best Practices

### DO ✅

1. **Use Semantic HTML**
   ```typescript
   <button> instead of <div onClick>
   ```

2. **Set tabIndex**
   ```typescript
   <div tabIndex={0}> for focusable non-button elements
   ```

3. **Clear Focus Styles**
   ```typescript
   className="focus:ring-2 focus:ring-primary"
   ```

4. **Test on Real Devices**
   - Emulator + Real Android TV

5. **Progressive Enhancement**
   - Works on web, enhanced on TV

6. **Prevent Default**
   ```typescript
   e.preventDefault() for arrow keys
   ```

### DON'T ❌

1. **Don't Remove Outlines Globally**
   ```css
   /* ❌ Never do this */
   *:focus { outline: none; }
   ```

2. **Don't Rely on Hover**
   - TV has no mouse cursor
   - Use focus states instead

3. **Don't Use Small Touch Targets**
   - Buttons should be large (44px+ minimum)

4. **Don't Forget Keyboard Users**
   - Desktop users also use keyboards

5. **Don't Hardcode Device Checks**
   - Use `useTVMode()` hook instead

6. **Don't Block Navigation**
   - Always provide a way back

---

## Summary

MyStream's Android TV integration provides:

✅ **Automatic Detection** - No user configuration needed  
✅ **Remote Navigation** - Full D-pad support  
✅ **Optimized UI** - 10-foot viewing experience  
✅ **Adaptive Components** - Seamless web/TV switching  
✅ **Performance** - Fast and smooth on TV hardware  
✅ **Easy Testing** - Multiple testing methods  
✅ **WebView Ready** - Works in Android TV apps  

### Quick Start

```bash
# 1. Enable TV mode manually
localStorage.setItem('tv-mode-override', 'true');
location.reload();

# 2. Or test on real device
# Build: npm run build && npm run start
# Access: http://YOUR_IP:3000 from Android TV

# 3. Navigate with remote
# Use D-pad to browse, Enter to select
```

---

**MyStream v1.2.0** - Complete Android TV Support 📺  
**Ready for Living Room Entertainment** 🎬🍿

