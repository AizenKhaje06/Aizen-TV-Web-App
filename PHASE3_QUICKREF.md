# Phase 3 Quick Reference Guide

## 🚀 Quick Start

### Environment Setup
```env
TMDB_API_KEY=3920fc0e7073b8d162a443df22158643
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

### Run the App
```bash
npm run dev     # Development server
npm run build   # Production build
npm start       # Run production build
```

---

## 📁 File Structure

### TMDB Services
```
src/services/tmdb/
├── client.ts              # HTTP client (Axios)
├── endpoints.ts           # API endpoint definitions
├── images.ts              # Image URL helpers
├── movies.service.ts      # Movie API methods
├── tv.service.ts          # TV show API methods
└── search.service.ts      # Search API methods
```

### React Query Hooks
```
src/hooks/tmdb/
├── use-movies.ts          # 9 movie hooks
├── use-tv.ts              # 7 TV show hooks
└── use-search.ts          # 3 search hooks
```

### Error Components
```
src/components/common/
├── api-error.tsx          # API error display
├── empty-state.tsx        # Empty state UI
└── error-boundary.tsx     # React error boundary
```

---

## 🎣 React Query Hooks Usage

### Movies
```typescript
import { useTrendingMovies, useMovieDetails } from '@/hooks/tmdb/use-movies';

// In component
const { data, isLoading, error } = useTrendingMovies();
const { data: movie } = useMovieDetails(movieId);
```

### TV Shows
```typescript
import { usePopularTV, useTVDetails } from '@/hooks/tmdb/use-tv';

const { data: shows } = usePopularTV();
const { data: tvShow } = useTVDetails(tvId);
```

### Search
```typescript
import { useMultiSearch } from '@/hooks/tmdb/use-search';

const { data: results } = useMultiSearch(query);
```

---

## 🖼️ Image Utilities

### Usage
```typescript
import { getPosterUrl, getBackdropUrl, getProfileUrl } from '@/services/tmdb/images';

// Poster images
getPosterUrl(path)           // Default: w500
getPosterUrl(path, 'w342')   // Small
getPosterUrl(path, 'original') // Full size

// Backdrop images
getBackdropUrl(path)         // Default: w1280
getBackdropUrl(path, 'w780') // Medium

// Profile images
getProfileUrl(path)          // Default: w185
getProfileUrl(path, 'h632')  // Large
```

### In JSX
```tsx
<Image
  src={getPosterUrl(movie.poster_path) || '/placeholder.jpg'}
  alt={movie.title}
  fill
/>
```

---

## 🎬 Available Hooks

### Movie Hooks (use-movies.ts)
| Hook | Description | Cache Time |
|------|-------------|------------|
| `useTrendingMovies()` | Trending movies this week | 1 hour |
| `usePopularMovies(params?)` | Popular movies | 1 hour |
| `useTopRatedMovies(params?)` | Top rated movies | 1 hour |
| `useUpcomingMovies(params?)` | Upcoming releases | 30 min |
| `useMovieDetails(id)` | Movie details | 24 hours |
| `useMovieCredits(id)` | Cast & crew | 24 hours |
| `useMovieRecommendations(id)` | Recommendations | 1 hour |
| `useSimilarMovies(id)` | Similar movies | 1 hour |
| `useMoviesByGenre(genreId, params?)` | Genre filtering | 1 hour |

### TV Hooks (use-tv.ts)
| Hook | Description | Cache Time |
|------|-------------|------------|
| `useTrendingTV()` | Trending TV shows | 1 hour |
| `usePopularTV(params?)` | Popular shows | 1 hour |
| `useTopRatedTV(params?)` | Top rated shows | 1 hour |
| `useAiringTodayTV(params?)` | Airing today | 30 min |
| `useTVDetails(id)` | TV show details | 24 hours |
| `useTVCredits(id)` | Cast & crew | 24 hours |
| `useTVRecommendations(id)` | Recommendations | 1 hour |

### Search Hooks (use-search.ts)
| Hook | Description | Cache Time |
|------|-------------|------------|
| `useMovieSearch(query)` | Search movies | 30 min |
| `useTVSearch(query)` | Search TV shows | 30 min |
| `useMultiSearch(query)` | Multi-search | 30 min |

---

## 🛠️ Service Methods

### Movies Service
```typescript
import { moviesService } from '@/services/tmdb/movies.service';

await moviesService.getTrending();
await moviesService.getPopular();
await moviesService.getTopRated();
await moviesService.getUpcoming();
await moviesService.getDetails(id);
await moviesService.getCredits(id);
await moviesService.getRecommendations(id);
await moviesService.getSimilar(id);
await moviesService.getByGenre(genreId);
```

### TV Service
```typescript
import { tvService } from '@/services/tmdb/tv.service';

await tvService.getTrending();
await tvService.getPopular();
await tvService.getTopRated();
await tvService.getAiringToday();
await tvService.getDetails(id);
await tvService.getCredits(id);
await tvService.getRecommendations(id);
```

### Search Service
```typescript
import { searchService } from '@/services/tmdb/search.service';

await searchService.searchMovies(query);
await searchService.searchTV(query);
await searchService.multiSearch(query);
```

---

## 🎨 Error Handling

### API Error Component
```tsx
import { ApiError } from '@/components/common/api-error';

<ApiError
  error={error}
  message="Failed to load content"
  onRetry={() => refetch()}
  showHomeButton={true}
/>
```

### Empty State Component
```tsx
import { EmptyState } from '@/components/common/empty-state';

<EmptyState
  icon="search"  // 'search' | 'film' | 'tv'
  title="No results found"
  description="Try different keywords"
  actionLabel="Go Home"
  onAction={() => router.push('/')}
/>
```

---

## 📄 Page Patterns

### Home Page Pattern
```tsx
'use client';

import { useTrendingMovies } from '@/hooks/tmdb/use-movies';

export default function HomePage() {
  const { data: movies, isLoading, error } = useTrendingMovies();
  
  if (isLoading) return <LoadingScreen />;
  if (error) return <ApiError error={error} />;
  
  return (
    <AppShell>
      {/* Content */}
    </AppShell>
  );
}
```

### Details Page Pattern
```tsx
'use client';

import React from 'react';
import { useMovieDetails } from '@/hooks/tmdb/use-movies';

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const movieId = parseInt(resolvedParams.id);
  
  const { data: movie, isLoading, error, refetch } = useMovieDetails(movieId);
  
  if (isLoading) return <LoadingScreen />;
  if (error) return <ApiError error={error} onRetry={() => refetch()} />;
  
  return <div>{/* Movie details */}</div>;
}
```

---

## 🔍 TypeScript Types

### Common Types
```typescript
import { Movie, MovieDetails, TVShow, TVDetails, Credits } from '@/types/media.types';

// Movie type
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

// Paginated response
interface MediaListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
```

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found: @tanstack/react-query-devtools"
**Solution:**
```bash
npm install @tanstack/react-query-devtools
```

### Issue: "Expected clientReferenceManifest to be defined"
**Solution:** Remove duplicate pages, clean build
```bash
Remove-Item -Recurse -Force .next
npm run build
```

### Issue: Next.js 15 async params error
**Solution:** Use `React.use()` to unwrap params
```typescript
import React from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  // ...
}
```

### Issue: Motion type conflicts
**Solution:** Use `HTMLMotionProps`
```typescript
import { HTMLMotionProps } from 'framer-motion';

interface Props extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  // props
}
```

---

## 📊 Performance Tips

### 1. Use React Query Cache
```typescript
// Data is cached automatically
const { data } = useTrendingMovies(); // Cached for 1 hour
```

### 2. Optimize Images
```tsx
<Image
  src={getPosterUrl(path)}
  alt={title}
  fill
  sizes="(max-width: 640px) 150px, 200px"
  loading="lazy"
/>
```

### 3. Enable Pagination
```typescript
const { data } = usePopularMovies({ page: 1 });
```

---

## 🧪 Testing Endpoints

### Test in Browser Console
```javascript
// Test movie endpoint
fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY')
  .then(r => r.json())
  .then(console.log);

// Test search
fetch('https://api.themoviedb.org/3/search/multi?api_key=YOUR_KEY&query=inception')
  .then(r => r.json())
  .then(console.log);
```

---

## 📝 Development Checklist

### Adding a New Page with TMDB Data
- [ ] Create page component in `src/app/`
- [ ] Import appropriate hook from `src/hooks/tmdb/`
- [ ] Handle loading state with `LoadingScreen`
- [ ] Handle error state with `ApiError`
- [ ] Handle empty state with `EmptyState`
- [ ] Use image helpers for TMDB images
- [ ] Add proper TypeScript types
- [ ] Test error scenarios

### Adding a New TMDB Endpoint
- [ ] Add endpoint to `src/services/tmdb/endpoints.ts`
- [ ] Create service method in appropriate service file
- [ ] Create React Query hook in `src/hooks/tmdb/`
- [ ] Define TypeScript types in `src/types/media.types.ts`
- [ ] Set appropriate cache time
- [ ] Test with real API key

---

## 🎯 Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Clean build
Remove-Item -Recurse -Force .next
npm run build
```

---

## 📚 Documentation Files

- `PHASE3_COMPLETE.md` - Full completion report
- `PHASE3_SUMMARY.md` - Detailed summary
- `PHASE3_BANNER.txt` - ASCII art banner
- `PHASE3_QUICKREF.md` - This file

---

## 🔗 Useful Links

- [TMDB API Docs](https://developers.themoviedb.org/3)
- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** Phase 3 Complete  
**MyStream v1.0.0**
