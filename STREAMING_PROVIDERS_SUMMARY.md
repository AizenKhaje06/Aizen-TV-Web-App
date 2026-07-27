# Streaming Providers Summary

## Quick Reference

### Movies & Anime Movies
**Provider:** CineSrc  
**URL:** `https://cinesrc.st/embed/movie/{tmdb_id}?autoplay=1&sub=en&quality=1080p`  
**Quality:** 1080p  
**Subtitles:** English (auto)  
**Buffering:** Fast ✅

### TV Shows & Anime Episodes
**Provider:** MoviesAPI  
**URL:** `https://moviesapi.to/tv/{tmdb_id}/{season}/{episode}`  
**Quality:** 1080p  
**Subtitles:** English (auto)  
**Buffering:** Fast ✅

---

## Usage in Code

```typescript
// Movies
const movieSource = buildMovieSource(movieId, title);
// → https://cinesrc.st/embed/movie/{id}?autoplay=1&sub=en&quality=1080p

// TV Shows & Anime
const episodeSource = buildEpisodeSource(tvId, season, episode, title);
// → https://moviesapi.to/tv/{id}/{season}/{episode}
```

---

## All Features Enabled

| Feature | Movies | TV Shows |
|---------|--------|----------|
| Autoplay | ✅ | ✅ |
| English Subtitles | ✅ | ✅ |
| Auto Fullscreen | ✅ | ✅ |
| 1080p Quality | ✅ | ✅ |
| Fast Buffering | ✅ | ✅ |

---

**Last Updated:** January 2025
