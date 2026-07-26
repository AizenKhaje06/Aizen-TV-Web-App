# Anime Episode Thumbnails via TMDB Integration

## Overview
Since AniList API doesn't provide episode thumbnails, we now automatically match anime to TMDB (The Movie Database) to fetch episode images.

## How It Works

### 1. **TMDB Matcher Service** (`src/services/anime/tmdb-matcher.ts`)
   - Searches TMDB for TV shows matching the anime title
   - Cleans titles for better matching (removes special characters, season numbers)
   - Calculates match confidence: `high`, `medium`, `low`
   - Caches matches in-memory to avoid repeated API calls

### 2. **Title Matching Algorithm**
   - **High confidence**: Exact match or very close title + matching year
   - **Medium confidence**: Contains match or 70%+ word overlap
   - **Low confidence**: Weak match (not used)

### 3. **Episode Thumbnail Fetching**
   - Once matched, fetches all episode thumbnails for the season
   - Maps episode numbers to TMDB `still_path` images
   - Uses Next.js Image optimization via `getBackdropUrl()`

### 4. **Fallback Behavior**
   - If no TMDB match found → shows gradient placeholder with episode number
   - If episode has no thumbnail → same gradient fallback
   - Seamless experience regardless of thumbnail availability

## Implementation Details

### Auto-matching Trigger
```typescript
// Triggers when:
- Anime details page loads
- User selects a different season
- Season data changes
```

### Console Logs
```
✅ TMDB Match found for "Attack on Titan": Attack on Titan (24 thumbnails)
❌ No TMDB match found for "Obscure Anime Title"
```

### Key Functions

**`getCachedTMDBMatch(title, year)`**
- Searches TMDB with caching
- Returns: `{ tmdbId, name, year, confidence }`

**`getSeasonThumbnails(tmdbId, seasonNumber)`**
- Fetches all episode stills for a season
- Returns: `Map<episodeNumber, still_path>`

**`getBackdropUrl(path, size)`**
- Converts TMDB path to optimized Next.js image URL
- Size: 'small' | 'medium' | 'large' | 'original'

## Example Matches

| Anime (AniList) | TMDB Match | Confidence |
|----------------|------------|------------|
| Attack on Titan | Attack on Titan | High ✅ |
| Shingeki no Kyojin | Attack on Titan | Medium ✅ |
| My Hero Academia Season 2 | My Hero Academia | High ✅ |
| Boku no Hero Academia | My Hero Academia | High ✅ |
| Demon Slayer | Demon Slayer: Kimetsu no Yaiba | Medium ✅ |
| One Piece | One Piece | High ✅ |

## UI Changes

### Episode Card (With Thumbnail)
```
┌─────────────────────┐
│  [EP 1]     [24m]  │  ← Badges over thumbnail
│                     │
│   TMDB Thumbnail    │  ← Episode still image
│                     │
└─────────────────────┘
  Episode 1 Title
```

### Episode Card (No Thumbnail)
```
┌─────────────────────┐
│  [EP 1]     [24m]  │  ← Badges over gradient
│                     │
│        1            │  ← Large episode number (opacity 20%)
│                     │
└─────────────────────┘
  Episode 1 Title
```

## Performance Optimizations

1. **In-Memory Cache**: TMDB matches cached per session
2. **Single API Call**: All episode thumbnails fetched at once per season
3. **React Effect**: Only runs when anime/season changes
4. **Async Loading**: Thumbnails load without blocking UI
5. **Next.js Image**: Automatic optimization and lazy loading

## Files Modified

- ✅ `src/services/anime/tmdb-matcher.ts` (NEW)
- ✅ `src/app/(main)/anime/[id]/page.tsx` (UPDATED)

## Testing

Test with these anime IDs:
- **Attack on Titan**: `/anime/16498` (should have thumbnails)
- **My Hero Academia**: `/anime/21459` (should have thumbnails)
- **Demon Slayer**: `/anime/101922` (should have thumbnails)
- **One Piece**: `/anime/21` (should have thumbnails)
- **Obscure anime**: May not have TMDB match → shows placeholders

## Future Improvements

- [ ] Add manual TMDB ID override in UI
- [ ] Support multi-season anime (map AniList seasons to TMDB seasons)
- [ ] Add thumbnail loading skeleton
- [ ] Show confidence level in dev mode
- [ ] Fallback to other anime databases if TMDB fails
