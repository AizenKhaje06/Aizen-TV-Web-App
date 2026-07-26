# Episode Thumbnail Debugging - Runtime Investigation ✅

## Changes Made

### 1. ✅ Added Console Logging
Added debug logs to track:
- Episode number and name
- Raw `still_path` value from TMDB
- Generated image URL from `getBackdropUrl()`

### 2. ✅ Replaced Next.js `<Image>` with Plain `<img>`
Temporarily using plain HTML `<img>` to isolate the issue:
- If `<img>` works → Problem is with Next.js Image component
- If `<img>` fails → Problem is with the URL or TMDB data

### 3. ✅ Verified Next.js Image Configuration
Checked `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'image.tmdb.org',  ← ✅ Configured correctly
      pathname: '/t/p/**',
    }
  ]
}
```

## How to Debug

### Step 1: Open Browser Console
1. Navigate to: **http://localhost:3000/tv/{tvShowId}**
   - Example: http://localhost:3000/tv/1396 (Breaking Bad)
2. Open Developer Tools (F12)
3. Go to **Console** tab

### Step 2: Check Debug Logs
Look for logs like:
```
=== EPISODE THUMBNAIL DEBUG ===
Episode: 1 Pilot
still_path: /abc123.jpg
Generated URL: https://image.tmdb.org/t/p/w780/abc123.jpg
===============================
```

### Step 3: Verify URL in Browser
1. Copy the "Generated URL" from console
2. Paste it directly in browser address bar
3. Check if image loads:
   - ✅ Image loads → TMDB API is working, URL is correct
   - ❌ 404 Error → TMDB doesn't have image for this episode
   - ❌ Other error → Network/API issue

### Step 4: Check Network Tab
1. Go to **Network** tab in Dev Tools
2. Filter by "Img"
3. Look for requests to `image.tmdb.org`
4. Check status codes:
   - `200` → Image loaded successfully
   - `404` → Image not found on TMDB
   - `403` → Access denied (check API key)

### Step 5: Inspect HTML Element
1. Right-click on episode card
2. Select "Inspect Element"
3. Check the `<img>` tag:
```html
<img 
  src="https://image.tmdb.org/t/p/w780/abc123.jpg"
  alt="Episode Name"
  class="w-full h-full object-cover"
>
```

## Expected Results

### If `<img>` Works:
✅ Episodes show thumbnails
✅ Console shows valid URLs
✅ Network tab shows 200 status
→ **Next.js Image component can be re-enabled**

### If `<img>` Doesn't Work:
❌ Episode thumbnails missing
❌ Console shows null URLs or errors
❌ Network tab shows 404 errors
→ **Issue is with TMDB data or API**

## Possible Issues & Solutions

### Issue 1: `still_path` is null
**Console shows:** `still_path: null`
**Reason:** TMDB doesn't have thumbnails for these episodes
**Solution:** Use fallback TV icon (already implemented)

### Issue 2: Invalid URL format
**Console shows:** Malformed URL
**Reason:** Bug in `getBackdropUrl()` function
**Solution:** Check `src/services/tmdb/images.ts`

### Issue 3: TMDB API returns empty episodes
**Console shows:** No debug logs (episodes array is empty)
**Reason:** Season data not loading from TMDB
**Solution:** Check `useSeasonDetails()` hook and API call

### Issue 4: Next.js Image optimization blocked
**Browser shows:** Error about image optimization
**Reason:** Next.js config issue
**Solution:** Already verified config is correct

## Current Code Location

**File:** `src/app/(main)/tv/[id]/page.tsx`

**Debug code (lines ~485-500):**
```typescript
{(() => {
  const imageUrl = getBackdropUrl(episode.still_path, 'w780');
  console.log('=== EPISODE THUMBNAIL DEBUG ===');
  console.log('Episode:', episode.episode_number, episode.name);
  console.log('still_path:', episode.still_path);
  console.log('Generated URL:', imageUrl);
  console.log('===============================');
  return null;
})()}
{episode.still_path ? (
  <img
    src={getBackdropUrl(episode.still_path, 'w780') || ''}
    alt={episode.name}
    className="w-full h-full object-cover"
  />
) : (
  <div>Fallback TV icon</div>
)}
```

## Next Steps Based on Results

### If images load with `<img>`:
1. Remove console.log debugging
2. Replace `<img>` back to Next.js `<Image>`:
```typescript
<Image
  src={getBackdropUrl(episode.still_path, 'w780') || ''}
  alt={episode.name}
  fill
  className="object-cover"
/>
```

### If images don't load:
1. Check TMDB API response in Network tab
2. Verify episode data has `still_path`
3. Test with different TV show (some may not have episode images)
4. Check TMDB API key validity

## Test TV Shows

**Known to have episode images:**
- Breaking Bad (ID: 1396)
- Game of Thrones (ID: 1399)
- Stranger Things (ID: 66732)
- House of the Dragon (ID: 94997)

**Test URL:**
http://localhost:3000/tv/1396

## Status
- ✅ Debug logs added
- ✅ Using plain `<img>` temporarily
- ✅ Next.js config verified
- ⏳ Waiting for runtime results from browser console
