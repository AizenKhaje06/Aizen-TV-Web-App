# VidSrc Streaming Domains

**Last Updated:** January 2025

---

## Current Active Domain

**Primary:** `https://vidsrc2.ru/embed`

---

## All Active Domains (Live)

The following domains are currently operational and can be used interchangeably:

1. `vidsrc2.ru` ⭐ **(Currently Used)**
2. `vidsrcme.ru`
3. `vidsrcme.su`
4. `vidsrc-me.ru`
5. `vidsrc-me.su`
6. `vidsrc-embed.ru`
7. `vidsrc-embed.su`
8. `vsrc.su`

---

## URL Format

### Movies
```
https://vidsrc2.ru/embed/movie/{tmdb_id}
```

**Example:**
```
https://vidsrc2.ru/embed/movie/603
```

### TV Shows
```
https://vidsrc2.ru/embed/tv/{tmdb_id}/{season}/{episode}
```

**Example:**
```
https://vidsrc2.ru/embed/tv/1396/1/1
```

---

## Implementation

The VidSrc provider is located at:
```
src/services/player/vidsrc.ts
```

### Current Configuration

```typescript
const VIDSRC_BASE_URL = 'https://vidsrc2.ru/embed';
```

### Domain Validation

The provider validates URLs against all known active domains:

```typescript
validateUrl(url: string): boolean {
  const validDomains = [
    'vidsrc2.ru',
    'vidsrcme.ru',
    'vidsrcme.su',
    'vidsrc-me.ru',
    'vidsrc-me.su',
    'vidsrc-embed.ru',
    'vidsrc-embed.su',
    'vsrc.su'
  ];
  return validDomains.includes(urlObj.hostname) && 
         urlObj.pathname.startsWith('/embed');
}
```

---

## Switching Domains

If the current domain stops working, you can easily switch to another:

### Option 1: Update the Provider (Recommended)
Edit `src/services/player/vidsrc.ts`:

```typescript
const VIDSRC_BASE_URL = 'https://vidsrcme.ru/embed'; // Change domain here
```

### Option 2: Use Environment Variable (Future Enhancement)
Currently hardcoded, but can be made configurable:

```env
NEXT_PUBLIC_PLAYER_BASE_URL=https://vidsrcme.ru/embed
```

Then update the provider to use:
```typescript
const VIDSRC_BASE_URL = process.env.NEXT_PUBLIC_PLAYER_BASE_URL || 'https://vidsrc2.ru/embed';
```

---

## Domain Status Monitoring

**How to Check:**
1. Visit the domain in a browser
2. Try loading a test movie or episode
3. Verify the embed loads without errors

**Test URLs:**
- Movie: `https://vidsrc2.ru/embed/movie/603` (The Matrix)
- TV: `https://vidsrc2.ru/embed/tv/1396/1/1` (Breaking Bad S01E01)

---

## Fallback Strategy

### Current
- Single domain with manual switching
- Hardcoded in provider

### Future Enhancement
```typescript
// Multi-provider fallback
const VIDSRC_DOMAINS = [
  'https://vidsrc2.ru/embed',
  'https://vidsrcme.ru/embed',
  'https://vsrc.su/embed'
];

// Try each domain until one works
async function getWorkingUrl(tmdbId: number): Promise<string> {
  for (const domain of VIDSRC_DOMAINS) {
    const url = `${domain}/movie/${tmdbId}`;
    if (await testUrl(url)) return url;
  }
  throw new Error('No working provider found');
}
```

---

## Notes

### Why Multiple Domains?
- Redundancy and reliability
- Load balancing
- Regional availability
- Domain rotation

### Provider Changes
VidSrc frequently rotates domains to maintain service. This list should be updated periodically.

### Security
All domains use HTTPS and are validated before use. Only domains in the whitelist are accepted.

---

## Maintenance

**When to Update:**
- Domain stops working (404 or timeout)
- New domains become available
- Old domains are deprecated

**How to Update:**
1. Update `VIDSRC_BASE_URL` in `vidsrc.ts`
2. Add new domains to `validDomains` array
3. Update this documentation
4. Test with sample content
5. Rebuild and redeploy

---

## Support

If all domains fail:
1. Check VidSrc status pages
2. Look for new domain announcements
3. Consider alternative providers
4. Implement fallback provider in `providers.ts`

---

**Document Version:** 1.0  
**Last Verified:** January 2025  
**Status:** All domains active ✅
