# Anime Pages TMDB API Conversion

## Overview
Successfully converted both anime pages to use TMDB API with language support:
1. **Anime Listing Page** (`/anime`) - Displays anime categories and browse sections
2. **Anime Detail Page** (`/anime/[id]`) - Shows detailed anime information with seasons/episodes

Both pages now match the TV page implementation and use the unified TMDB API.

## Changes Made

### 1. **Anime Listing Page (`/anime/page.tsx`)**
- ✅ Replaced AniList hooks with TMDB TV hooks
- ✅ Filters TV shows to get anime only (Japanese origin OR animation genre)
- ✅ Uses same data structure as TV page
- ✅ Categories reorganized:
  - Continue Watching (popular anime)
  - Trending Anime
  - Top Rated Anime
  - Action Anime (filtered by genre)
  - Comedy Anime (filtered by genre)
  - Drama Anime (filtered by genre)
  - Sci-Fi & Fantasy Anime (filtered by genre)
  - Mystery Anime (filtered by genre)
  - Popular Anime
  - Recommended For You
- ✅ Hero banner with auto-rotation
- ✅ TMDB logo support
- ✅ Play button routes to `/watch/anime/{id}/1/1`

### 2. **Anime Detail Page (`/anime/[id]/page.tsx`)**
### 2. **Anime Detail Page (`/anime/[id]/page.tsx`)**
- ✅ Replaced AniList API calls with TMDB API calls
- ✅ Now uses the same hooks as TV page:
  - `useTVDetails()` - Fetch anime details
  - `useTVCredits()` - Fetch cast and crew
  - `useTVRecommendations()` - Fetch recommendations
  - `useSimilarTV()` - Fetch similar anime
  - `useTVImages()` - Fetch logos, posters, backdrops
  - `useTVVideos()` - Fetch trailers and videos
  - `useSeasonDetails()` - Fetch season and episode information

### 2. **Language Support**
- ✅ TMDB API automatically handles language preferences
- ✅ Language parameter is included in all API calls via `PaginationParams`
- ✅ The axios client automatically adds the language parameter to requests
- ✅ Default language can be configured in the application settings

### 3. **Data Structure Updates**
- Changed from AniList data format to TMDB data format
- Updated all data mappings to use TMDB field names:
  - `name` instead of `title.english/romaji`
  - `backdrop_path` instead of `bannerImage`
  - `poster_path` instead of custom poster handling
  - `vote_average` instead of `averageScore/10`
  - `genres` (array of objects) instead of `genres` (array of strings)
  - `seasons` with episode data instead of manual episode counting

### 4. **UI Components**
- ✅ Season & Episode selector with dropdown (matching TV page)
- ✅ Episode thumbnails from TMDB still images
- ✅ Episode metadata (air date, rating, runtime)
- ✅ Horizontal scrolling with left/right navigation arrows
- ✅ TMDB logo display support
- ✅ Cast & Crew section with profile images
- ✅ Trailer integration via YouTube
- ✅ Similar anime recommendations
- ✅ More like this recommendations

### 5. **Routing Updates**
- Play button now routes to: `/watch/anime/${animeId}/${seasonNumber}/${episodeNumber}`
- Episode cards route to: `/watch/anime/${animeId}/${selectedSeasonNumber}/${episode.episode_number}`
- Similar anime cards route to: `/anime/${id}`

### 6. **Favorite System**
- Updated favorite type from `'tv'` to `'anime'` for proper categorization
- Uses the same user store as other media types

## How Anime Filtering Works in TMDB

TMDB doesn't have a separate "anime" category. Instead, anime are TV shows that can be identified by:

1. **Origin Country**: `origin_country` includes `'JP'` (Japan)
2. **Genre**: `genre_ids` includes `16` (Animation)

The filtering function:
```typescript
const isAnime = (show: any) => {
  return show.origin_country?.includes('JP') || show.genre_ids?.includes(16);
};
```

This approach captures:
- Japanese anime series
- Animated shows from Japan
- Some Western animation (can be refined further if needed)

## Files Modified
- `src/app/(main)/anime/page.tsx` - Complete rewrite to use TMDB API
- `src/app/(main)/anime/[id]/page.tsx` - Complete rewrite to use TMDB API
- `next.config.mjs` - Added AniList domain (temporary, for old cached data)

## Benefits of TMDB API

1. **Unified Data Source**: All content (movies, TV shows, anime) now comes from TMDB
2. **Better Language Support**: TMDB provides automatic language-based content
3. **Rich Metadata**: More detailed information including:
   - Production companies/studios
   - Cast and crew with photos
   - Episode thumbnails and descriptions
   - Ratings and vote counts
   - Air dates
   - Trailers and videos
4. **Consistent UI**: Anime page now matches TV page exactly
5. **Better Image Quality**: TMDB provides high-quality images in multiple sizes

## How Language Works

The language support is built into the TMDB API integration:

1. **API Configuration** (`axios-client.ts`):
   - Automatically adds `api_key` to all requests
   - Language parameter can be added via `PaginationParams`

2. **Request Parameters** (`PaginationParams` interface):
   ```typescript
   interface PaginationParams {
     page?: number;
     language?: string; // e.g., 'en-US', 'ja-JP', 'es-ES'
   }
   ```

3. **TMDB Language Format**:
   - Uses ISO 639-1 language codes (e.g., 'en', 'ja', 'es')
   - Combined with ISO 3166-1 country codes (e.g., 'en-US', 'ja-JP')
   - Default is usually 'en-US'

4. **Where Language Affects**:
   - Content descriptions/overviews
   - Titles and names
   - Episode titles and descriptions
   - Genre names
   - Cast/crew names (when available in that language)

## Testing Recommendations

1. **Clear browser cache** - Important! Old AniList data may be cached
2. Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
3. Test anime listing page (`/anime`)
4. Test anime detail pages with different IDs from TMDB
5. Verify season/episode navigation works correctly
6. Check that play button routes to correct watch page
7. Test favorite add/remove functionality
8. Verify images load correctly (backdrop, poster, episode stills)
9. Test trailer playback
10. Check responsive design on mobile/tablet
11. Verify similar anime and recommendations display correctly
12. Test genre filtering in listing page

## Known Limitations

1. **Anime Detection**: The current filter (`origin_country === 'JP' OR genre === 16`) may include some non-anime content. Can be refined by:
   - Adding additional filters for Japanese language
   - Excluding certain genres
   - Using more specific TMDB discover parameters

2. **Smaller Dataset**: TMDB has fewer anime entries compared to AniList (anime-specific database)

3. **Metadata Differences**: Some anime-specific metadata from AniList may not be available in TMDB:
   - Studio information might be less accurate
   - Anime-specific tags/categories
   - Japanese air dates might differ

## Future Enhancements

Consider adding:
- More refined anime filtering (e.g., exclude certain non-anime animation)
- Language selector in user settings
- Multiple audio track support
- Subtitle language preferences
- Anime-specific genres and tags via TMDB discover
- Watch progress tracking per episode
- Episode watched/unwatched indicators
- Season pack downloads
- Anime studios filtering
- Year/season filtering (Winter 2024, Spring 2024, etc.)

## Migration Notes

### For Users:
- **Clear browser cache** after deployment to avoid image loading errors
- Anime IDs have changed from AniList IDs to TMDB IDs
- Favorites will need to be re-added (different ID system)
- Watch history may need to be migrated

### For Developers:
- AniList hooks are no longer used for anime pages
- Can remove AniList dependencies if not used elsewhere:
  - `src/hooks/anilist/use-anime.ts`
  - `src/services/anilist/`
- The `s4.anilist.co` domain in next.config.mjs can be removed after cache clears

## Related Files (No Changes Needed)
- `src/hooks/tmdb/use-tv.ts` - Already supports all needed functionality
- `src/services/tmdb/tv.service.ts` - Already configured
- `src/services/tmdb/client.ts` - Already has language support
- `src/services/api/axios-client.ts` - Handles API requests with language
- `src/types/api.types.ts` - Already has `PaginationParams` with language
