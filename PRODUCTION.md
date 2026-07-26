# Production Deployment Guide

**MyStream v1.2.0 - Phase 7**  
**Last Updated:** January 2025

---

## 🎯 Pre-Deployment Checklist

### ✅ Environment Configuration

```bash
# Required environment variables for production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=MyStream
NEXT_PUBLIC_TMDB_API_KEY=your_production_api_key
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_PLAYER_BASE_URL=https://vidsrc2.ru/embed
NODE_ENV=production
```

### ✅ Security Checklist

- [ ] All environment variables are set in production
- [ ] No sensitive keys in source code
- [ ] Security headers configured in next.config.mjs
- [ ] CSP policy is appropriate for your domain
- [ ] HTTPS is enabled (required for PWA)
- [ ] API keys are rotated (if needed)
- [ ] Error messages don't expose sensitive information
- [ ] Input validation is enabled
- [ ] All dependencies are up to date

### ✅ Performance Checklist

- [ ] Production build completes successfully
- [ ] Bundle size is acceptable (<100 kB first load)
- [ ] Images are optimized (AVIF/WebP)
- [ ] Code splitting is working
- [ ] Service worker is generated
- [ ] Cache strategies are configured
- [ ] No console.log in production (removed by compiler)
- [ ] Performance monitoring is active

### ✅ Testing Checklist

- [ ] All TypeScript errors resolved (0 errors)
- [ ] All ESLint errors resolved (0 errors)
- [ ] Manual testing on desktop browser
- [ ] Manual testing on mobile browser
- [ ] PWA installation tested
- [ ] Offline functionality tested
- [ ] TV navigation tested (with keyboard)
- [ ] Search functionality working
- [ ] Player loading working
- [ ] All critical user flows tested

### ✅ SEO Checklist

- [ ] Meta tags are properly set
- [ ] Open Graph tags configured
- [ ] Twitter cards configured
- [ ] Robots.txt exists (if needed)
- [ ] Sitemap generated (optional)
- [ ] Canonical URLs set
- [ ] Dynamic metadata working

### ✅ Monitoring Checklist

- [ ] Error tracking configured (Sentry or alternative)
- [ ] Analytics configured (GA4 or alternative)
- [ ] Performance monitoring active
- [ ] Logging system operational
- [ ] Alerts configured for critical errors

---

## 🚀 Deployment Steps

### Step 1: Pre-Deployment Testing

```bash
# 1. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Run type check
npm run type-check

# 3. Run lint
npm run lint

# 4. Build for production
npm run build

# 5. Test production build locally
npm run start
# Visit http://localhost:3000 and test thoroughly
```

### Step 2: Vercel Deployment (Recommended)

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically on push to main

#### Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_TMDB_API_KEY=your_api_key
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_PLAYER_BASE_URL=https://vidsrc2.ru/embed
```

### Step 3: Alternative Deployment Platforms

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

#### Cloudflare Pages

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set build output: `.next`
4. Add environment variables
5. Deploy

#### Docker (Self-Hosted)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mystream .
docker run -p 3000:3000 --env-file .env.production mystream
```

---

## 📊 Post-Deployment Verification

### Immediate Checks (First 5 minutes)

1. **Site is accessible**
   - [ ] Visit your production URL
   - [ ] Site loads without errors
   - [ ] No blank pages

2. **Core functionality works**
   - [ ] Home page displays content
   - [ ] Search works
   - [ ] Movie/TV details load
   - [ ] Player loads (test one movie)

3. **PWA works**
   - [ ] Install prompt appears (first visit)
   - [ ] App can be installed
   - [ ] Service worker registers
   - [ ] Offline page works

4. **No console errors**
   - Open DevTools Console
   - Check for JavaScript errors
   - Verify no failed API requests

### Extended Testing (First 30 minutes)

1. **Performance**
   ```bash
   # Run Lighthouse audit
   npm install -g lighthouse
   lighthouse https://your-domain.com --view
   ```
   
   Target Scores:
   - Performance: >90
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

2. **Security**
   - Check security headers: https://securityheaders.com/
   - Target Grade: A or A+
   - Verify HTTPS is working
   - Test CSP policy doesn't block functionality

3. **Mobile Testing**
   - Test on actual mobile device
   - Test PWA installation
   - Test offline functionality
   - Verify responsive design

4. **Cross-Browser Testing**
   - Chrome (desktop & mobile)
   - Firefox
   - Safari (desktop & iOS)
   - Edge

---

## 🔧 Monitoring Setup

### Error Tracking with Sentry

1. **Create Sentry Account**
   - Sign up at https://sentry.io

2. **Install Sentry SDK**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure Sentry**
   Add to `.env.production`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_AUTH_TOKEN=your_auth_token
   ```

4. **Update logger.ts**
   Uncomment Sentry integration in `src/lib/logger/logger.ts`

### Analytics with Google Analytics 4

1. **Create GA4 Property**
   - Go to https://analytics.google.com
   - Create new GA4 property

2. **Install GA4**
   ```bash
   npm install @next/third-parties
   ```

3. **Add to layout.tsx**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     )
   }
   ```

4. **Configure Events**
   Update logger or create analytics wrapper to send custom events

---

## 🎯 Performance Optimization

### After First Deploy

1. **Analyze Bundle Size**
   ```bash
   npm run build
   # Review output for large bundles
   ```

2. **Check Core Web Vitals**
   - Use Vercel Analytics (if on Vercel)
   - Or use Google Search Console
   - Monitor LCP, FID, CLS

3. **Optimize Images**
   - Ensure all images use Next/Image
   - Check image sizes are appropriate
   - Verify AVIF/WebP formats are used

4. **Review Caching**
   - Check service worker is caching correctly
   - Verify React Query cache is working
   - Monitor cache hit rates

---

## 🐛 Troubleshooting

### Build Fails

**TypeScript errors:**
```bash
npm run type-check
# Fix all errors before deploying
```

**Missing environment variables:**
```bash
# Check .env.example for required variables
# Ensure all are set in production environment
```

**Dependency issues:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site Not Loading

**Check DNS:**
- Verify domain points to correct server
- Wait for DNS propagation (up to 48 hours)

**Check Deployment Logs:**
- Vercel: Check deployment logs in dashboard
- Netlify: Check deploy log
- Self-hosted: Check container/server logs

**Check Environment Variables:**
- Verify all required variables are set
- Check for typos in variable names

### PWA Not Installing

**HTTPS required:**
- PWA requires HTTPS in production
- Localhost works without HTTPS

**Check manifest.json:**
- Verify manifest is accessible at /manifest.json
- Check all required fields are present

**Check service worker:**
- Verify sw.js is generated
- Check browser DevTools → Application → Service Workers

### Performance Issues

**High LCP:**
- Optimize hero image loading
- Use priority prop on hero image
- Reduce above-the-fold content

**High CLS:**
- Set explicit image dimensions
- Avoid injecting content above existing content
- Use font-display: swap

**High FID:**
- Reduce JavaScript bundle size
- Defer non-critical JavaScript
- Split large components

---

## 📈 Ongoing Maintenance

### Weekly Tasks

- [ ] Review error logs (Sentry or logs)
- [ ] Check performance metrics
- [ ] Monitor uptime
- [ ] Review security alerts

### Monthly Tasks

- [ ] Update dependencies
  ```bash
  npm outdated
  npm update
  npm audit fix
  ```
- [ ] Review analytics data
- [ ] Check for new security vulnerabilities
- [ ] Test critical user flows
- [ ] Backup data (if applicable)

### Quarterly Tasks

- [ ] Performance audit (Lighthouse)
- [ ] Security audit
- [ ] User feedback review
- [ ] Feature planning

---

## 🔒 Security Best Practices

### Regular Security Checks

1. **Dependency Audit**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Update Dependencies**
   ```bash
   npm update
   # Test thoroughly after updates
   ```

3. **Environment Variables**
   - Rotate API keys periodically
   - Never commit .env files
   - Use different keys for dev/prod

4. **Security Headers**
   - Already configured in next.config.mjs
   - Verify at https://securityheaders.com/

5. **HTTPS**
   - Enforced by Vercel/Netlify
   - Configure for self-hosted deployments

---

## 🚨 Incident Response

### Site Down

1. Check hosting platform status
2. Check deployment logs
3. Check error tracking (Sentry)
4. Rollback to previous version if needed
5. Fix issue and redeploy

### Performance Degradation

1. Check performance monitoring
2. Review recent changes
3. Check external API status (TMDB)
4. Review server resources (if self-hosted)
5. Optimize or rollback

### Security Breach

1. Rotate all API keys immediately
2. Review access logs
3. Check for unauthorized code changes
4. Update all dependencies
5. Deploy security patches
6. Notify users if needed

---

## 📞 Support Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- TMDB API: https://developers.themoviedb.org/3

### Monitoring
- Vercel Analytics: https://vercel.com/analytics
- Sentry: https://sentry.io
- Google Analytics: https://analytics.google.com

### Security
- Security Headers: https://securityheaders.com/
- SSL Labs: https://www.ssllabs.com/ssltest/
- Content Security Policy: https://csp-evaluator.withgoogle.com/

---

## ✅ Production Deployment Complete!

Once all checklists are complete:

✓ Environment configured  
✓ Security hardened  
✓ Performance optimized  
✓ Monitoring active  
✓ Site deployed  
✓ Post-deployment verified  

**Your MyStream instance is production-ready!** 🚀

---

**Questions or Issues?**

Review this guide, check logs, and refer to the phase documentation for detailed information about each system.

**MyStream v1.2.0 - Production Ready**
