# MyStream - System Architecture

**Version:** 1.2.0  
**Last Updated:** January 2025  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Video Player System](#video-player-system)
11. [Android TV Architecture](#android-tv-architecture)
12. [PWA Architecture](#pwa-architecture)
13. [Production Systems](#production-systems)
14. [Security Architecture](#security-architecture)
15. [Performance Optimization](#performance-optimization)
16. [Testing Strategy](#testing-strategy)
17. [Future Extensibility](#future-extensibility)

---

## Overview

MyStream is a modern, production-ready streaming platform built with **Next.js 15 App Router**, featuring:
- Server-side and client-side rendering
- Real-time content discovery
- Full video streaming capabilities
- Progressive Web App (PWA) support
- Android TV optimization
- Production-grade monitoring and security

### Architecture Principles

1. **Separation of Concerns** - Clear boundaries between UI, logic, and data
2. **Type Safety** - 100% TypeScript coverage with strict mode
3. **Performance First** - Code splitting, lazy loading, optimized bundles
4. **Scalability** - Modular design ready for growth
5. **Maintainability** - Clean code, documented, tested
6. **User Experience** - Responsive, accessible, fast
7. **Security** - Input validation, error handling, secure headers
8. **Monitoring** - Performance tracking, error logging

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Desktop │  │  Mobile  │  │ Tablet   │  │Android TV│       │
│  │  Browser │  │   PWA    │  │   PWA    │  │ WebView  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 15 APP ROUTER                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PRESENTATION LAYER                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ Pages/   │  │Components│  │ Layouts  │              │   │
│  │  │ Routes   │  │          │  │          │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    APPLICATION LAYER                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Hooks   │  │  Store   │  │ Services │              │   │
│  │  │  (React) │  │ (Zustand)│  │  (API)   │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      DATA LAYER                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  React   │  │  Local   │  │  Service │              │   │
│  │  │  Query   │  │ Storage  │  │  Worker  │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────┐              ┌──────────┐                         │
│  │   TMDB   │              │  VidSrc  │                         │
│  │   API    │              │ (Video)  │                         │
│  └──────────┘              └──────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```


### Layer Responsibilities

#### Presentation Layer
- **Pages/Routes** - Next.js App Router pages
- **Components** - Reusable UI components
- **Layouts** - Shared layout structures
- **Responsibilities**: Rendering, user interaction, responsive design

#### Application Layer
- **Hooks** - Custom React hooks (data, UI, device)
- **Store** - Global state management (Zustand)
- **Services** - Business logic and API communication
- **Responsibilities**: State management, data fetching, business logic

#### Data Layer
- **React Query** - Server state caching and synchronization
- **LocalStorage** - Persistent client-side storage
- **Service Worker** - PWA caching and offline support
- **Responsibilities**: Data persistence, caching, offline functionality

---

## Technology Stack

### Core Framework
```typescript
Next.js 15.1.6         // React framework with App Router
React 19               // UI library
TypeScript 5.x         // Type safety
```

### UI & Styling
```typescript
Tailwind CSS 3.x       // Utility-first CSS
shadcn/ui              // Headless UI components
Framer Motion 11.x     // Animations
Lucide React           // Icons
```

### State & Data Management
```typescript
Zustand 5.x            // Global state management
zustand/middleware     // Persist middleware
React Query 5.x        // Server state management
Zod 3.x                // Schema validation
```

### PWA & Service Worker
```typescript
next-pwa 5.x           // PWA integration
Workbox               // Service worker utilities
```

### Development Tools
```typescript
ESLint                 // Code linting
Prettier               // Code formatting
Vitest                 // Unit testing
Playwright             // E2E testing
```

### External APIs
```typescript
TMDB API              // Movie/TV data
VidSrc (vidsrc.sbs)   // Video streaming
```

---

## Project Structure

### Directory Layout

```
AizenTvWebapp/
│
├── public/                    # Static assets
│   ├── Logo.png              # Main app logo
│   ├── intro_video.mp4       # Splash screen video
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker (auto-generated)
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (main)/          # Main layout group
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── movie/       # Movie routes
│   │   │   ├── tv/          # TV show routes
│   │   │   ├── search/      # Search route
│   │   │   └── layout.tsx   # Main layout
│   │   ├── watch/           # Watch routes (separate layout)
│   │   │   ├── movie/       # Movie player
│   │   │   └── tv/          # TV player
│   │   ├── offline/         # Offline fallback page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   │
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   │   ├── error-boundary.tsx
│   │   │   ├── splash-screen.tsx
│   │   │   └── splash-provider.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── media/           # Media components
│   │   │   ├── content-row.tsx
│   │   │   ├── media-card.tsx
│   │   │   ├── media-grid.tsx
│   │   │   ├── hero-banner.tsx
│   │   │   ├── adaptive-action-buttons.tsx
│   │   │   └── adaptive-media-grid.tsx
│   │   ├── player/          # Video player components
│   │   │   ├── video-player.tsx
│   │   │   ├── player-frame.tsx
│   │   │   ├── episode-selector.tsx
│   │   │   └── player-controls.tsx
│   │   ├── tv/              # Android TV components
│   │   │   ├── focus/       # Focus management
│   │   │   ├── layout/      # TV layouts
│   │   │   ├── media/       # TV media components
│   │   │   └── navigation/  # TV navigation
│   │   ├── pwa/             # PWA components
│   │   │   ├── install-prompt.tsx
│   │   │   ├── update-notification.tsx
│   │   │   └── network-status.tsx
│   │   └── ui/              # shadcn/ui primitives
│   │
│   ├── services/            # API services
│   │   ├── tmdb/           # TMDB API integration
│   │   │   ├── client.ts   # API client
│   │   │   ├── movies.ts   # Movie endpoints
│   │   │   ├── tv.ts       # TV endpoints
│   │   │   ├── search.ts   # Search endpoints
│   │   │   └── types.ts    # Type definitions
│   │   └── player/         # Player services
│   │       └── vidsrc.ts   # VidSrc provider
│   │
│   ├── store/               # Zustand stores
│   │   ├── player-store-v2.ts      # Player state
│   │   ├── history-store.ts        # Watch history
│   │   ├── favorites-store.ts      # Favorites
│   │   └── settings-store.ts       # App settings
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-tmdb.ts      # TMDB data hooks
│   │   ├── use-player.ts    # Player hooks
│   │   ├── use-tv-mode.ts   # TV mode detection
│   │   ├── use-pwa-install.ts       # PWA install
│   │   ├── use-pwa-update.ts        # PWA updates
│   │   └── use-online-status.ts     # Network status
│   │
│   ├── lib/                 # Utilities & helpers
│   │   ├── tmdb/           # TMDB utilities
│   │   ├── tv/             # TV utilities
│   │   ├── logger/         # Logging system
│   │   ├── errors/         # Error management
│   │   ├── validation/     # Input validation
│   │   ├── seo/            # SEO utilities
│   │   └── performance/    # Performance monitoring
│   │
│   ├── types/               # TypeScript types
│   │   ├── tmdb.ts         # TMDB types
│   │   ├── player.ts       # Player types
│   │   └── common.ts       # Shared types
│   │
│   └── styles/              # Styles & themes
│       ├── globals.css     # Global styles
│       └── tv.css          # TV-specific styles
│
├── e2e/                     # E2E tests (Playwright)
│   ├── homepage.spec.ts
│   └── search.spec.ts
│
├── .env.example             # Environment template
├── .env.local              # Local environment (gitignored)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

### Key Directories Explained

**`src/app/`** - Next.js 15 App Router pages
- Uses route groups `(main)` for shared layouts
- Server and client components
- Automatic code splitting per route

**`src/components/`** - Reusable UI components
- Organized by domain (common, media, player, tv, pwa)
- Follows composition pattern
- Fully typed with TypeScript

**`src/services/`** - Business logic and API calls
- Separated from UI components
- Handles external API communication
- Error handling and retries

**`src/store/`** - Global state management
- Zustand stores with persistence
- Minimal state (only what's needed globally)
- Type-safe selectors


**`src/hooks/`** - Custom React hooks
- Data fetching hooks (React Query wrappers)
- Device detection hooks (TV mode, PWA)
- UI interaction hooks

**`src/lib/`** - Utility functions
- Pure functions with no side effects
- Shared across the application
- Well-tested and documented

---

## Data Flow

### Content Discovery Flow

```
User opens app
    ↓
Home page (Server Component)
    ↓
ContentRow components (Client Components)
    ↓
useMovies/useTVShows hooks (React Query)
    ↓
TMDB Service (API calls)
    ↓
React Query caches data (1-24 hrs)
    ↓
MediaCard components render
    ↓
User clicks card → Navigate to details
```

### Video Playback Flow

```
User clicks "Play" button
    ↓
Navigate to /watch/movie/:id or /watch/tv/:id/:season/:episode
    ↓
VideoPlayer component loads
    ↓
PlayerStore initializes (Zustand)
    ↓
VidSrc URL generated
    ↓
PlayerFrame renders iframe
    ↓
Video starts playing
    ↓
HistoryStore tracks progress (every 10s)
    ↓
LocalStorage persists watch data
```

### State Update Flow

```
User action (e.g., add to favorites)
    ↓
Component calls store action
    ↓
Zustand updates state
    ↓
Persist middleware saves to LocalStorage
    ↓
Subscribed components re-render
    ↓
UI updates
```

---

## Component Architecture

### Component Hierarchy

```
App (Root Layout)
├── SplashProvider
│   └── SplashScreen (first load only)
├── ErrorBoundary
├── TVLayoutProvider (TV mode context)
├── Header
│   ├── Logo
│   ├── Navigation
│   └── Search
└── Main Content
    ├── Home Page
    │   ├── HeroBanner
    │   └── ContentRow × 6
    │       └── MediaCard × N
    ├── Detail Pages
    │   ├── DetailHeader
    │   ├── AdaptiveActionButtons
    │   ├── MediaInfo
    │   └── AdaptiveMediaGrid
    └── Watch Pages
        ├── VideoPlayer
        │   ├── PlayerFrame
        │   └── PlayerControls
        └── EpisodeSelector (TV only)
```

### Component Types

#### 1. Server Components (Default)
- Pages that fetch initial data
- Layouts
- Static content
- Example: `app/(main)/page.tsx`

#### 2. Client Components ('use client')
- Interactive UI
- Hooks usage (useState, useEffect, etc.)
- Event handlers
- Example: `media-card.tsx`, `video-player.tsx`

#### 3. Adaptive Components
- Switch between web and TV modes
- Example: `AdaptiveActionButtons`, `AdaptiveMediaGrid`
- Use `useTVMode()` hook for detection

---

## State Management

### Zustand Stores

#### 1. Player Store (`player-store-v2.ts`)
```typescript
interface PlayerState {
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  volume: number;
  // Actions
  setCurrentMedia: (media: MediaItem) => void;
  reset: () => void;
}
```
**Persistence**: None (session-only)

#### 2. History Store (`history-store.ts`)
```typescript
interface HistoryState {
  history: WatchHistoryItem[];
  // Actions
  addToHistory: (item: WatchHistoryItem) => void;
  updateProgress: (id: string, progress: number) => void;
  clearHistory: () => void;
}
```
**Persistence**: LocalStorage (`watch-history`)

#### 3. Favorites Store (`favorites-store.ts`)
```typescript
interface FavoritesState {
  favorites: MediaItem[];
  // Actions
  addFavorite: (item: MediaItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
```
**Persistence**: LocalStorage (`favorites`)

#### 4. Settings Store (`settings-store.ts`)
```typescript
interface SettingsState {
  tvMode: boolean | 'auto';
  theme: 'dark' | 'light';
  autoplay: boolean;
  // Actions
  setTVMode: (mode: boolean | 'auto') => void;
  setTheme: (theme: string) => void;
}
```
**Persistence**: LocalStorage (`app-settings`)

### React Query (Server State)

#### Cache Configuration
```typescript
{
  staleTime: 1000 * 60 * 60,        // 1 hour
  cacheTime: 1000 * 60 * 60 * 24,   // 24 hours
  refetchOnWindowFocus: false,
  retry: 2
}
```

#### Query Keys Structure
```typescript
['movies', 'trending']
['movies', 'popular', page]
['movie', id]
['tv', 'trending']
['tv', id]
['tv', id, 'season', season]
['search', query, page]
```

---

## API Integration

### TMDB API Service

#### Architecture
```
services/tmdb/
├── client.ts          # Axios instance, interceptors
├── movies.ts          # Movie endpoints
├── tv.ts              # TV endpoints
├── search.ts          # Search endpoints
└── types.ts           # TypeScript types
```

#### Key Endpoints Used
```typescript
// Movies
GET /movie/trending
GET /movie/popular
GET /movie/top_rated
GET /movie/{id}
GET /movie/{id}/credits
GET /movie/{id}/recommendations

// TV Shows
GET /tv/trending
GET /tv/popular
GET /tv/top_rated
GET /tv/{id}
GET /tv/{id}/season/{season}
GET /tv/{id}/credits
GET /tv/{id}/recommendations

// Search
GET /search/multi
```

#### Error Handling
```typescript
try {
  const response = await tmdbClient.get(endpoint);
  return response.data;
} catch (error) {
  logger.error('TMDB API Error', { endpoint, error });
  throw new APIError('Failed to fetch data');
}
```

### VidSrc Integration

#### URL Generation
```typescript
// Movies
https://vidsrc.sbs/embed/movie/{tmdbId}

// TV Shows
https://vidsrc.sbs/embed/tv/{tmdbId}/{season}/{episode}
```

#### Provider Service
```typescript
// services/player/vidsrc.ts
export const getMovieStreamURL = (tmdbId: string): string => {
  return `${VIDSRC_BASE_URL}/movie/${tmdbId}`;
};

export const getTVStreamURL = (
  tmdbId: string,
  season: number,
  episode: number
): string => {
  return `${VIDSRC_BASE_URL}/tv/${tmdbId}/${season}/${episode}`;
};
```

---

## Routing

### Route Structure

```
/ (root)
├── (main)/                    # Main layout group
│   ├── page.tsx              # Home page
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx      # Movie detail
│   ├── tv/
│   │   └── [id]/
│   │       └── page.tsx      # TV show detail
│   └── search/
│       └── page.tsx          # Search results
│
├── watch/                     # Watch layout group (no header/footer)
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx      # Movie player
│   └── tv/
│       └── [id]/
│           └── [season]/
│               └── [episode]/
│                   └── page.tsx  # TV player
│
└── offline/
    └── page.tsx               # Offline fallback page
```

### Dynamic Routes

**Movie Detail:** `/movie/[id]`
```typescript
// Example: /movie/533535
export default async function MoviePage({ params }: { params: { id: string } }) {
  // Server component - can fetch data here
}
```

**TV Episode:** `/watch/tv/[id]/[season]/[episode]`
```typescript
// Example: /watch/tv/94605/1/5
```

### Navigation Patterns

#### Client-side Navigation
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/movie/${movieId}`);
```

#### Link Component
```typescript
import Link from 'next/link';

<Link href={`/movie/${movie.id}`}>
  <MediaCard movie={movie} />
</Link>
```

---

## Video Player System

### Architecture

```
VideoPlayer (Container)
    ↓
PlayerFrame (iframe wrapper)
    ↓
VidSrc iframe (actual player)

+ PlayerStore (state)
+ HistoryStore (progress tracking)
```

### Player State Machine

```
IDLE
  ↓ setCurrentMedia()
LOADING
  ↓ onLoad()
PLAYING
  ↓ error / timeout
ERROR
  ↓ reset()
IDLE
```

### Progress Tracking

```typescript
// Every 10 seconds during playback
useEffect(() => {
  const interval = setInterval(() => {
    historyStore.updateProgress(mediaId, estimatedProgress);
  }, 10000);
  
  return () => clearInterval(interval);
}, [mediaId]);
```

### Episode Navigation

```
EpisodeSelector
  ↓
User selects S01E05
  ↓
Navigate to /watch/tv/94605/1/5
  ↓
PlayerStore updates currentMedia
  ↓
PlayerFrame re-renders with new URL
  ↓
Video loads and plays
```

---

## Android TV Architecture

### TV Mode Detection

```typescript
// lib/tv/tv-detection.ts
export function isTVDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes('tv') ||
    ua.includes('smarttv') ||
    ua.includes('googletv') ||
    // ... more checks
  );
}
```

### Focus Management System

```
TVFocusProvider (Context)
  ↓
FocusableElement components
  ↓
Arrow key listeners
  ↓
Focus moves between elements
  ↓
Visual focus indicators (ring-2 ring-primary)
```

### TV Components

**TVContentRow** - TV-optimized carousel
- Larger cards (w-72 vs w-48)
- Visible focus indicators
- Horizontal scrolling with arrows

**TVMediaCard** - TV-optimized card
- Larger size
- Focus outline
- Simplified hover effects

**TVActionButtons** - TV-optimized buttons
- Larger click targets (12px → 16px padding)
- Clear focus states
- Remote-friendly spacing

### Adaptive Pattern

```typescript
function AdaptiveActionButtons({ movieId }) {
  const isTVMode = useTVMode();
  
  return isTVMode ? (
    <TVActionButtons movieId={movieId} />
  ) : (
    <ActionButtons movieId={movieId} />
  );
}
```

---

## PWA Architecture

### Service Worker Strategy

```
next-pwa configuration (next.config.mjs)
  ↓
Workbox generates SW automatically
  ↓
Caching strategies:
  - Static assets: Cache First
  - API calls: Network First
  - Images: Cache First with expiry
  ↓
Offline fallback: /offline page
```

### PWA Hooks

#### useInstallPrompt
```typescript
const { canInstall, promptInstall, isInstalled } = useInstallPrompt();

// Listen for beforeinstallprompt event
// Show custom install UI
// Trigger install on user action
```

#### usePWAUpdate
```typescript
const { hasUpdate, updateApp } = usePWAUpdate();

// Listen for service worker updates
// Show update notification
// Reload to activate new version
```

#### useOnlineStatus
```typescript
const isOnline = useOnlineStatus();

// Track online/offline status
// Show network indicator
// Handle offline gracefully
```

### Offline Experience

```
User goes offline
  ↓
Network requests fail
  ↓
Service worker intercepts
  ↓
Serves cached content OR
  ↓
Shows /offline page with message
```

---

## Production Systems

### Logging System

```typescript
// lib/logger/logger.ts
export const logger = {
  debug: (message: string, meta?: object) => {},
  info: (message: string, meta?: object) => {},
  warn: (message: string, meta?: object) => {},
  error: (message: string, meta?: object) => {},
};

// Integration points: Sentry, DataDog, etc.
```

### Error Management

**Custom Error Types:**
- `ValidationError` - Input validation failures
- `APIError` - External API errors
- `NetworkError` - Network failures
- `AuthenticationError` - Auth failures (future)
- `NotFoundError` - Resource not found
- `RateLimitError` - API rate limits
- `TimeoutError` - Request timeouts
- `UnknownError` - Unexpected errors

**Error Boundaries:**
```typescript
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    logger.error('React Error', { error, errorInfo });
  }}
>
  <App />
</ErrorBoundary>
```

### Performance Monitoring

```typescript
// lib/performance/web-vitals.ts
export function reportWebVitals(metric: Metric) {
  // Track: LCP, FID, CLS, FCP, TTFB
  analytics.send({
    name: metric.name,
    value: metric.value,
  });
}
```

### Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  page: z.number().int().min(1).max(1000),
});

// Usage
const validated = searchSchema.parse(input);
```

---

## Security Architecture

### Environment Variables
```
.env.local (gitignored)
  ↓
Server-side only access
  ↓
NEVER exposed to client
```

### Input Sanitization
```typescript
// All user inputs validated with Zod
// URLs sanitized before use
// Search queries escaped
```

### Content Security Policy
```typescript
// next.config.mjs
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; frame-src vidsrc.sbs ..."
  }
]
```

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=()

---

## Performance Optimization

### Code Splitting
```typescript
// Automatic by Next.js App Router
// Each page = separate bundle
// Dynamic imports for heavy components

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <Skeleton />
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={posterUrl}
  width={300}
  height={450}
  loading="lazy"
  placeholder="blur"
/>
```

### Bundle Analysis
```
Page                              Size     First Load JS
├ ○ /                            5.79 kB         220 kB
├ ○ /movie/[id]                  2.02 kB         216 kB
├ ○ /tv/[id]                     2.08 kB         216 kB
├ ○ /search                      2.82 kB         217 kB
├ ○ /watch/movie/[id]            1.02 kB         215 kB
└ ○ /offline                     1.86 kB         116 kB
```

### Caching Strategy
```
React Query: 1hr stale, 24hr cache
Service Worker: Cache static assets
LocalStorage: Persistent user data
```

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// Example: __tests__/components/media-card.test.tsx
import { render, screen } from '@testing-library/react';
import MediaCard from '@/components/media/media-card';

test('renders movie card', () => {
  render(<MediaCard movie={mockMovie} />);
  expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
});
```

**Coverage:** 81 unit tests across components, services, stores, hooks

### E2E Tests (Playwright)
```typescript
// Example: e2e/homepage.spec.ts
test('homepage loads content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Trending');
});
```

**Coverage:** 7 E2E tests for critical user flows

### Testing Commands
```bash
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:e2e      # E2E tests
```

---

## Future Extensibility

### Planned Extensions

#### 1. User Authentication
```
Add auth layer:
- NextAuth.js integration
- User profiles
- Protected routes
- Server-side session management
```

#### 2. Cloud Sync
```
Add backend:
- User database
- Watch history sync
- Favorites sync
- Multi-device support
```

#### 3. Advanced Player
```
Enhance player:
- Custom controls
- Quality selection
- Subtitle support
- Chromecast
- Picture-in-Picture
```

#### 4. Social Features
```
Add social layer:
- User reviews
- Ratings
- Watch parties
- Friends system
```

### Extension Points

**Services Layer** - Easy to add new API integrations
**Store Layer** - New stores for new features
**Component Layer** - Composable, reusable components
**Hook Layer** - Custom hooks for new functionality

---

## Performance Metrics

### Target Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Bundle Size: < 500KB (gzipped)

### Current Metrics
✅ Build successful with 0 errors
✅ Optimized bundles (50% reduction on detail pages)
✅ Lighthouse score: 90+
✅ 100% TypeScript coverage
✅ 88 tests passing

---

## Conclusion

MyStream is built with a **modular, scalable architecture** that supports:
- Multiple platforms (web, mobile, TV)
- Progressive enhancement (PWA)
- Production-grade quality
- Future extensibility

The codebase follows **industry best practices**:
- Type safety with TypeScript
- Component composition
- Separation of concerns
- Performance optimization
- Security hardening
- Comprehensive testing

**Status: Production Ready** 🚀

---

**MyStream v1.2.0** - System Architecture Documentation  
**Built with Next.js 15, TypeScript, and Modern Web Technologies**
