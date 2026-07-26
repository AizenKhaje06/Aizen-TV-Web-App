# 🚀 Quick Start Guide

Get MyStream up and running in 5 minutes!

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **TMDB API Key**: [Get it here](https://www.themoviedb.org/settings/api)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- React Query
- And more...

### 2. Get Your TMDB API Key

1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key (v3 auth)

### 3. Configure Environment

The `.env.local` file should already exist. Open it and update:

```env
NEXT_PUBLIC_TMDB_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

Replace `YOUR_ACTUAL_API_KEY_HERE` with the API key you just copied.

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the MyStream homepage!

## Verify Installation

### Check TypeScript Compilation
```bash
npm run type-check
```

Should show: "No errors found"

### Check Linting
```bash
npm run lint
```

Should show: "No linting errors found"

### Check Formatting
```bash
npm run format
```

Should format all files

## Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

## Testing the API Connection

Once the server is running, you can test the TMDB API connection by checking the browser console. The app will automatically validate your API key on startup.

### If You See Errors

**"Invalid environment variables"**
- Make sure `.env.local` exists
- Check that all required variables are set
- Restart the dev server after changing .env.local

**"[401] Unauthorized"**
- Your TMDB API key is invalid
- Double-check you copied the correct key
- Make sure you're using the API key (v3 auth), not the API Read Access Token

**"Network Error"**
- Check your internet connection
- TMDB API might be temporarily down
- Try again in a few minutes

## Project Structure

After installation, your project should look like this:

```
mystream/
├── node_modules/      # Dependencies (auto-generated)
├── .next/            # Next.js build output (auto-generated)
├── public/           # Static assets
├── src/              # Source code
├── .env.local        # Environment variables (YOUR CONFIG)
├── package.json      # Dependencies list
└── README.md         # Documentation
```

## What's Next?

You're now ready to:
1. **Explore the code** in `src/`
2. **Read the architecture** in `ARCHITECTURE.md`
3. **Start Phase 2** when provided
4. **Customize** the design and features

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"
```

## IDE Setup (Optional)

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Settings (Optional)
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Need Help?

1. Check `README.md` for detailed documentation
2. Review `ARCHITECTURE.md` for technical details
3. Inspect `PHASE1_COMPLETE.md` for what's been built
4. Check the console for error messages

---

**Happy Coding! 🎬**
