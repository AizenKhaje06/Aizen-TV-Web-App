# MyStream - Deployment Guide

**Version:** 1.2.0  
**Last Updated:** January 2025  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
4. [Alternative Platforms](#alternative-platforms)
5. [Environment Configuration](#environment-configuration)
6. [Domain Setup](#domain-setup)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Updates & Maintenance](#updates--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Overview

MyStream is designed for easy deployment on modern hosting platforms. This guide covers:
- ✅ Vercel (recommended - zero config)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ Docker / Self-hosted
- ✅ Environment configuration
- ✅ Domain setup
- ✅ Monitoring

### Deployment Requirements

**Minimum Requirements:**
- Node.js 18+ runtime
- Environment variables support
- HTTPS (required for PWA)
- Static file serving
- Next.js support

**Recommended:**
- Edge network (CDN)
- Auto-scaling
- Preview deployments
- Automatic deployments from Git

---

## Pre-Deployment Checklist

### 1. Code Quality

```bash
# Type check
npm run type-check
# Should output: 0 errors

# Lint
npm run lint
# Should output: 0 errors, 0 warnings

# Build
npm run build
# Should complete successfully
```

### 2. Environment Variables

Ensure you have:
- ✅ TMDB_API_KEY
- ✅ TMDB_BASE_URL
- ✅ TMDB_IMAGE_URL

```bash
# Verify .env.local exists
cat .env.local

# Should contain:
TMDB_API_KEY=your_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

### 3. Test Production Build Locally

```bash
# Build for production
npm run build

# Start production server
npm run start

# Test at http://localhost:3000
# Verify all features work
```

### 4. Security Check

- ✅ No API keys in client code
- ✅ `.env.local` in `.gitignore`
- ✅ `.env.example` updated with all vars
- ✅ No console.logs in production
- ✅ Security headers configured

### 5. Performance Check

```bash
# Check bundle sizes
npm run build

# Should show optimized bundles:
# Home: ~5-6 kB
# Movie detail: ~2 kB
# TV detail: ~2 kB
```

---

## Vercel Deployment (Recommended)

Vercel is the **recommended platform** for MyStream (built by Next.js creators).

### Why Vercel?

✅ Zero configuration for Next.js  
✅ Automatic deployments from Git  
✅ Preview deployments for PRs  
✅ Edge network (CDN)  
✅ Automatic HTTPS  
✅ Environment variables UI  
✅ Analytics built-in  
✅ Free tier available  

### Step 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Prepare for deployment"

# Push to GitHub (or GitLab, Bitbucket)
git push origin main
```

### Step 2: Connect to Vercel

**Option A: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in (use GitHub account)
3. Click **"New Project"**
4. **Import Git Repository**
   - Select your GitHub repository
   - Click "Import"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Build & Development Settings:**
```
Build Command: npm run build
Output Directory: .next (auto-detected)
Install Command: npm install
Development Command: npm run dev
```

**Root Directory:** `./` (leave as default)

### Step 4: Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `TMDB_API_KEY` | `your_actual_api_key` | Production, Preview, Development |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` | Production, Preview, Development |
| `TMDB_IMAGE_URL` | `https://image.tmdb.org/t/p` | Production, Preview, Development |

**Important:** 
- Select all environments (Production, Preview, Development)
- Never commit API keys to repository
- Keep keys in Vercel dashboard only

### Step 5: Deploy

**Automatic Deployment:**
- Every push to `main` → Production deployment
- Every PR → Preview deployment
- Automatic builds on code changes

**Manual Deployment:**
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Step 6: Verify Deployment

After deployment:

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → Latest
   - Should show "Build Successful"

2. **Visit Production URL**
   - Vercel provides URL: `https://your-project.vercel.app`
   - Test all features

3. **Test PWA**
   - Open in mobile browser
   - Install as app
   - Verify offline support

4. **Test TV Mode**
   - Enable TV override: `localStorage.setItem('tv-mode-override', 'true')`
   - Test navigation

---

## Alternative Platforms

### Netlify

**Pros:** Free tier, good for Next.js  
**Cons:** Requires `next.config.js` configuration

**Deployment Steps:**

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy

### AWS Amplify

**Pros:** AWS integration, scalable  
**Cons:** More complex setup

**Deployment Steps:**

1. Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. Click "New app" → "Host web app"
4. Connect repository
5. Configure build settings
6. Add environment variables
7. Deploy

### Docker / Self-Hosted

**For custom servers or cloud VMs:**

**1. Create Dockerfile:**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

**2. Build and run:**
```bash
# Build image
docker build -t mystream:latest .

# Run container
docker run -p 3000:3000 \
  -e TMDB_API_KEY=your_key \
  -e TMDB_BASE_URL=https://api.themoviedb.org/3 \
  -e TMDB_IMAGE_URL=https://image.tmdb.org/t/p \
  mystream:latest
```

**3. Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  mystream:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TMDB_API_KEY=${TMDB_API_KEY}
      - TMDB_BASE_URL=https://api.themoviedb.org/3
      - TMDB_IMAGE_URL=https://image.tmdb.org/t/p
    restart: unless-stopped
```

```bash
# Run with docker-compose
docker-compose up -d
```

### Static Export (Limited)

**Note:** MyStream uses dynamic routes and server-side features, so full static export is not recommended. Use platforms with Next.js support instead.

---

## Environment Configuration

### Required Variables

```env
# TMDB API Configuration (Required)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

### Optional Variables

```env
# Node Environment
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=MyStream

# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Monitoring (if using)
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
```

### Environment Best Practices

1. **Never commit secrets**
   ```bash
   # Ensure .env.local is in .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use .env.example**
   ```bash
   # Keep template updated
   cp .env.local .env.example
   # Remove actual values, keep structure
   ```

3. **Different environments**
   ```
   .env.local           # Local development
   .env.production      # Production build
   .env.test            # Testing
   ```

4. **Validate on startup**
   ```typescript
   // lib/validation/env.ts
   const envSchema = z.object({
     TMDB_API_KEY: z.string().min(1),
     TMDB_BASE_URL: z.string().url(),
     TMDB_IMAGE_URL: z.string().url(),
   });

   envSchema.parse(process.env);
   ```

---

## Domain Setup

### Using Vercel Domain

**Free subdomain:**
- `your-project.vercel.app`
- Automatic HTTPS
- No configuration needed

### Custom Domain

**1. Purchase domain** (from Namecheap, GoDaddy, Google Domains, etc.)

**2. Add to Vercel:**
- Vercel Dashboard → Project → Settings → Domains
- Click "Add"
- Enter your domain: `mystream.com`
- Click "Add"

**3. Configure DNS:**

Vercel will show you DNS records to add:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

Add these records in your domain registrar's DNS settings.

**4. Wait for DNS propagation** (5 minutes to 48 hours)

**5. Verify:**
- Vercel Dashboard will show "Valid Configuration"
- Visit `https://your-domain.com`
- HTTPS should be automatic

### Subdomain

Want `watch.mystream.com`?

```
Type: CNAME
Name: watch
Value: cname.vercel-dns.com
```

Add in Vercel: `watch.mystream.com`

### Multiple Domains

Can have multiple domains pointing to same app:
- `mystream.com` (primary)
- `www.mystream.com` (redirect)
- `mystream.app` (alias)

All configured in Vercel → Domains

---

## Post-Deployment

### 1. Verify All Features

**Test Checklist:**
- [ ] Home page loads
- [ ] Movies browse correctly
- [ ] TV shows browse correctly
- [ ] Search works
- [ ] Movie playback works
- [ ] TV episode playback works
- [ ] Continue watching updates
- [ ] Favorites persist
- [ ] PWA installs
- [ ] Offline page works
- [ ] TV mode activates (on TV devices)

### 2. Performance Testing

**Lighthouse Audit:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance, Accessibility, Best Practices, SEO, PWA"
4. Click "Generate report"

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 100

### 3. Mobile Testing

**Test on:**
- Android Chrome (PWA install)
- iOS Safari (PWA install)
- Different screen sizes
- Slow 3G connection

### 4. TV Testing

**Test on:**
- Android TV (if possible)
- Browser with TV override
- Large screen (1080p/4K)
- Remote navigation

### 5. Cross-Browser Testing

**Test on:**
- Chrome (Windows, Mac, Linux)
- Edge
- Firefox
- Safari (Mac, iOS)
- Brave

---

## Monitoring & Analytics

### Error Tracking (Sentry)

**1. Install Sentry:**
```bash
npm install @sentry/nextjs
```

**2. Initialize:**
```bash
npx @sentry/wizard@latest -i nextjs
```

**3. Configure:**
```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

**4. Add to Vercel:**
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Analytics (Google Analytics)

**1. Get GA4 Measurement ID**

**2. Add to .env:**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**3. Add to app/layout.tsx:**
```typescript
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

### Vercel Analytics

**Built-in (easiest):**

1. Vercel Dashboard → Project → Analytics
2. Click "Enable"
3. View Web Vitals, page views, etc.

**Free on all plans!**

### Custom Monitoring

Use existing logger system:

```typescript
// lib/logger/logger.ts
export const logger = {
  error: (message: string, meta?: object) => {
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Sentry, DataDog, etc.
    }
  }
};
```

---

## Updates & Maintenance

### Automatic Updates (Vercel)

**Zero-downtime deployments:**
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

### Manual Updates

```bash
# 1. Make changes
# 2. Test locally
npm run build
npm run start

# 3. Deploy
vercel --prod
```

### Rollback

**In Vercel Dashboard:**
1. Deployments → Select previous deployment
2. Click "⋮" menu → "Promote to Production"
3. Previous version goes live instantly

**With Git:**
```bash
git revert HEAD
git push origin main
# Vercel deploys previous version
```

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npm install package@latest

# Test thoroughly
npm run type-check
npm run lint
npm run build
npm run test
```

### Security Updates

**Automatic (Dependabot):**
- GitHub → Settings → Security → Enable Dependabot
- Auto PRs for security updates

**Manual:**
```bash
npm audit
npm audit fix
```

---

## Troubleshooting

### Build Fails

**Problem:** Build fails on Vercel

**Solutions:**

1. **Check build logs:**
   - Vercel Dashboard → Deployments → Failed build → Logs

2. **Common issues:**
   ```bash
   # Type errors
   npm run type-check
   
   # Lint errors
   npm run lint
   
   # Missing dependencies
   npm install
   ```

3. **Environment variables:**
   - Verify all vars are set in Vercel
   - Check spelling
   - Ensure no trailing spaces

### Environment Variables Not Working

**Problem:** API calls fail in production

**Solutions:**

1. **Verify variables set:**
   - Vercel Dashboard → Settings → Environment Variables
   - Should show all required vars

2. **Redeploy:**
   - After adding vars, trigger new deployment
   - Settings → Deployments → Redeploy

3. **Check variable names:**
   - Must match exactly (case-sensitive)
   - `TMDB_API_KEY` not `TMDB_API_key`

### 404 Errors on Dynamic Routes

**Problem:** `/movie/123` shows 404

**Solutions:**

1. **Ensure dynamic routes exist:**
   ```
   app/(main)/movie/[id]/page.tsx ✅
   ```

2. **Check Vercel routing:**
   - Should auto-configure for Next.js
   - No manual config needed

3. **Clear cache:**
   - Vercel Dashboard → Project → "⋮" → Invalidate Cache

### PWA Not Installing

**Problem:** Install prompt doesn't appear

**Solutions:**

1. **Check HTTPS:**
   - PWA requires HTTPS
   - Vercel provides automatic HTTPS
   - Custom domain must have SSL

2. **Verify manifest:**
   ```
   https://your-domain.com/manifest.json
   ```
   Should return valid JSON

3. **Check service worker:**
   ```
   https://your-domain.com/sw.js
   ```
   Should exist (auto-generated by next-pwa)

4. **Clear cache:**
   - Chrome DevTools → Application → Clear storage

### Slow Performance

**Problem:** Site loads slowly

**Solutions:**

1. **Check bundle sizes:**
   ```bash
   npm run build
   # Review bundle analysis
   ```

2. **Optimize images:**
   - Use Next.js `<Image>` component
   - Enable lazy loading

3. **Enable caching:**
   - Vercel automatically caches static assets
   - Check cache headers in Network tab

4. **Use CDN:**
   - Vercel provides global edge network
   - Ensure Vercel Analytics enabled

### API Rate Limits

**Problem:** TMDB API rate limit exceeded

**Solutions:**

1. **TMDB limits:**
   - Free tier: 40 requests per 10 seconds
   - Pro tier: Higher limits

2. **Caching:**
   - React Query caches for 1 hour
   - Should reduce API calls significantly

3. **Upgrade TMDB tier:**
   - Contact TMDB for higher limits

---

## Best Practices

### DO ✅

1. **Use environment variables for secrets**
2. **Enable automatic deployments**
3. **Test locally before deploying**
4. **Monitor error logs**
5. **Set up analytics**
6. **Use preview deployments for testing**
7. **Enable HTTPS everywhere**
8. **Keep dependencies updated**
9. **Have a rollback plan**

### DON'T ❌

1. **Don't commit API keys**
2. **Don't skip testing**
3. **Don't ignore build warnings**
4. **Don't deploy broken builds**
5. **Don't forget to set environment variables**
6. **Don't use HTTP (use HTTPS)**
7. **Don't deploy untested code**

---

## Quick Reference

### Deployment Commands

```bash
# Vercel
vercel              # Deploy to preview
vercel --prod       # Deploy to production

# Build locally
npm run build       # Production build
npm run start       # Start production server

# Testing
npm run type-check  # Type check
npm run lint        # Lint
npm run test        # Run tests
```

### Important URLs

```
Vercel Dashboard:    https://vercel.com/dashboard
Vercel Docs:         https://vercel.com/docs
TMDB API:            https://www.themoviedb.org/settings/api
Next.js Deployment:  https://nextjs.org/docs/deployment
```

---

## Summary

MyStream deployment is **simple and fast**:

1. ✅ Push code to GitHub
2. ✅ Connect to Vercel
3. ✅ Add environment variables
4. ✅ Deploy automatically

**Production Ready in 5 Minutes!** 🚀

---

**MyStream v1.2.0** - Deployment Guide  
**Built for Modern Hosting Platforms** ☁️🌐

