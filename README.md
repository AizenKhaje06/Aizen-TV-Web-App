# MyStream - Netflix-Style Streaming Platform

**Version:** 1.2.0  
**Status:** Production Ready 🚀

A modern, feature-rich streaming platform built with Next.js 15, featuring PWA support, Android TV optimization, and a Netflix-inspired interface.

---

## ✨ Features

### 🎬 Core Functionality
- **Browse Movies & TV Shows** - Discover trending, popular, and top-rated content
- **Advanced Search** - Find any movie or TV show instantly
- **Detailed Information** - View cast, crew, ratings, and recommendations
- **Full Video Playback** - Stream movies and TV episodes
- **Continue Watching** - Resume from where you left off
- **Watch History** - Track your viewing history
- **Favorites** - Save content to your personal list

### 📱 Progressive Web App (PWA)
- **Installable** - Works on Android, iOS, and Desktop
- **Offline Support** - Service worker caching
- **App-like Experience** - Standalone mode
- **Auto Updates** - Silent updates with notifications
- **Network Status** - Online/offline indicators

### 📺 Android TV Optimized
- **Auto Detection** - Automatically enables TV mode
- **Remote Control Support** - D-pad navigation
- **Focus Management** - Clear focus indicators
- **10-Foot UI** - Optimized for TV viewing
- **Adaptive Layouts** - Seamless TV/web switching

### 🚀 Performance & Security
- **Production Optimized** - Code splitting, lazy loading
- **Security Hardened** - Input validation, CSP headers
- **Error Tracking** - Comprehensive error handling
- **Performance Monitoring** - Web Vitals tracking
- **SEO Optimized** - Dynamic metadata, Open Graph

### 🎨 User Experience
- **Splash Screen** - Professional intro video
- **Official Branding** - Custom logo throughout
- **Smooth Animations** - Framer Motion powered
- **Responsive Design** - Mobile, tablet, desktop, TV
- **Dark Theme** - Netflix-inspired UI

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand with Persist
- **Data Fetching:** React Query (TanStack)
- **Animations:** Framer Motion

### APIs & Services
- **Content Data:** TMDB API
- **Video Streaming:** VidSrc (vidsrc.sbs)
- **PWA:** next-pwa with Workbox

### Development & Testing
- **Testing:** Vitest (unit), Playwright (E2E)
- **Linting:** ESLint
- **Type Checking:** TypeScript
- **CI/CD:** GitHub Actions

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TMDB API Key ([Get one free](https://www.themoviedb.org/settings/api))

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd AizenTvWebapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

4. **Add your TMDB API key to `.env.local`**
```env
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

---

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Create production build
npm run start        # Start production server
```

### Testing
```bash
npm run test         # Run unit tests (Vitest)
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests (Playwright)
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   - Add `TMDB_API_KEY`
   - Add `TMDB_BASE_URL`
   - Add `TMDB_IMAGE_URL`

4. **Deploy**
   - Vercel will auto-deploy on every push
   - Production URL will be provided

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 📺 Android TV Setup

### Testing TV Mode

**Method 1: Manual Override (Browser)**
```javascript
// In browser console
localStorage.setItem('tv-mode-override', 'true');
location.reload();
```

**Method 2: User Agent Override**
1. Open Chrome DevTools
2. Device Toolbar → Edit
3. Add custom device:
   - Name: Android TV
   - Width: 1920
   - Height: 1080
   - User Agent: `Mozilla/5.0 (Linux; Android 9; SHIELD Android TV) AppleWebKit/537.36`

**Method 3: Actual Device**
1. Build: `npm run build`
2. Get local IP: `ipconfig` or `ifconfig`
3. Open on Android TV: `http://YOUR_IP:3000`

### TV Navigation
- **Arrow Keys:** Navigate carousels and grids
- **Enter:** Select item
- **Escape/Back:** Go back
- **Focus:** Clear visual indicators

---

## 🎨 Features Overview

### Home Page
- Hero banner with featured content
- 6+ content carousels (trending, popular, top rated)
- Continue watching section
- Smooth animations and lazy loading

### Movie & TV Details
- Full metadata (cast, crew, ratings, runtime)
- Backdrop and poster images
- Recommendations
- TV-optimized action buttons
- "More Like This" carousel

### Search
- Real-time search
- Filter by movies and TV shows
- TV-optimized grid navigation
- Empty states and loading indicators

### Video Player
- VidSrc integration
- Loading indicators
- Error handling with retry
- Fullscreen support
- 30-second timeout protection

### Continue Watching
- Automatic progress tracking
- Resume from last position
- Per-episode tracking for TV shows
- Persistent across sessions

---

## 📱 PWA Installation

### Android
1. Open in Chrome
2. Tap menu → "Install app" or "Add to Home Screen"
3. Confirm installation
4. Find app in app drawer

### iOS
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Name the app
5. Tap "Add"

### Desktop
1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click "Install"
4. App opens in standalone window

---

## 🔧 Configuration

### Environment Variables

```env
# Required
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_URL=https://image.tmdb.org/t/p

# Optional
NODE_ENV=development
```

### PWA Configuration

Edit `public/manifest.json`:
```json
{
  "name": "MyStream - Watch Movies & TV Shows",
  "short_name": "MyStream",
  "theme_color": "#E50914",
  "background_color": "#050505"
}
```

### Video Provider

Edit `src/services/player/vidsrc.ts`:
```typescript
const VIDSRC_BASE_URL = 'https://vidsrc.sbs/embed';
```

---

## 📊 Project Statistics

```
Total Files:        180+
Lines of Code:      ~16,500+
Components:         35+
Services:           15+
Hooks:              12+
Tests:              88 (81 unit + 7 E2E)
Routes:             8
TypeScript:         100% coverage
Bundle Size:        ~220 kB (optimized)
```

---

## 🎯 Browser Support

- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)
- Brave (latest)
- Samsung Internet
- Android TV WebView

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [TV_SETUP.md](./TV_SETUP.md) - Android TV integration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) - Release checklist

### Phase Documentation
- [PHASE7_COMPLETE.md](./PHASE7_COMPLETE.md) - Production optimization
- [PHASE6_COMPLETE.md](./PHASE6_COMPLETE.md) - PWA implementation
- [PHASE5.4-5.5_COMPLETE.md](./PHASE5.4-5.5_COMPLETE.md) - Extended TV integration
- [SPLASH_SCREEN.md](./SPLASH_SCREEN.md) - Splash screen guide

---

## 🐛 Known Issues

### Current
- PWA icons: Only 192x192 and 512x512 exist (Logo.png used as fallback)
- Player controls: Basic overlay (iframe provides main controls)

### Future Improvements
- Generate all PWA icon sizes (72, 96, 128, 144, 384)
- Custom video player controls
- Multiple streaming providers
- User authentication
- Cloud sync

---

## 🤝 Contributing

This is a portfolio/demo project. If you'd like to use it:

1. Fork the repository
2. Get your own TMDB API key
3. Customize branding and content
4. Deploy to your own hosting

---

## 📄 License

This project is for educational and portfolio purposes.

**TMDB Attribution:** This product uses the TMDB API but is not endorsed or certified by TMDB.

**Video Content:** Streaming provided by third-party services. Content rights belong to original creators.

---

## 🎬 Screenshots

### Home Page
![Home Page](./ screenshots/home.png)

### Movie Details
![Movie Details](./screenshots/movie-details.png)

### TV Mode
![TV Mode](./screenshots/tv-mode.png)

### PWA
![PWA Install](./screenshots/pwa-install.png)

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd AizenTvWebapp
npm install

# 2. Add API key
echo "TMDB_API_KEY=your_key" > .env.local

# 3. Run
npm run dev

# 4. Open
open http://localhost:3000
```

---

## 💡 Key Features Highlight

### For Users
- 🎬 Stream thousands of movies and TV shows
- 📱 Install as app on any device
- 📺 Perfect for Android TV
- 💾 Offline support
- 🎯 Continue watching
- ⭐ Favorites and history

### For Developers
- 🏗️ Clean architecture
- 📝 Full TypeScript
- ✅ 88 tests passing
- 📦 Optimized bundles
- 🔒 Security hardened
- 📚 Well documented

---

## 🎉 Acknowledgments

- **TMDB** - Content data and images
- **VidSrc** - Video streaming
- **Next.js Team** - Amazing framework
- **Vercel** - Hosting platform
- **shadcn** - UI components

---

## 📞 Support

For issues, questions, or suggestions:
- Check [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
- Review [ARCHITECTURE.md](./ARCHITECTURE.md)
- Read phase documentation

---

**MyStream v1.2.0** - Built with ❤️ using Next.js and TypeScript  
**Status: Production Ready** 🚀

---

**Happy Streaming!** 🎬🍿
