# Anime TMDB Conversion - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] All TypeScript files compile without errors
- [x] No ESLint warnings in anime pages
- [x] All imports updated from AniList to TMDB
- [x] Proper error handling implemented
- [x] Loading states working correctly

### ✅ Testing
- [ ] Clear browser cache before testing
- [ ] Anime listing page (`/anime`) loads correctly
- [ ] Hero banner auto-rotates every 8 seconds
- [ ] All carousels display anime content
- [ ] Click on anime opens detail page
- [ ] Detail page shows all sections (metadata, cast, episodes, etc.)
- [ ] Season selector dropdown works
- [ ] Episode thumbnails load
- [ ] Similar anime recommendations display
- [ ] Favorites add/remove works
- [ ] Mobile responsive design works
- [ ] Tablet responsive design works
- [ ] Desktop responsive design works

### ⚠️ Known Issues
- [ ] **CRITICAL**: Video playback broken (streaming service expects AniList IDs)
  - Solution: Implement ID mapping or change streaming service
  - See: `STREAMING_SERVICE_ISSUE.md`

### 📝 Documentation
- [x] Technical documentation complete (`ANIME_TMDB_CONVERSION.md`)
- [x] Quick summary created (`ANIME_CONVERSION_SUMMARY.md`)
- [x] Streaming issue documented (`STREAMING_SERVICE_ISSUE.md`)
- [x] Language implementation guide (`TMDB_LANGUAGE_IMPLEMENTATION.md`)
- [x] Quick reference card (`QUICK_REFERENCE.md`)
- [x] Deployment checklist (`DEPLOYMENT_CHECKLIST.md`)

### 🔒 Security
- [x] TMDB API key properly stored in `.env.local`
- [x] No hardcoded credentials in code
- [x] Image domains properly configured in `next.config.mjs`
- [x] CORS headers configured for streaming services

### 🚀 Performance
- [x] React Query caching configured
- [x] Image optimization enabled
- [x] Lazy loading implemented
- [x] Code splitting working

## Deployment Steps

### Step 1: Prepare Environment

```bash
# 1. Ensure all dependencies are installed
npm install

# 2. Verify environment variables
cat .env.local | grep TMDB

# Expected output:
# NEXT_PUBLIC_TMDB_API_KEY=your_key_here
# NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
# NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

### Step 2: Build and Test

```bash
# 1. Run development build
npm run dev

# 2. Test anime pages
# - http://localhost:3000/anime
# - http://localhost:3000/anime/13916 (Death Note)
# - http://localhost:3000/anime/46260 (Naruto)

# 3. Check browser console for errors
# Press F12 and check Console tab

# 4. Stop dev server (Ctrl+C)
```

### Step 3: Production Build

```bash
# 1. Create production build
npm run build

# 2. Check for build errors
# If errors occur, fix them before proceeding

# 3. Test production build locally
npm run start

# 4. Test anime pages again
# - http://localhost:3000/anime
# - http://localhost:3000/anime/13916
```

### Step 4: Deploy

**Option A: Vercel**
```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts
# 4. Test deployed URL
```

**Option B: Docker**
```bash
# 1. Build Docker image
docker build -t aizen-tv-app .

# 2. Run container
docker run -p 3000:3000 aizen-tv-app

# 3. Test at http://localhost:3000
```

**Option C: Other Platforms**
- Follow platform-specific deployment guides
- Ensure environment variables are set
- Configure build command: `npm run build`
- Configure start command: `npm run start`

### Step 5: Post-Deployment Verification

1. **Smoke Tests**
   - [ ] Homepage loads
   - [ ] Anime listing page loads
   - [ ] Click anime opens detail page
   - [ ] Images load correctly
   - [ ] Navigation works
   - [ ] Responsive design works

2. **Performance Tests**
   - [ ] Page load time < 3 seconds
   - [ ] Images load progressively
   - [ ] No console errors
   - [ ] React Query caching works

3. **Cross-Browser Tests**
   - [ ] Chrome/Edge (Chromium)
   - [ ] Firefox
   - [ ] Safari (if available)
   - [ ] Mobile browsers

## Post-Deployment Tasks

### 1. User Communication

**Announcement Template:**

```
🎉 Anime Section Updated!

We've upgraded the anime section with better features:
✅ High-quality images from TMDB
✅ Detailed episode information
✅ Cast & crew with photos
✅ Official trailers
✅ Better recommendations

⚠️ IMPORTANT:
- Clear your browser cache (Ctrl+Shift+R)
- Re-add anime to your favorites (IDs have changed)
- Video playback temporarily unavailable (fix coming soon)

Thank you for your patience!
```

### 2. Monitor for Issues

**First 24 Hours:**
- Check error logs frequently
- Monitor user reports
- Watch for API rate limits
- Check image loading issues

**First Week:**
- Track user engagement
- Monitor API usage
- Collect feedback
- Identify common issues

### 3. Implement Streaming Fix

**Priority: URGENT**

Follow guide in `STREAMING_SERVICE_ISSUE.md`:

1. Choose solution (ID mapping recommended)
2. Implement chosen solution
3. Test with popular anime
4. Deploy streaming fix
5. Announce fix to users

### 4. Optional Enhancements

After streaming fix:
- [ ] Add language selector in settings
- [ ] Implement watch history
- [ ] Add more anime categories
- [ ] Refine anime filtering
- [ ] Add anime studios page

## Rollback Plan

If critical issues occur:

### Option 1: Quick Rollback (Revert to AniList)

```bash
# 1. Checkout previous commit
git log --oneline | head -10
git checkout <commit-before-conversion>

# 2. Rebuild and deploy
npm run build
vercel --prod
```

### Option 2: Disable Anime Section

```typescript
// In src/app/(main)/anime/page.tsx
export default function AnimePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-4">
          Anime Section Under Maintenance
        </h1>
        <p className="text-gray-400">
          We're working on improvements. Check back soon!
        </p>
      </div>
    </div>
  );
}
```

### Option 3: Partial Rollback

Keep detail page with TMDB, revert listing page to AniList if needed.

## Monitoring Endpoints

### Health Check URLs

Monitor these URLs post-deployment:

1. **Anime Listing**: `https://your-domain.com/anime`
   - Expected: 200 OK, loads within 3s
   
2. **Anime Detail**: `https://your-domain.com/anime/13916`
   - Expected: 200 OK, loads within 2s
   
3. **API Status**: Check TMDB API status
   - https://status.themoviedb.org/

### Error Tracking

Set up error tracking with:
- Sentry
- LogRocket
- Datadog
- Or custom logging

## Success Criteria

Deployment is successful when:

✅ **Functionality**
- All pages load without errors
- Navigation works correctly
- Images display properly
- Data fetches correctly from TMDB

✅ **Performance**
- Page load time < 3 seconds
- Image load time < 2 seconds
- No memory leaks
- API calls optimized

✅ **User Experience**
- Responsive design works
- Loading states smooth
- Error messages clear
- Intuitive navigation

✅ **Stability**
- No console errors
- No 404s or 500s
- API rate limits respected
- Cache working correctly

## Emergency Contacts

- **TMDB API Support**: https://www.themoviedb.org/talk/category/5047951f760ee3318900009a
- **Next.js Discord**: https://discord.gg/nextjs
- **Vercel Support**: support@vercel.com

## Files to Watch

These files are critical for anime functionality:

```
src/app/(main)/anime/page.tsx
src/app/(main)/anime/[id]/page.tsx
src/app/watch/anime/[id]/page.tsx
src/app/watch/anime/[id]/[episode]/page.tsx
src/hooks/tmdb/use-tv.ts
src/services/tmdb/tv.service.ts
next.config.mjs
```

## Post-Mortem Template

After deployment, document:

1. **What Went Well**
   - List successful aspects
   - What worked as expected

2. **What Went Wrong**
   - List issues encountered
   - How they were resolved

3. **Lessons Learned**
   - Key takeaways
   - Process improvements

4. **Action Items**
   - Follow-up tasks
   - Future improvements

## Sign-Off

Before marking deployment as complete:

- [ ] All tests passed
- [ ] Documentation updated
- [ ] Team notified
- [ ] Users communicated with
- [ ] Monitoring set up
- [ ] Rollback plan ready
- [ ] Streaming fix scheduled

**Deployed By:** _________________

**Date:** _________________

**Version:** _________________

**Sign-Off:** _________________

---

## Need Help?

1. Check documentation in order:
   - `QUICK_REFERENCE.md` (start here)
   - `CONVERSION_COMPLETE_SUMMARY.md` (overview)
   - `STREAMING_SERVICE_ISSUE.md` (critical issue)
   - `ANIME_TMDB_CONVERSION.md` (technical details)

2. Check error logs
3. Review browser console
4. Test with known working anime IDs
5. Verify TMDB API key is valid

**Remember**: The streaming service issue is documented and solvable. Don't panic!
