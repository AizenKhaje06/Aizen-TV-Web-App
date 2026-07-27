# TMDB API Language Implementation Guide

## Overview

All media pages (Movies, TV Shows, Anime) now use TMDB API with built-in language support. This document explains how language parameters work and how to customize them.

## Current Implementation

### 1. API Client Structure

```
axios-client.ts (Base HTTP client)
    ↓
tmdb/client.ts (TMDB API wrapper)
    ↓
tmdb/tv.service.ts (High-level TV service)
tmdb/movie.service.ts (High-level Movie service)
    ↓
hooks/tmdb/use-tv.ts (React Query hooks)
hooks/tmdb/use-movies.ts (React Query hooks)
    ↓
Pages (TV, Anime, Movies)
```

### 2. Language Parameter Flow

The language parameter can be passed through the chain:

```typescript
// Type definition in api.types.ts
interface PaginationParams {
  page?: number;
  language?: string;  // e.g., 'en-US', 'ja-JP', 'es-ES'
}

// Used in hooks
useTVDetails(tvId, { language: 'ja-JP' })

// Passed to service
tvService.getDetails(tvId, { language: 'ja-JP' })

// Sent to TMDB API
GET /tv/{id}?api_key=xxx&language=ja-JP
```

## How to Add Language Support

### Option 1: Global Language Setting (Recommended)

Add language preference to user settings store:

```typescript
// src/store/settings-store.ts
interface SettingsState {
  // ... existing settings
  preferredLanguage: string;
  setPreferredLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // ... existing state
      preferredLanguage: 'en-US',
      setPreferredLanguage: (language) => set({ preferredLanguage: language }),
    }),
    { name: 'settings-storage' }
  )
);
```

### Option 2: Modify Axios Client to Add Language Automatically

Update the request interceptor to add language to all requests:

```typescript
// src/services/api/axios-client.ts
this.instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get user's preferred language from settings store
    const preferredLanguage = useSettingsStore.getState().preferredLanguage || 'en-US';
    
    config.params = {
      ...config.params,
      api_key: env.NEXT_PUBLIC_TMDB_API_KEY,
      language: config.params?.language || preferredLanguage, // Allow override
    };
    return config;
  }
);
```

### Option 3: Pass Language Per Hook Call

Modify hooks to accept language parameter:

```typescript
// src/hooks/tmdb/use-tv.ts
export function useTVDetails(
  tvId: number, 
  options?: { language?: string }
): UseQueryResult<TVShowDetails> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_DETAILS, tvId, options?.language],
    queryFn: () => tmdbClient.getTVDetails(tvId, options?.language),
    enabled: !!tvId && tvId > 0,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
```

## Supported Languages

TMDB supports many languages using ISO 639-1 codes combined with ISO 3166-1 country codes:

### Popular Language Codes

| Code | Language |
|------|----------|
| `en-US` | English (United States) |
| `ja-JP` | Japanese |
| `ko-KR` | Korean |
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |
| `es-ES` | Spanish (Spain) |
| `es-MX` | Spanish (Mexico) |
| `fr-FR` | French |
| `de-DE` | German |
| `pt-BR` | Portuguese (Brazil) |
| `ru-RU` | Russian |
| `it-IT` | Italian |
| `ar-SA` | Arabic |
| `hi-IN` | Hindi |

### Full List
See: https://developers.themoviedb.org/3/configuration/get-primary-translations

## What Language Affects

When you change the language parameter, TMDB returns localized content for:

### 1. **Text Content**
- Movie/TV show titles
- Descriptions/overviews
- Episode titles and descriptions
- Genre names
- Cast/crew names (when available)
- Company names

### 2. **Images** (Partially)
- Logos: TMDB can return language-specific logos
- Posters: Some posters have language-specific text

### 3. **What Language DOESN'T Affect**
- Original titles (always available)
- Video player content (handled separately)
- Subtitles (handled by video player)
- Audio tracks (handled by video player)

## Example: Adding Language Selector UI

Create a language selector component:

```typescript
// src/components/settings/language-selector.tsx
'use client';

import { useSettingsStore } from '@/store/settings-store';

const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSelector() {
  const { preferredLanguage, setPreferredLanguage } = useSettingsStore();

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-300">
        Preferred Language
      </label>
      <select
        value={preferredLanguage}
        onChange={(e) => setPreferredLanguage(e.target.value)}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-400">
        Changes how titles, descriptions, and metadata are displayed
      </p>
    </div>
  );
}
```

Then add it to the settings page or profile page.

## Implementation Steps

### Step 1: Add Language to Settings Store ✅

1. Update `src/store/settings-store.ts`
2. Add `preferredLanguage` state
3. Add `setPreferredLanguage` action

### Step 2: Update Axios Client ✅

1. Modify `src/services/api/axios-client.ts`
2. Add language to request interceptor
3. Use preferredLanguage from settings store

### Step 3: Create Language Selector UI

1. Create `src/components/settings/language-selector.tsx`
2. Add to settings/profile page
3. Test language switching

### Step 4: Update React Query Keys

1. Include language in query keys for proper cache invalidation
2. When language changes, React Query will refetch data

```typescript
queryKey: [QUERY_KEYS.TV_DETAILS, tvId, language]
```

### Step 5: Handle Language Change

When user changes language:
```typescript
const handleLanguageChange = (newLanguage: string) => {
  setPreferredLanguage(newLanguage);
  
  // Invalidate all queries to refetch with new language
  queryClient.invalidateQueries();
  
  // Or be more specific
  queryClient.invalidateQueries([QUERY_KEYS.TV_DETAILS]);
  queryClient.invalidateQueries([QUERY_KEYS.MOVIE_DETAILS]);
};
```

## Best Practices

### 1. **Fallback to Original**
Always show original title if translated title is not available:
```typescript
const displayTitle = show.name || show.original_name;
```

### 2. **Cache by Language**
Include language in React Query keys:
```typescript
queryKey: ['tv-details', tvId, language]
```

### 3. **User Preference**
Remember user's language choice in localStorage/cookies

### 4. **Default Language**
Default to browser language or system locale:
```typescript
const defaultLanguage = navigator.language || 'en-US';
```

### 5. **Loading States**
Show loading indicator when switching languages

## Testing Language Support

### Manual Testing

1. Change language in settings
2. Navigate to TV/Movie/Anime pages
3. Verify titles are in selected language
4. Check episode descriptions
5. Verify fallback to English if translation unavailable

### Test Cases

```typescript
// Test with different languages
const languages = ['en-US', 'ja-JP', 'ko-KR', 'es-ES'];

languages.forEach(lang => {
  test(`Load anime with language: ${lang}`, async () => {
    const data = await tvService.getDetails(animeId, { language: lang });
    expect(data.name).toBeDefined();
  });
});
```

## Troubleshooting

### Issue: Language not changing
- Check if language parameter is being passed to API
- Verify React Query cache keys include language
- Clear browser cache and React Query cache

### Issue: Some content not translated
- Not all content has translations in all languages
- TMDB falls back to original language
- Check TMDB website to see if translation exists

### Issue: Wrong language showing
- Check browser locale settings
- Verify settings store is persisting correctly
- Check axios interceptor is adding language parameter

## Future Enhancements

- [ ] Auto-detect browser language
- [ ] Per-content language override
- [ ] Subtitle language preferences
- [ ] Audio track language preferences
- [ ] Multi-language search
- [ ] Language-specific genres/categories
- [ ] RTL (Right-to-Left) support for Arabic/Hebrew

## Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [TMDB Language Codes](https://developers.themoviedb.org/3/configuration/get-primary-translations)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [ISO 3166-1 Country Codes](https://en.wikipedia.org/wiki/ISO_3166-1)
