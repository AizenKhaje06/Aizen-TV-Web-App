# Hero Section Auto-Rotation Feature

## Overview
Added automatic rotation to the hero banner, cycling through the top 5 trending movies every 8 seconds with smooth transitions and navigation dots.

## Implementation

### 1. Auto-Rotation Logic (`page.tsx`)

**State Management:**
```typescript
const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
const heroMovies = trendingMovies?.slice(0, 5) || [];
const heroMovie = heroMovies[currentHeroIndex];
```

**Auto-Rotation Timer:**
```typescript
useEffect(() => {
  if (heroMovies.length === 0) return;
  
  const interval = setInterval(() => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
  }, 8000); // Change every 8 seconds

  return () => clearInterval(interval);
}, [heroMovies.length]);
```

### 2. Navigation Dots

**Interactive Indicators:**
- Shows dots below hero section (only if more than 1 movie)
- Active dot: White, wider (w-8)
- Inactive dots: Semi-transparent (white/40), narrower (w-6)
- Clickable to jump to specific movie
- Smooth transitions on active state change

**Position:**
- `-mt-12` to overlap hero section slightly
- `z-20` to stay above content
- Centered horizontally

### 3. Smooth Transitions

**Hero Banner Animation:**
- Added `key={title}` to force re-render on change
- Added `exit="hidden"` for fade-out animation
- Uses existing `heroBannerVariants` from animations
- Smooth fade in/out between movies

**Logo Fetching:**
- Fetches logo for current hero movie
- Updates automatically when movie changes
- Falls back to text title if no logo available

## Features

✅ **Auto-rotation**: Changes every 8 seconds  
✅ **5 Movies**: Cycles through top 5 trending  
✅ **Navigation Dots**: Visual indicator + manual control  
✅ **Smooth Transitions**: Fade animations between movies  
✅ **Logo Support**: Fetches and displays movie logos  
✅ **Responsive**: Works on all screen sizes  
✅ **Clean Intervals**: Properly cleaned up on unmount

## User Experience

1. **Initial Load**: Shows first trending movie
2. **Auto-Play**: After 8 seconds, transitions to next movie
3. **Loop**: Returns to first movie after the 5th
4. **Manual Control**: Click dots to jump to any movie
5. **Seamless**: Smooth fade transitions between movies

## Configuration

**Rotation Speed:**
```typescript
8000 // 8 seconds per movie
```

**Number of Movies:**
```typescript
.slice(0, 5) // First 5 trending movies
```

## Technical Details

**Interval Cleanup:**
- `useEffect` cleanup function clears interval
- Prevents memory leaks
- Resets when heroMovies changes

**Key Prop Strategy:**
- HeroBanner has `key={heroMovie.id}`
- Forces React to re-mount component
- Triggers enter/exit animations

**Modulo Arithmetic:**
```typescript
(prev + 1) % heroMovies.length
```
- Ensures seamless loop from last to first
- No need for conditional reset logic

## Future Enhancements

- Add pause on hover
- Add previous/next arrow buttons
- Add autoplay toggle in settings
- Show movie title in dots on hover
- Add progress bar for rotation timer
- Keyboard shortcuts (← →) for navigation
