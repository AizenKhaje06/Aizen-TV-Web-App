# Build Cache Fix

**Date:** January 2025  
**Issue:** Black screen on app load with module not found errors  
**Status:** Fixed ✅

---

## Problem

After adding sidebar navigation, the app showed a black screen on load with errors:

```
TypeError: Cannot read properties of undefined (reading '/_app')
Error: Cannot find module './628.js'
Error: Cannot find module './611.js'
```

### Root Cause

**Stale Build Cache** - The `.next` folder contained outdated build artifacts that referenced old module IDs that no longer existed after the sidebar changes.

### Why It Happened

When we:
1. Created new pages (movies, tv, favorites, profile, kids, anime, live)
2. Modified AppShell to use Sidebar
3. Added Sidebar component

Next.js build cache became inconsistent with the new file structure, causing module resolution failures.

---

## Solution

**Clean rebuild** - Delete `.next` cache and rebuild from scratch.

### Steps Taken

1. **Stop dev server**
   ```bash
   # Stopped running process
   ```

2. **Delete build cache**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

3. **Rebuild application**
   ```bash
   npm run build
   ```
   Result: ✅ Build successful (0 errors)

4. **Restart dev server**
   ```bash
   npm run dev
   ```
   Result: ✅ Server running at http://localhost:3000

---

## Verification

### Build Output
```
✓ Compiled successfully in 15.4s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (13/13)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size  First Load JS
┌ ○ /                                 3.87 kB         225 kB
├ ○ /anime                            3.46 kB         160 kB
├ ○ /favorites                        2.7 kB          168 kB
├ ○ /kids                             3.46 kB         160 kB
├ ○ /live                             3.45 kB         160 kB
├ ƒ /movie/[id]                       4.12 kB         225 kB
├ ○ /movies                           4.37 kB         219 kB
├ ○ /profile                          6.78 kB         164 kB
├ ○ /search                           4.28 kB         222 kB
├ ○ /tv                               4.33 kB         218 kB
└ ƒ /tv/[id]                          4.2 kB          225 kB
```

### Dev Server Output
```
✓ Ready in 3.3s
- Local:   http://localhost:3000
- Network: http://192.168.100.107:3000
```

---

## When to Clean Build Cache

### Scenarios That May Require Cache Cleaning

1. **Adding/removing pages** - New routes or deleted routes
2. **Major component refactoring** - Changing component structure
3. **Moving files** - Relocating components or pages
4. **Dependency updates** - After updating major dependencies
5. **Strange build errors** - Module not found, undefined reading errors
6. **After git pull** - If someone else made major changes

### Quick Clean Commands

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

**Mac/Linux:**
```bash
rm -rf .next
npm run build
```

**Or use npm script:**
```bash
npm run clean  # If you have a clean script
npm run build
```

---

## Prevention

### Best Practices

1. **Clean rebuild after major changes**
   - After adding multiple new pages
   - After major refactoring
   - Before deploying to production

2. **Git ignore .next folder**
   - Already in `.gitignore`
   - Never commit build artifacts
   - Each developer builds their own

3. **CI/CD always clean builds**
   - Deployment pipelines should always do fresh builds
   - No cache from previous builds

---

## Related Issues

### Similar Errors You Might See

```
Error: Cannot find module './[number].js'
TypeError: Cannot read properties of undefined
Module not found: Can't resolve './[file]'
Dynamic require of "[file]" is not supported
```

**Solution:** Clean `.next` folder and rebuild

---

## Troubleshooting

### If Problem Persists

1. **Delete node_modules and reinstall**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

3. **Delete all build artifacts**
   ```bash
   rm -rf .next
   rm -rf node_modules
   rm -rf package-lock.json
   npm install
   npm run build
   ```

4. **Check for file permission issues**
   - Ensure you have write access to `.next` folder
   - On Windows, close any file explorers viewing the folder

---

## Summary

**Problem:** Black screen with module not found errors  
**Cause:** Stale build cache in `.next` folder  
**Solution:** Delete `.next` and rebuild  
**Result:** ✅ App works correctly  

### Commands Used
```bash
Remove-Item -Recurse -Force .next  # Clean cache
npm run build                       # Rebuild
npm run dev                         # Start dev server
```

**Status:** Fixed and running ✅  
**App URL:** http://localhost:3000  

---

**MyStream** - Build Cache Fixed  
**All systems operational** 🚀

