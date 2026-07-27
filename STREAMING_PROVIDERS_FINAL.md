# Final Streaming Providers Setup ✅

## Current Configuration

### Movies & Anime Movies
**Provider:** CineSrc  
**URL:** `https://cinesrc.st/embed/movie/{tmdb_id}?autoplay=1&sub=en&quality=1080p`  
**Features:**
- ✅ Autoplay
- ✅ English subtitles
- ✅ 1080p quality
- ✅ Fast buffering

### TV Shows & Anime Episodes
**Provider:** 2Embed  
**URL:** `https://www.2embed.online/tv-2embed.php?id={tmdb_id}&season={season}&episode={episode}`  
**Features:**
- ✅ Simple and reliable
- ✅ Good quality streaming
- ✅ Subtitle support
- ✅ Stable servers

---

## Available Providers

We have 3 providers registered for TV episodes:

### 1. 2Embed (Current - Active)
```typescript
twoembedProvider.getEpisodeUrl(tmdbId, season, episode)
// https://www.2embed.online/tv-2embed.php?id={id}&season={s}&episode={e}
```

### 2. VidSuper (Alternative)
```typescript
vidsuperProvider.getEpisodeUrl(tmdbId, season, episode)
// https://vidsuper.net/tv/{id}/{s}/{e}?autoplay=true&...&subtitle_delay=1
```
**Features:** Episode selector, skip intro, auto-next episode

### 3. MoviesAPI + Vidora (Alternative - Requires API)
```typescript
moviesapiVidoraProvider.fetchVidoraUrl(tmdbId, season, episode)
// Fetches: https://vidora.stream/embed/{video_id}
```
**Features:** Requires API call first

---

## Switching Providers

To switch from 2Embed to another provider, update `player-builder.ts`:

### Use VidSuper Instead
```typescript
export function buildEpisodeSource(...) {
  const url = vidsuperProvider.getEpisodeUrl(tmdbId, season, episode);
  return { url, type: 'tv', tmdbId, season, episode, title };
}
```

### Use Vidora Instead (Advanced)
Would need to modify watch pages to fetch URL first:
```typescript
const vidoraUrl = await moviesapiVidoraProvider.fetchVidoraUrl(tmdbId, season, episode);
```

---

## URL Examples

### Movie (CineSrc)
```
https://cinesrc.st/embed/movie/872585?autoplay=1&sub=en&quality=1080p
```

### TV Episode (2Embed)
```
https://www.2embed.online/tv-2embed.php?id=1399&season=1&episode=1
```

### TV Episode (VidSuper - Alternative)
```
https://vidsuper.net/tv/1399/1/1?autoplay=true&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&skip_intro=true&color=8B5CF6&subtitle_delay=1
```

---

## Testing

### Test 2Embed
1. Navigate to any TV show
2. Click any episode
3. Should load with 2Embed player
4. Check quality and subtitle sync

### Compare with VidSuper
To test VidSuper, temporarily change in `player-builder.ts`:
```typescript
const url = vidsuperProvider.getEpisodeUrl(tmdbId, season, episode);
```

---

## Comparison

| Feature | 2Embed | VidSuper |
|---------|--------|----------|
| Quality | Good | Good |
| Buffering | Fast | Fast |
| Subtitles | Yes | Yes (adjustable) |
| Episode Selector | No | Yes (built-in) |
| Skip Intro | No | Yes |
| Auto Next Episode | No | Yes |
| Complexity | Simple | Feature-rich |
| Reliability | Stable | Stable |

---

## Recommendation

**Current: 2Embed**
- Simple and straightforward
- Good for basic streaming needs
- Reliable servers

**Alternative: VidSuper**
- More features (episode selector, skip intro, auto-next)
- Better for binge-watching
- Subtitle timing adjustable

Choose based on your preference:
- Want simplicity? → Keep 2Embed
- Want features? → Switch to VidSuper

---

**Created:** January 2025  
**Status:** ✅ Working with 2Embed
**Alternative:** VidSuper available
