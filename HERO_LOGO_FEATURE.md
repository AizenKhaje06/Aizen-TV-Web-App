# Hero Section Movie Logo Feature

## Overview
Updated the hero banner to display official movie logos instead of plain text titles, providing a more cinematic and professional appearance.

## Implementation

### 1. TMDB Images API Integration
Added support for fetching movie images including logos from TMDB API:

**Files Modified:**
- `src/services/tmdb/endpoints.ts` - Added `MOVIE_IMAGES` and `TV_IMAGES` endpoints
- `src/services/tmdb/client.ts` - Added `getMovieImages()` method
- `src/services/tmdb/movies.service.ts` - Added `getImages()` service method
- `src/hooks/tmdb/use-movies.ts` - Added `useMovieImages()` hook
- `src/services/tmdb/images.ts` - Already had `getLogoUrl()` utility function

### 2. Hero Banner Component
Updated to support optional logo display:

**Changes to `hero-banner.tsx`:**
- Added `logoPath?: string | null` prop
- Logo display logic:
  - If `logoPath` exists: Display logo image (responsive sizes)
  - If `logoPath` is null/undefined: Fallback to text title
- Logo sizing:
  - Mobile: max-width 300px, height 96px (h-24)
  - Medium: max-width 400px, height 128px (h-32)  
  - Large: max-width 500px, height 160px (h-40)
- Logo positioning: `object-contain object-left` for proper alignment

### 3. Homepage Integration
Updated homepage to fetch and use movie logos:

**Changes to `page.tsx`:**
- Import `useMovieImages` hook and `getLogoUrl` utility
- Fetch images for hero movie: `useMovieImages(heroMovie?.id || 0)`
- Extract logo path: `heroImages?.logos?.[0]?.file_path`
- Convert to URL: `getLogoUrl(logoPath, 'large')`
- Pass to HeroBanner: `logoPath={heroLogo}`

## How It Works

1. Homepage loads trending movies
2. First trending movie becomes hero content
3. Separate API call fetches movie images (logos, posters, backdrops)
4. If logo exists, it's displayed instead of text title
5. Logo is sized responsively and aligned left
6. If no logo available, falls back to text title

## TMDB Images API Response

```typescript
{
  id: number;
  backdrops: Array<{
    file_path: string;
    width: number;
    height: number;
  }>;
  logos: Array<{
    file_path: string;
    width: number;
    height: number;
  }>;
  posters: Array<{
    file_path: string;
    width: number;
    height: number;
  }>;
}
```

## Logo Sizes

Using TMDB's logo size options:
- `w45` - Extra small (45px wide)
- `w92` - Small (92px wide)
- `w185` - Large (185px wide) - **We use this**
- `original` - Original size

## Benefits

✅ More cinematic and professional appearance  
✅ Matches streaming platform UX (Netflix, Disney+, etc.)  
✅ Better brand recognition for movies  
✅ Automatic fallback to text if logo unavailable  
✅ Responsive sizing for all screen sizes  
✅ Cached API responses (24 hours stale time)

## Future Enhancements

- Add logo support for TV shows
- Implement logo language selection (en, es, fr, etc.)
- Add shadow/outline effects for better logo visibility
- Preload logos for faster hero rendering
