# Anime TMDB Conversion - Quick Reference Card

## ✅ COMPLETED

**All anime pages converted from AniList to TMDB API**

- Listing page (`/anime`)
- Detail page (`/anime/[id]`)
- Watch pages (UI only)
- Language support ready
- Documentation complete

## ⚠️ CRITICAL ISSUE

**Video playback is broken!**

**Why?** Streaming service expects AniList IDs, we now use TMDB IDs

**Fix:** See `STREAMING_SERVICE_ISSUE.md` for solutions

## 📁 Files Changed

```
✅ src/app/(main)/anime/page.tsx
✅ src/app/(main)/anime/[id]/page.tsx  
⚠️ src/app/watch/anime/[id]/page.tsx (UI only)
⚠️ src/app/watch/anime/[id]/[episode]/page.tsx (UI only)
✅ next.config.mjs
```

## 🎯 Quick Test

```bash
# 1. Clear browser cache
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# 2. Test listing page
http://localhost:3000/anime

# 3. Test detail page (Death Note)
http://localhost:3000/anime/13916

# 4. Test watch page (will load UI, video won't play)
http://localhost:3000/watch/anime/13916/1
```

## 🔧 Quick Fix for Streaming

**Option 1: Use VidSrc (Fastest)**
```typescript
// In watch pages, replace:
const iframeUrl = `https://megaplay.buzz/stream/ani/${animeId}/${episodeNum}/sub`;

// With:
const iframeUrl = `https://vidsrc2.ru/embed/tv/${animeId}/1/${episodeNum}`;
```

**Option 2: ID Mapping (Best)**
See `STREAMING_SERVICE_ISSUE.md` for implementation

## 📊 Test Anime IDs

| Anime | TMDB ID | AniList ID |
|-------|---------|------------|
| Death Note | 13916 | 21 |
| Naruto | 46260 | 20 |
| One Piece | 37854 | 21 |
| Attack on Titan | 1429 | 16498 |
| My Hero Academia | 65930 | 21459 |

## 🚨 Before Deployment

1. ✅ Code complete
2. ⚠️ **Fix streaming** (URGENT)
3. ✅ Test UI/UX
4. 📝 User announcement (cache clear)

## 📚 Full Docs

| Doc | Purpose |
|-----|---------|
| `CONVERSION_COMPLETE_SUMMARY.md` | Everything explained |
| `STREAMING_SERVICE_ISSUE.md` | **Read this first!** |
| `ANIME_TMDB_CONVERSION.md` | Technical details |
| `TMDB_LANGUAGE_IMPLEMENTATION.md` | Language setup |

## 💡 Key Changes

**API**: AniList → TMDB  
**IDs**: AniList IDs → TMDB IDs  
**Language**: ❌ → ✅ Built-in  
**Images**: AniList CDN → TMDB CDN  
**Metadata**: Basic → Rich (cast, trailers, etc.)  

## 🎯 Next Steps

1. **URGENT**: Implement ID mapping or change streaming service
2. Test video playback with fixes
3. Clear cache announcement to users
4. Monitor for issues
5. Plan favorites migration

---

**Need Help?** Read `STREAMING_SERVICE_ISSUE.md` first!
