# Homepage Content Reorganization

## Overview
Reorganized the homepage content sections to provide better content discovery with genre-based browsing and trending content.

## New Section Structure

### After Hero Section:

1. **Continue Watching** - User's watch history
2. **Trending Right Now** - Top 10 trending movies (limited to 10)
3. **Studio & Platforms** - Popular movies from various studios
4. **New Movies** - Upcoming releases
5. **Popular TV Shows** - Most popular TV series
6. **Action** - Action genre movies
7. **Comedy** - Comedy genre movies
8. **Drama** - Drama genre movies
9. **Horror** - Horror genre movies
10. **Sci-Fi** - Science Fiction movies
11. **Thriller** - Thriller genre movies
12. **Romance** - Romance genre movies
13. **Animation** - Animated movies
14. **Crime** - Crime genre movies
15. **Documentary** - Documentary films
16. **Trending Anime** - Japanese animation series

## TMDB Genre IDs Used

```typescript
const GENRE_IDS = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  SCI_FI: 878,
  THRILLER: 53,
  ROMANCE: 10749,
  ANIMATION: 16,
  CRIME: 80,
  DOCUMENTARY: 99,
};
```

## Implementation Details

### Trending Right Now
- Shows only **top 10** trending movies
- Uses: `trendingMovies?.slice(0, 10)`
- Updates every hour (stale time: 1 hour)

### Studio & Platforms
- Rebranded from "Popular on MyStream"
- Shows popular movies across different studios/platforms
- Uses: `usePopularMovies()` hook

### New Movies
- Rebranded from "Coming Soon"
- Shows upcoming movie releases
- Uses: `useUpcomingMovies()` hook

### Genre Sections
- Each genre fetches movies using `useMoviesByGenre(genreId)`
- Separate API calls for each genre
- Cached for 1 hour to reduce API calls
- All genres enabled by default

### Trending Anime
- Filters trending TV shows for:
  - Japanese origin (`origin_country` includes 'JP')
  - OR Animation genre (genre_id 16)
- Shows trending anime/animation series
- Uses: `useTrendingTV()` with filtering

## Data Fetching Strategy

**Parallel Fetching:**
- All content sections load simultaneously
- React Query handles caching and deduplication
- Stale time prevents unnecessary re-fetches

**Loading States:**
- Each row has independent loading state
- Shows skeleton loaders while fetching
- Sections appear as data becomes available

**Performance:**
- Genre queries cached for 1 hour
- Prevents redundant API calls
- Total: ~15 API calls on initial page load
- Subsequent visits use cached data

## User Experience Benefits

✅ **Better Discovery** - Genre-based browsing  
✅ **Focused Trending** - Top 10 only, not overwhelming  
✅ **Organized Content** - Clear section hierarchy  
✅ **Diverse Content** - Multiple genres available  
✅ **Anime Section** - Dedicated anime/animation row  
✅ **Fresh Content** - New movies section  
✅ **Platform Diversity** - Studio & Platforms section

## API Usage

**Initial Page Load:**
- 1 x Trending Movies
- 1 x Popular Movies
- 1 x Upcoming Movies
- 1 x Popular TV
- 1 x Trending TV
- 10 x Genre Movies (Action, Comedy, Drama, etc.)
- **Total: 15 API calls**

**Cached:**
- All queries cached for 1 hour
- Hero movie images cached for 24 hours
- Reduces API usage on subsequent visits

## Future Enhancements

- Add "Load More" for each genre
- Implement infinite scroll
- Add genre filtering/sorting
- User preferences for genre order
- Hide/show genre sections
- Add "Because You Watched" personalization
- Implement Studio/Platform filtering
- Add release year filters
