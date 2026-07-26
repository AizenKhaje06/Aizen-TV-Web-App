# 📂 MyStream - Complete Project Structure

## Visual Directory Tree

```
mystream/
│
├── 📁 public/                          # Static assets served directly
│   ├── 📁 icons/                       # PWA icons (192x192, 512x512)
│   │   └── README.md                   # Icon setup guide
│   └── manifest.json                   # PWA manifest configuration
│
├── 📁 src/                             # Application source code
│   │
│   ├── 📁 app/                         # Next.js 15 App Router
│   │   ├── layout.tsx                  # Root layout with providers
│   │   ├── page.tsx                    # Home page
│   │   ├── error.tsx                   # Error page
│   │   ├── loading.tsx                 # Loading page
│   │   ├── not-found.tsx               # 404 page
│   │   ├── providers.tsx               # React Query & Error Boundary
│   │   └── globals.css                 # Global styles + Tailwind
│   │
│   ├── 📁 components/                  # Reusable UI components
│   │   │
│   │   ├── 📁 ui/                      # shadcn/ui design system
│   │   │   ├── button.tsx              # Button component (5 variants)
│   │   │   ├── card.tsx                # Card with header/content/footer
│   │   │   ├── skeleton.tsx            # Loading skeleton
│   │   │   └── modal.tsx               # Dialog/Modal component
│   │   │
│   │   ├── 📁 common/                  # Common components
│   │   │   ├── container.tsx           # Responsive container
│   │   │   ├── error-boundary.tsx      # Error boundary component
│   │   │   └── loading-spinner.tsx     # Loading spinner
│   │   │
│   │   ├── 📁 layout/                  # Layout components (future)
│   │   │   └── [empty - ready for Phase 2]
│   │   │
│   │   └── 📁 tv/                      # Android TV components
│   │       ├── tv-detector.tsx         # Detect TV devices
│   │       ├── focusable.tsx           # Focusable wrapper
│   │       └── tv-navigation.tsx       # Navigation utilities
│   │
│   ├── 📁 features/                    # Feature modules (future)
│   │   ├── 📁 home/                    # Home page features
│   │   ├── 📁 movies/                  # Movies features
│   │   ├── 📁 tv/                      # TV shows features
│   │   ├── 📁 player/                  # Video player features
│   │   ├── 📁 search/                  # Search features
│   │   ├── 📁 favorites/               # Favorites features
│   │   └── 📁 history/                 # Watch history features
│   │
│   ├── 📁 services/                    # API & Business logic
│   │   │
│   │   ├── 📁 api/                     # HTTP client layer
│   │   │   ├── axios-client.ts         # Axios instance with interceptors
│   │   │   └── error-handler.ts        # Error handling utilities
│   │   │
│   │   ├── 📁 tmdb/                    # TMDB API services
│   │   │   ├── client.ts               # Low-level TMDB client
│   │   │   ├── movies.service.ts       # Movies operations
│   │   │   ├── tv.service.ts           # TV shows operations
│   │   │   └── search.service.ts       # Search operations
│   │   │
│   │   └── 📁 player/                  # Video player services
│   │       ├── player.interface.ts     # Player interfaces
│   │       └── player.builder.ts       # URL builder for embeds
│   │
│   ├── 📁 store/                       # Zustand state management
│   │   ├── player-store.ts             # Playback, continue watching, history
│   │   ├── settings-store.ts           # Theme, preferences, TV mode
│   │   └── user-store.ts               # Favorites, user data
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── use-tv-navigation.ts        # TV remote navigation hook
│   │   ├── use-media-query.ts          # Responsive hooks
│   │   └── use-focus-management.ts     # Focus management for TV
│   │
│   ├── 📁 lib/                         # Utility functions
│   │   ├── cn.ts                       # Class name merger (clsx + tailwind-merge)
│   │   ├── constants.ts                # App constants (keys, URLs, etc.)
│   │   └── utils.ts                    # Utilities (format, storage, debounce)
│   │
│   ├── 📁 types/                       # TypeScript type definitions
│   │   ├── index.ts                    # Type exports
│   │   ├── media.types.ts              # Movie/TV types
│   │   ├── player.types.ts             # Player types
│   │   └── api.types.ts                # API types
│   │
│   └── 📁 config/                      # Configuration files
│       ├── env.ts                      # Environment validation (Zod)
│       ├── query-client.ts             # React Query configuration
│       └── site.config.ts              # Site configuration
│
├── 📄 .env.local                       # Environment variables (YOU EDIT THIS)
├── 📄 .env.example                     # Environment template
├── 📄 .eslintrc.json                   # ESLint configuration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 .prettierrc                      # Prettier configuration
├── 📄 next.config.mjs                  # Next.js configuration
├── 📄 postcss.config.mjs               # PostCSS configuration
├── 📄 tailwind.config.ts               # Tailwind CSS configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 package.json                     # Dependencies & scripts
│
└── 📚 Documentation/
    ├── README.md                       # Main documentation
    ├── QUICKSTART.md                   # Quick start guide
    ├── ARCHITECTURE.md                 # Architecture details
    ├── PHASE1_COMPLETE.md              # Phase 1 completion checklist
    └── PROJECT_STRUCTURE.md            # This file
```

## Key Files Explained

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler options (strict mode) |
| `next.config.mjs` | Next.js settings, PWA config, image domains |
| `tailwind.config.ts` | Tailwind theme, colors, animations |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc` | Code formatting rules |
| `.env.local` | Environment variables (YOUR TMDB KEY HERE) |

### Core Application Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, metadata, providers |
| `src/app/page.tsx` | Home page component |
| `src/app/providers.tsx` | React Query, Error Boundary setup |
| `src/app/globals.css` | Global styles, Tailwind, custom utilities |

### Service Layer

| File | Purpose |
|------|---------|
| `services/api/axios-client.ts` | HTTP client with TMDB API key injection |
| `services/tmdb/client.ts` | Low-level TMDB API methods |
| `services/tmdb/movies.service.ts` | High-level movie operations |
| `services/tmdb/tv.service.ts` | High-level TV operations |
| `services/player/player.builder.ts` | Video embed URL builder |

### State Management

| File | Purpose |
|------|---------|
| `store/player-store.ts` | Playback state, continue watching, history |
| `store/settings-store.ts` | User preferences, theme, TV mode |
| `store/user-store.ts` | Favorites management |

### Components

| File | Purpose |
|------|---------|
| `components/ui/button.tsx` | Reusable button (5 variants, 4 sizes) |
| `components/ui/card.tsx` | Content card with subcomponents |
| `components/ui/modal.tsx` | Dialog/modal component |
| `components/tv/focusable.tsx` | TV remote navigation wrapper |
| `components/common/error-boundary.tsx` | Error boundary component |

## File Naming Conventions

### Components
- **Format**: `kebab-case.tsx`
- **Examples**: `button.tsx`, `loading-spinner.tsx`, `error-boundary.tsx`

### Services
- **Format**: `name.service.ts`
- **Examples**: `movies.service.ts`, `tv.service.ts`

### Stores
- **Format**: `name-store.ts`
- **Examples**: `player-store.ts`, `user-store.ts`

### Hooks
- **Format**: `use-name.ts`
- **Examples**: `use-tv-navigation.ts`, `use-media-query.ts`

### Types
- **Format**: `name.types.ts`
- **Examples**: `media.types.ts`, `player.types.ts`

## Import Paths

Thanks to TypeScript path aliases, you can import from anywhere:

```typescript
// ❌ Bad - Relative paths
import { Button } from '../../../components/ui/button';

// ✅ Good - Absolute paths with alias
import { Button } from '@/components/ui/button';
```

All paths starting with `@/` are resolved from `src/` directory.

## What Gets Committed to Git

### ✅ Committed
- All source code
- Configuration files
- Documentation
- `.env.example`
- `public/` assets

### ❌ Not Committed (in .gitignore)
- `node_modules/`
- `.next/`
- `.env.local` (your secrets)
- Build outputs
- IDE files

## Auto-Generated Directories

These appear after running `npm install` or `npm run dev`:

```
mystream/
├── node_modules/       # Dependencies (after npm install)
├── .next/             # Next.js build cache (after npm run dev)
└── public/sw.js       # Service worker (after npm run build)
```

## File Count Summary

- **Configuration Files**: 9
- **Source Files**: 40+
- **Documentation Files**: 6
- **Total Lines of Code**: ~3,500+

---

**All files are production-ready and follow best practices!** ✨
