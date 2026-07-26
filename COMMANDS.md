# 🔧 MyStream - Command Reference

Quick reference for all available commands and scripts.

## 📦 Installation

```bash
# Install all dependencies
npm install

# Install specific package
npm install <package-name>

# Install dev dependency
npm install -D <package-name>

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

## 🚀 Development

```bash
# Start development server (port 3000)
npm run dev

# Start on different port
npm run dev -- -p 3001

# Start with turbopack (faster)
npm run dev -- --turbo
```

### Development URLs
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

## 🏗️ Build & Production

```bash
# Create production build
npm run build

# Start production server
npm run start

# Build and start
npm run build && npm run start
```

## 🧹 Code Quality

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Lint specific file
npx eslint src/app/page.tsx
```

### Formatting
```bash
# Format all files with Prettier
npm run format

# Check formatting without changing files
npx prettier --check .

# Format specific file
npx prettier --write src/app/page.tsx
```

### Type Checking
```bash
# Check TypeScript types
npm run type-check

# Watch mode
npx tsc --watch --noEmit
```

### Run All Checks
```bash
# Run all quality checks
npm run type-check && npm run lint && npm run format
```

## 🧪 Testing (Future)

```bash
# Run tests (to be added in future phases)
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## 🧼 Cleaning

```bash
# Remove node_modules
rm -rf node_modules

# Remove build cache
rm -rf .next

# Remove all generated files
rm -rf node_modules .next

# Full clean and reinstall
rm -rf node_modules .next && npm install
```

## 📱 PWA

```bash
# Build PWA (production only)
npm run build

# Test PWA locally
npm run build && npm run start
# Then open http://localhost:3000 and install
```

## 🔍 Debugging

### React Query DevTools
```typescript
// Already enabled in development
// Bottom-left corner shows query inspector
```

### Zustand DevTools
```typescript
// Enabled via Redux DevTools extension
// Install Redux DevTools in your browser
```

### Next.js Debug
```bash
# Debug mode with inspector
NODE_OPTIONS='--inspect' npm run dev

# Open chrome://inspect in Chrome
```

## 📊 Analysis

### Bundle Analysis
```bash
# Analyze bundle size
npm run build

# With detailed analysis (add to package.json)
ANALYZE=true npm run build
```

### Performance
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --view

# Performance profiling
# Use React DevTools Profiler in browser
```

## 🔧 Environment

### Environment Variables
```bash
# Copy example to local
cp .env.example .env.local

# View current env (safe ones only)
node -e "console.log(process.env)" | grep NEXT_PUBLIC
```

### Verify Environment
```bash
# Check if env vars are loaded
npm run dev
# Look for "❌ Invalid environment variables" error
```

## 📦 Package Management

### Check Versions
```bash
# Node version
node --version

# npm version
npm --version

# Package versions
npm list --depth=0

# Specific package version
npm list next
```

### Update Dependencies
```bash
# Update all to latest
npm update

# Update specific package
npm update next

# Check for major updates
npx npm-check-updates

# Apply major updates
npx npm-check-updates -u && npm install
```

## 🐛 Troubleshooting

### Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear Next.js cache
rm -rf .next

# Full reset
rm -rf node_modules .next npm-cache && npm install
```

### Fix Module Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify integrity
npm audit

# Fix vulnerabilities
npm audit fix
```

### Port Issues
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different port
npm run dev -- -p 3001
```

## 🔒 Security

### Audit Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

## 📚 Documentation

### Generate TypeScript Docs
```bash
# Install TypeDoc
npm install -D typedoc

# Generate docs
npx typedoc --out docs src
```

### Component Documentation
```bash
# Install Storybook (optional, future)
npx storybook@latest init
```

## 🌐 Network & Deployment

### Local Network Access
```bash
# Find your local IP
# Windows
ipconfig

# Mac/Linux
ifconfig | grep "inet "

# Access from other devices
# http://[your-ip]:3000
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## 🎨 Tailwind

### Rebuild Tailwind
```bash
# Tailwind is auto-compiled by Next.js
# Just restart dev server
npm run dev
```

### Tailwind Playground
```bash
# Use Tailwind Play (online)
# https://play.tailwindcss.com/
```

## 🔧 IDE Commands (VS Code)

### Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
```
- "TypeScript: Restart TS Server"
- "ESLint: Fix all auto-fixable Problems"
- "Format Document"
- "Reload Window"
```

### Terminal Shortcuts
- **New Terminal**: `` Ctrl+` ``
- **Split Terminal**: `Ctrl+Shift+5`
- **Clear Terminal**: `Ctrl+K`

## 📝 Git Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Phase 1: Foundation & Architecture complete"

# Add remote
git remote add origin <your-repo-url>

# Push to main
git push -u origin main
```

## 🎯 Quick Workflows

### Fresh Start
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Quality Check Before Commit
```bash
npm run type-check && npm run lint && npm run format
git add .
git commit -m "Your message"
```

### Deploy to Production
```bash
# Test build locally first
npm run build
npm run start

# If successful, deploy
vercel --prod
```

### Debug Production Build
```bash
npm run build
npm run start
# Open http://localhost:3000
# Check Network tab for errors
```

## 💡 Useful Aliases (Optional)

Add to your shell profile (.bashrc, .zshrc, etc.):

```bash
# Development
alias dev="npm run dev"
alias build="npm run build"

# Code quality
alias check="npm run type-check && npm run lint"
alias fix="npm run lint -- --fix && npm run format"

# Cleaning
alias clean="rm -rf node_modules .next"
alias fresh="rm -rf node_modules .next && npm install"
```

## 📖 Help Commands

```bash
# Next.js help
npx next --help

# npm help
npm help

# Package-specific help
npm run <script> -- --help
```

## 🚨 Emergency Commands

### App Won't Start
```bash
# 1. Check Node version
node --version  # Must be 18+

# 2. Clean everything
rm -rf node_modules .next package-lock.json

# 3. Reinstall
npm install

# 4. Check for errors
npm run type-check

# 5. Try to start
npm run dev
```

### Build Fails
```bash
# 1. Check TypeScript
npm run type-check

# 2. Check ESLint
npm run lint

# 3. Clear cache
rm -rf .next

# 4. Try again
npm run build
```

---

## 📱 Quick Reference Card

```
┌─────────────────────────────────────────┐
│  MOST USED COMMANDS                     │
├─────────────────────────────────────────┤
│  npm run dev        → Start dev server  │
│  npm run build      → Production build  │
│  npm run type-check → Check types       │
│  npm run lint       → Check code        │
│  npm run format     → Format code       │
└─────────────────────────────────────────┘
```

Keep this file bookmarked for quick reference! 📌
