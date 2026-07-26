# Vercel Deployment Guide 🚀

## ✅ Issue Fixed!

The peer dependency conflict has been resolved by adding `.npmrc` file with `legacy-peer-deps=true`.

## Environment Variables for Vercel

Add these in **Vercel Dashboard → Settings → Environment Variables**:

### Required Variables (7 total):

```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Aizen TV
NEXT_PUBLIC_TMDB_API_KEY=3920fc0e7073b8d162a443df22158643
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_PLAYER_BASE_URL=https://vidsrc2.ru/embed
NODE_ENV=production
```

### Step-by-Step:

1. **Go to Vercel**
   - Open: https://vercel.com/dashboard
   - Select your project: `Aizen-TV-Web-App`

2. **Add Environment Variables**
   - Click "Settings" tab
   - Click "Environment Variables"
   - Add each variable one by one:

   | Variable Name | Value | Select Environments |
   |--------------|-------|-------------------|
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_APP_NAME` | `Aizen TV` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_TMDB_API_KEY` | `3920fc0e7073b8d162a443df22158643` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_TMDB_API_URL` | `https://api.themoviedb.org/3` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_TMDB_IMAGE_URL` | `https://image.tmdb.org/t/p` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_PLAYER_BASE_URL` | `https://vidsrc2.ru/embed` | ✅ Production, ✅ Preview, ✅ Development |
   | `NODE_ENV` | `production` | ✅ Production only |

3. **Trigger Redeploy**
   - After adding all variables
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait for build to complete

## Build Configuration

Vercel will automatically detect these settings from `package.json`:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install` (with legacy-peer-deps from .npmrc)
- **Development Command:** `npm run dev`

## Post-Deployment

1. **Update APP_URL**
   - After first deployment, copy your Vercel URL
   - Update `NEXT_PUBLIC_APP_URL` environment variable
   - Example: `https://aizen-tv.vercel.app`
   - Redeploy again

2. **Custom Domain (Optional)**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update `NEXT_PUBLIC_APP_URL` to match

## What Works Out of the Box

- ✅ **TMDB Integration** - Movies, TV Shows, Kids pages
- ✅ **AniList Integration** - Anime page (no API key needed!)
- ✅ **Video Streaming** - VidSrc player
- ✅ **PWA Support** - Install as app
- ✅ **Responsive Design** - Mobile to 4K
- ✅ **Navigation** - Keyboard and TV remote support

## Troubleshooting

### If build still fails:

1. Check all environment variables are added
2. Make sure you selected the right environments (Production, Preview, Development)
3. Verify `.npmrc` file exists in repository
4. Try "Redeploy" instead of pushing new commit

### If app loads but has errors:

1. Check browser console for errors
2. Verify `NEXT_PUBLIC_TMDB_API_KEY` is correct
3. Check if all environment variables start with `NEXT_PUBLIC_` (except NODE_ENV)

## Performance Optimization

Vercel automatically handles:
- ✅ Image optimization (Next.js Image component)
- ✅ Static page generation
- ✅ Edge caching
- ✅ Compression
- ✅ CDN distribution

## Monitoring

After deployment, monitor:
- Build logs in Vercel dashboard
- Runtime logs for errors
- Analytics (if enabled)
- Performance metrics

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

**Deployment Status:** ✅ Ready to deploy!
