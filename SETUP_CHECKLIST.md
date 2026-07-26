# ✅ Setup Checklist

Use this checklist to verify your MyStream installation is complete and ready.

## Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (optional, for version control)

## Installation Steps

### 1. Dependencies
- [ ] Run `npm install`
- [ ] No errors during installation
- [ ] `node_modules/` folder created

### 2. TMDB API Key
- [ ] Created TMDB account at themoviedb.org
- [ ] Requested API key (Developer option)
- [ ] Copied API key (v3 auth)
- [ ] Opened `.env.local`
- [ ] Replaced `your_tmdb_api_key_here` with actual key
- [ ] Saved `.env.local`

### 3. Development Server
- [ ] Run `npm run dev`
- [ ] Server started on port 3000
- [ ] No compilation errors
- [ ] Browser auto-opened (or manually go to http://localhost:3000)

### 4. Verify Homepage
- [ ] Page loads successfully
- [ ] See "MyStream" with red accent
- [ ] See "Phase 1: Foundation & Architecture Complete"
- [ ] No errors in browser console
- [ ] Dark theme is active

## Code Quality Checks

### TypeScript
```bash
npm run type-check
```
- [ ] ✅ "No errors found"

### ESLint
```bash
npm run lint
```
- [ ] ✅ "No linting errors found"

### Prettier
```bash
npm run format
```
- [ ] ✅ Files formatted successfully

## Browser Testing

### Desktop Browser
- [ ] Chrome/Edge: Works ✅
- [ ] Firefox: Works ✅
- [ ] Safari: Works ✅

### Mobile Browser
- [ ] Responsive design loads
- [ ] No horizontal scroll
- [ ] Touch interactions work

### PWA Installation
- [ ] Install button appears in address bar
- [ ] Can install as PWA
- [ ] App icon appears on home screen
- [ ] Launches in standalone mode

## Feature Verification

### Environment Configuration
- [ ] Environment variables load correctly
- [ ] No "Invalid environment variables" error
- [ ] TMDB API key is recognized

### State Management
- [ ] Zustand stores initialize
- [ ] Local storage persistence works
- [ ] DevTools available (development mode)

### React Query
- [ ] Query client initializes
- [ ] React Query DevTools visible (bottom-left in dev mode)
- [ ] No query errors on startup

### Error Handling
- [ ] Navigate to `/nonexistent` shows 404 page
- [ ] 404 page has "Go Back Home" button
- [ ] Error boundary catches errors

### TV Mode Detection
- [ ] TV mode detector loads
- [ ] Focus styles available (test with Tab key)
- [ ] Arrow key navigation ready

## File Structure Verification

### Required Files Exist
- [ ] `package.json`
- [ ] `next.config.mjs`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `.env.local` (with your API key)
- [ ] `src/app/layout.tsx`
- [ ] `src/app/page.tsx`
- [ ] `public/manifest.json`

### Source Directories
- [ ] `src/app/`
- [ ] `src/components/`
- [ ] `src/services/`
- [ ] `src/store/`
- [ ] `src/hooks/`
- [ ] `src/lib/`
- [ ] `src/types/`
- [ ] `src/config/`
- [ ] `src/features/`

## IDE Setup (Optional but Recommended)

### VS Code Extensions
- [ ] ESLint extension installed
- [ ] Prettier extension installed
- [ ] Tailwind CSS IntelliSense installed
- [ ] Format on save enabled

### IntelliSense Working
- [ ] Path aliases autocomplete (`@/`)
- [ ] TypeScript types show on hover
- [ ] Tailwind class suggestions appear
- [ ] Import auto-completion works

## Common Issues Resolved

### ❌ "Invalid environment variables"
- [ ] Fixed: Updated `.env.local` with correct values
- [ ] Fixed: Restarted dev server

### ❌ "[401] Unauthorized"
- [ ] Fixed: Used correct TMDB API key (v3 auth)
- [ ] Fixed: Checked for typos in API key

### ❌ "Module not found"
- [ ] Fixed: Ran `npm install` again
- [ ] Fixed: Deleted `node_modules` and `.next`, then reinstalled

### ❌ "Port 3000 already in use"
- [ ] Fixed: Killed process on port 3000
- [ ] Fixed: Used different port with `npm run dev -- -p 3001`

### ❌ TypeScript errors
- [ ] Fixed: Restarted TypeScript server in IDE
- [ ] Fixed: Ran `npm run type-check` to see actual errors

## Production Build Test

### Build for Production
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] `.next/` directory created

### Start Production Server
```bash
npm run start
```
- [ ] Production server starts
- [ ] App loads on http://localhost:3000
- [ ] PWA service worker active

## Documentation Review

- [ ] Read `README.md` - Main documentation
- [ ] Read `QUICKSTART.md` - Quick setup guide
- [ ] Skimmed `ARCHITECTURE.md` - Technical details
- [ ] Reviewed `PHASE1_COMPLETE.md` - What's built
- [ ] Understood `PROJECT_STRUCTURE.md` - File organization

## Ready for Phase 2?

### All Systems Green ✅
- [ ] Development server running
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] TMDB API connected
- [ ] PWA configured
- [ ] TV mode ready
- [ ] State management working
- [ ] Documentation reviewed

---

## 🎉 If all checkboxes are marked, you're ready to proceed to Phase 2!

## Need Help?

If you're stuck on any item:

1. **Check Console**: Look for error messages in terminal and browser
2. **Verify API Key**: Most common issue is invalid TMDB key
3. **Restart Server**: Many issues fixed by restarting `npm run dev`
4. **Clear Cache**: Delete `.next/` and `node_modules/`, reinstall
5. **Check Node Version**: Must be 18.0.0 or higher

## Quick Diagnostic Commands

```bash
# Check versions
node --version    # Should be 18+
npm --version     # Should be 9+

# Verify installation
npm list --depth=0

# Test TypeScript
npm run type-check

# Test ESLint
npm run lint

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

---

**Status**: Phase 1 Complete ✅  
**Next**: Ready for Phase 2 🚀
