# useSeasonDetails Import Error - Fixed ✅

## Issue
When loading a TV show details page, the error appeared:
```
useSeasonDetails is not defined
```

## Root Cause
The `useSeasonDetails` hook was being used in the component but was not imported from `@/hooks/tmdb/use-tv`.

## Solution
Added `useSeasonDetails` to the import statement in `src/app/(main)/tv/[id]/page.tsx`.

### Before:
```typescript
import { 
  useTVDetails, 
  useTVCredits, 
  useTVRecommendations,
  useSimilarTV,
  useTVImages,
  useTVVideos
} from '@/hooks/tmdb/use-tv';
```

### After:
```typescript
import { 
  useTVDetails, 
  useTVCredits, 
  useTVRecommendations,
  useSimilarTV,
  useTVImages,
  useTVVideos,
  useSeasonDetails  // ✅ Added this
} from '@/hooks/tmdb/use-tv';
```

## Status: ✅ FIXED
- Import added successfully
- No TypeScript errors
- Dev server compiled successfully
- Ready to test at http://localhost:3001

## Test Now:
Visit any TV show page and the Seasons & Episodes section should now work properly with the dropdown and episode cards!
