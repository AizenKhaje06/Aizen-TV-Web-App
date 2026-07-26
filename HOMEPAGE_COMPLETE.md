# 🏠 HOME PAGE - COMPLETE DOCUMENTATION

**Last Updated:** Current Session  
**Status:** ✅ Production Ready  
**Platform:** Web + Android TV Optimized

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Layout & Structure](#layout--structure)
3. [Sections Breakdown](#sections-breakdown)
4. [Features & Functionality](#features--functionality)
5. [Design System](#design-system)
6. [Technical Implementation](#technical-implementation)
7. [Responsive Design](#responsive-design)

---

## 🎯 OVERVIEW

The home page is the main landing screen featuring auto-rotating hero content, personalized recommendations, and 15 organized content sections. Built with Next.js 15, React Server Components, and optimized for both web and Android TV.

**Key Highlights:**
- ✅ Auto-rotating hero carousel (5 movies, 8-second intervals)
- ✅ 15 content sections with organized categories
- ✅ Netflix-style Top 10 trending display
- ✅ Streaming platforms showcase
- ✅ Continue watching functionality
- ✅ Full D-pad/keyboard navigation support
- ✅ Smooth animations and transitions
- ✅ Real-time TMDB data integration

---

## 🏗️ LAYOUT & STRUCTURE

```
┌─────────────────────────────────────────────────┐
│ Sidebar (80px collapsed, 240px expanded)        │
├─────────────────────────────────────────────────┤
│                                                 │
│ HERO SECTION (Auto-rotating, 5 movies)         │
│ - Movie backdrop (original quality)            │
│ - Movie logo (if available) or title           │
│ - Genres (yellow badges)                       │
│ - Rating, Year, 4K, HDR badges                 │
│ - Play & More Info buttons                     │
│ - Navigation dots                              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ CONTENT SECTIONS (15 sections)                 │
│                                                 │
│ 1. Continue Watching (if available)            │
│ 2. Trending Right Now (Top 10)                 │
│ 3. Studio & Platforms                          │
│ 4. New Movies                                  │
│ 5. Popular TV Shows                            │
│ 6. Action                                      │
│ 7. Comedy                                      │
│ 8. Drama                                       │
│ 9. Horror                                      │
│ 10. Sci-Fi                                     │
│ 11. Thriller                                   │
│ 12. Romance                                    │
│ 13. Animation                                  │
│ 14. Crime                                      │
│ 15. Documentary                                │
│ 16. Trending Anime                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📦 SECTIONS BREAKDOWN

### 1️⃣ **HERO SECTION** (Auto-Rotating Banner)

**Data Source:** Top 5 trending movies from TMDB  
**Rotation:** Every 8 seconds  
**Image Quality:** Original (highest quality)

**Content Display:**
- **Backdrop Image:** Full-width, max-height 900px, original quality
- **Movie Logo:** High-quality original logo (if available)
- **Title:** Fallback if no logo (4xl-7xl font)
- **Rating:** ⭐ with numeric score
- **Year:** Release year
- **Quality Badges:** 4K, HDR (bordered badges)
- **Genres:** Yellow pill badges (max 4 genres)
- **Overview:** Movie description (3-4 lines)
- **Actions:** 
  - Play button (white, primary)
  - More Info button (gray, secondary)
  - Mute/Unmute button (bottom-right)

**Navigation:**
- Manual: Click navigation dots
- Auto: Cycles through 5 movies
- Smooth fade transitions

**Padding:** `pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16`

---

### 2️⃣ **CONTINUE WATCHING**

**Visibility:** Only shows if user has watch history  
**Layout:** Responsive grid (2-5 columns based on screen size)  
**Card Style:** Grid cards with progress bar

**Card Content:**
- Poster image
- Title (white, 2 lines max)
- Episode info (for TV shows): `S1 E5: Episode Name`
- Progress percentage: `75% watched`
- Progress bar (visual indicator at bottom)
- Play overlay on hover
- Remove button (X icon, top-right on hover)

**Interactions:**
- Click: Resume playback
- Hover: Scale 1.05x, show play button
- Focus: Scale 1.08x (D-pad)
- Remove: Delete from watch history

**Padding:** `pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16`

---

### 3️⃣ **TRENDING RIGHT NOW** (Top 10)

**Data Source:** Top 10 trending movies  
**Style:** Netflix-inspired with huge ranking numbers  
**Layout:** Horizontal scrollable carousel

**Card Design:**
- **Ranking Number:** 
  - Size: 140-200px font
  - Position: BEHIND poster (z-index: 0)
  - Color: White with black stroke
  - Overlap: Poster covers 35-45% of number
- **Poster:**
  - Size: 140-180px width, 2:3 ratio
  - Rounded corners (12px)
  - Overlaps ranking number
- **Metadata (below poster):**
  - Title: White, semibold, 2 lines max
  - Details: `2024 • Movie • ⭐ 8.4` (gray text)

**Hover Effects:**
- Scale: 1.05x (mouse) / 1.08x (D-pad)
- Cyan glow ring: `ring-cyan-400`
- Smooth 200ms transition

**Padding:** `py-6 md:py-8 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16`

---

### 4️⃣ **STUDIO & PLATFORMS**

**Data Source:** Hardcoded list of 12 streaming platforms  
**Layout:** Horizontal scrollable carousel

**Platforms:**
1. Netflix
2. Amazon Prime Video
3. Apple TV+
4. Crunchyroll
5. Disney+
6. Hulu
7. Max
8. MGM+
9. Paramount+
10. Peacock
11. Shudder
12. Discovery+

**Card Design:**
- **Size:** 140-150px width × 84-90px height
- **Background:** Dark gray (#242424)
- **Border:** 1px solid #3A3A3A
- **Corners:** Rounded 18px
- **Logo:** 
  - Centered, max 120×60px
  - Original TMDB provider logos
  - High quality (quality=100)
  - Brightness/contrast enhanced
- **Platform Name:** 
  - Below card, white text (13px)
  - Turns cyan on hover

**Hover Effects:**
- Scale: 1.05x (mouse) / 1.08x (D-pad)
- Border: 2px cyan border
- Glow: Cyan shadow
- Logo scale: 1.1x

**Padding:** `py-4 md:py-6 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16`

---

### 5️⃣ **NEW MOVIES**

**Data Source:** TMDB upcoming movies  
**Layout:** Horizontal scrollable carousel  
**Card Type:** Standard MediaCard

**Card Display:**
- **Poster:** 200px × 300px, rounded
- **Rating Badge:** Top-right, ⭐ 8.0 (black bg, always visible)
- **Title:** White, semibold, 2 lines max
- **Metadata:** Yellow text: `Movie | 2024 | Action`

**Hover Actions:**
- Gradient overlay appears
- 3 action buttons center screen:
  - Play (white, filled)
  - Add to List (outlined)
  - More Info (outlined)

---

### 6️⃣ **POPULAR TV SHOWS**

**Data Source:** TMDB popular TV shows  
**Card Type:** Standard MediaCard with TV type  
**Display:** Same as movies but shows "TV Show" label

---

### 7️⃣ - 1️⃣5️⃣ **GENRE SECTIONS**

**Sections:**
- **Action** (Genre ID: 28)
- **Comedy** (Genre ID: 35)
- **Drama** (Genre ID: 18)
- **Horror** (Genre ID: 27)
- **Sci-Fi** (Genre ID: 878)
- **Thriller** (Genre ID: 53)
- **Romance** (Genre ID: 10749)
- **Animation** (Genre ID: 16)
- **Crime** (Genre ID: 80)
- **Documentary** (Genre ID: 99)

**Data Source:** TMDB movies filtered by genre  
**Layout:** Horizontal scrollable carousel  
**Card Type:** Standard MediaCard

---

### 1️⃣6️⃣ **TRENDING ANIME**

**Data Source:** TMDB trending TV filtered by:
- Origin country: Japan (`JP`)
- OR Genre ID: 16 (Animation)

**Card Type:** Standard MediaCard (TV type)

---

## ✨ FEATURES & FUNCTIONALITY

### 🎬 **Hero Auto-Rotation**
```typescript
- Rotates every 8 seconds
- Shows top 5 trending movies
- Smooth fade transitions
- Manual navigation with dots
- Force re-render on change (key prop)
```

### 🎯 **Card Interactions**

**Mouse/Touch:**
- Hover: Scale 1.05x
- Click: Navigate to detail page
- Hover actions: Play, Add, Info buttons

**Keyboard/D-Pad:**
- Focus: Scale 1.08x
- Focus ring: 4px primary color
- Tab navigation: Sequential
- Enter: Activate/navigate

### 📊 **Data Fetching**

**Strategy:** React Query with 1-hour cache
```typescript
- useTrendingMovies() // Hero + Top 10
- useUpcomingMovies() // New Movies
- usePopularTV() // Popular TV Shows
- useTrendingTV() // Trending Anime
- useMoviesByGenre(genreId) // Genre sections
- useMovieImages(id) // Hero logos
- useMovieDetails(id) // Hero genres
```

### 🎨 **Scroll Behavior**

**All carousels include:**
- Horizontal smooth scrolling
- Arrow navigation buttons (fade in on hover)
- Touch/swipe support
- Snap behavior (TV mode)
- Hide scrollbar
- Automatic scroll to focused item

### 📱 **Continue Watching**

**Data Storage:** Zustand store (`history-store`)
```typescript
- Tracks watch progress
- Saves position per media
- Stores episode info (TV shows)
- Resume playback from last position
- Remove from history option
```

---

## 🎨 DESIGN SYSTEM

### **Colors**

```css
/* Section Headers */
text-amber-500  /* Gold: #F59E0B */

/* Card Title */
text-white      /* White: #FFFFFF */

/* Card Metadata */
text-yellow-400 /* Yellow: #FACC15 */

/* Rating */
text-yellow-400 /* Star: ⭐ */
text-white      /* Score: 8.0 */

/* Sidebar */
bg-gradient-to-r from-black/90 via-black/80 to-black/60
border-white/10

/* Focus States */
ring-cyan-400   /* Cyan: #22D3EE */
ring-primary    /* Primary brand color */
```

### **Typography**

```css
/* Section Headers */
text-2xl md:text-3xl font-bold

/* Card Titles */
text-sm md:text-base font-semibold

/* Card Metadata */
text-xs md:text-sm font-medium

/* Hero Title */
text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold
```

### **Spacing & Padding**

```css
/* Consistent padding from sidebar */
pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16

/* Section spacing */
space-y-8 md:space-y-12

/* Vertical padding (prevents card clipping) */
py-4 md:py-6  /* Carousels */
py-6 md:py-8  /* Top 10 */

/* Card gaps */
gap-2 md:gap-4  /* Standard carousels */
gap-4 md:gap-6  /* Top 10 */
gap-3 md:gap-4  /* Studios */
```

### **Animation Presets**

```typescript
// Card hover/focus
cardVariants: {
  hover: { scale: 1.05, duration: 0.15 }
  focused: { scale: 1.1, duration: 0.15 }
}

// Card hover (TV mode)
cardLargeVariants: {
  hover: { scale: 1.08, duration: 0.15 }
  focused: { scale: 1.15, duration: 0.2 }
}

// Fade in up
fadeInUpVariants: {
  hidden: { opacity: 0, y: 20 }
  visible: { opacity: 1, y: 0, duration: 0.2 }
}

// Stagger children
staggerContainerVariants: {
  staggerChildren: 0.1
}
```

---

## 🛠️ TECHNICAL IMPLEMENTATION

### **File Structure**

```
src/
├── app/
│   └── page.tsx                    # Main home page
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx          # Page wrapper with sidebar
│   │   └── sidebar.tsx            # Collapsible sidebar
│   └── media/
│       ├── hero-banner.tsx        # Auto-rotating hero
│       ├── media-card.tsx         # Standard movie/TV card
│       ├── media-carousel.tsx     # Horizontal scrollable row
│       ├── top-10-row.tsx         # Netflix-style Top 10
│       ├── studios-row.tsx        # Streaming platforms
│       ├── continue-watching-row.tsx # Watch history
│       └── adaptive-content-row.tsx  # TV/Web switcher
├── hooks/
│   └── tmdb/
│       ├── use-movies.ts          # Movie data hooks
│       └── use-tv.ts              # TV data hooks
├── services/
│   └── tmdb/
│       └── images.ts              # Image URL helpers
└── styles/
    └── animations.ts              # Framer Motion presets
```

### **Component Hierarchy**

```
HomePage
├── AppShell
│   ├── Sidebar (collapsed by default)
│   └── Main Content
│       ├── HeroBanner (auto-rotating)
│       │   ├── Backdrop Image
│       │   ├── Logo/Title
│       │   ├── Metadata
│       │   └── Actions
│       ├── Hero Navigation Dots
│       └── Content Sections
│           ├── ContinueWatchingRow (conditional)
│           ├── TopTenRow
│           ├── StudiosRow
│           └── AdaptiveContentRow × 13
│               └── ContentRow
│                   └── MediaCarousel
│                       └── MediaCard × N
```

### **Data Flow**

```
1. TMDB API Request
   ↓
2. React Query Cache (1 hour)
   ↓
3. Transform Function (add metadata)
   ↓
4. Component Props
   ↓
5. Render with Optimizations
   ↓
6. User Interaction
   ↓
7. Navigation / Watch History Update
```

### **Performance Optimizations**

```typescript
✅ React Query caching (1 hour)
✅ Image lazy loading (priority=false)
✅ Next.js Image optimization
✅ Conditional rendering (Continue Watching)
✅ Stable card keys (item.id)
✅ Debounced scroll handlers
✅ CSS-only scrollbar hiding
✅ Framer Motion GPU acceleration
✅ Minimize re-renders (useState, useEffect)
```

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**

```css
/* Mobile */
Default: 100% width, smaller text, 2 column grids

/* Tablet (md: 768px) */
pl-28 pr-12: Increased padding
text-2xl: Larger headers
3 column grids

/* Desktop (lg: 1024px) */
pl-32 pr-16: Maximum padding
text-3xl: Maximum header size
4-5 column grids

/* 4K TV */
Scale animations: 1.15x
Larger card sizes
Focus indicators more prominent
```

### **Sidebar Responsive Behavior**

```
Mobile/Tablet:
- Collapsed: 80px width
- Expands on hover: 240px
- Semi-transparent gradient background

TV Mode:
- Always visible
- D-pad navigation
- Focus indicators
```

### **Card Sizes**

```typescript
sm: 'w-[150px] h-[225px]'  // Small screens
md: 'w-[200px] h-[300px]'  // Default
lg: 'w-[280px] h-[420px]'  // TV mode / large screens
```

---

## 🎯 KEY METRICS

**Content Sections:** 16 total  
**Hero Rotation:** 8 seconds  
**Cache Duration:** 1 hour  
**Animation Duration:** 150-200ms  
**Card Hover Scale:** 1.05x  
**Card Focus Scale:** 1.08-1.15x  
**Streaming Platforms:** 12  
**Genre Categories:** 10  

---

## 🚀 FUTURE ENHANCEMENTS

- [ ] Personalized recommendations based on watch history
- [ ] Search autocomplete integration
- [ ] Watch party / social features
- [ ] Continue watching sync across devices
- [ ] Seasonal/holiday themed sections
- [ ] User ratings and reviews
- [ ] Watchlist management
- [ ] Parental controls and profiles

---

## 📝 NOTES

- All sections use consistent padding for alignment
- Cards have vertical padding to prevent clipping on scale
- Rating badges always visible on posters
- Metadata shown below cards in yellow
- Hover actions centered on posters
- Focus states optimized for D-pad navigation
- Smooth transitions throughout
- TMDB data fetched with 1-hour cache
- Image optimization via Next.js Image component

---

**Status:** ✅ Production Ready  
**Version:** Current  
**Last Updated:** This session
