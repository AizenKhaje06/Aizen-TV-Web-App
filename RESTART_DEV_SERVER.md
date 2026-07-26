# 🔄 How to Fix: ENOENT routes-manifest.json Error

## 🐛 PROBLEM

```
Error: ENOENT: no such file or directory, 
open '.next\routes-manifest.json'
GET / 500
```

## 🔍 ROOT CAUSE

This happens when:
1. You cleared the `.next` folder while dev server is running
2. You did hard refresh and something deleted the build files
3. The dev server is looking for files that no longer exist

## ✅ SOLUTION

**Stop and restart the dev server:**

### **Windows (Command Prompt/Terminal):**

1. **Stop the server:**
   - Press `Ctrl + C` in the terminal running dev server
   - Wait for it to fully stop

2. **Restart the server:**
   ```bash
   npm run dev
   ```

### **If Ctrl+C doesn't work:**

```bash
# Find and kill the process
taskkill /F /IM node.exe

# Then restart
npm run dev
```

## 🚨 IMPORTANT RULE

**NEVER clear `.next` folder while dev server is running!**

### **Correct Order:**

```bash
# Step 1: Stop dev server
Ctrl + C

# Step 2: Clear cache
npm run clean
# Or use clear-cache.bat

# Step 3: Start dev server
npm run dev

# Step 4: Refresh browser
Ctrl + Shift + R
```

### **Wrong Order (Don't do this!):**

```bash
❌ Dev server running
❌ Clear .next folder or run npm run clean
❌ Hard refresh browser
❌ Error: ENOENT routes-manifest.json
```

## ⚡ QUICK FIX NOW

1. Open terminal where dev server is running
2. Press `Ctrl + C` to stop it
3. Wait 2-3 seconds
4. Run: `npm run dev`
5. Wait for "Ready" message
6. Refresh browser

## 🛠️ UPDATED CLEAN SCRIPT

I'll update the clean script to check if dev server is running:

```json
"scripts": {
  "clean": "rimraf .next node_modules/.cache public/sw.js public/sw.js.map public/workbox-*.js",
  "clean:safe": "echo ⚠️ STOP dev server first (Ctrl+C), then run: npm run clean:dev",
  "clean:dev": "npm run clean && npm run dev"
}
```

## 📋 PROPER WORKFLOW

### **When Code Changes Look Wrong:**

**Option A: Let Fast Refresh Handle It**
```bash
# Dev server running
# Make code changes
# Save file
# Wait for Fast Refresh (automatic)
# Normal refresh browser (F5)
```

**Option B: Full Clean Restart**
```bash
# Stop dev server (Ctrl+C)
npm run clean:dev
# Wait for "Ready"
# Refresh browser
```

### **When UI Breaks After Hard Refresh:**

```bash
# 1. Stop dev server
Ctrl + C

# 2. Clean everything
npm run clean

# 3. Restart
npm run dev

# 4. Refresh browser
Ctrl + Shift + R
```

## 🎯 PREVENT THIS ERROR

### **Don't:**
- ❌ Clear `.next` while dev server running
- ❌ Delete build files manually during development
- ❌ Run clean scripts while dev server is active
- ❌ Hard refresh multiple times rapidly

### **Do:**
- ✅ Stop server before cleaning cache
- ✅ Use Fast Refresh (automatic on file save)
- ✅ Use normal refresh (F5) during development
- ✅ Only hard refresh when needed
- ✅ Keep DevTools open with "Disable cache" checked

## 🔧 IF ERROR PERSISTS

### **Nuclear Option:**

```bash
# 1. Stop dev server
Ctrl + C

# 2. Kill all node processes
taskkill /F /IM node.exe

# 3. Delete everything
rmdir /s /q .next
rmdir /s /q node_modules\.cache
del /q public\sw.js

# 4. Fresh start
npm run dev
```

### **Still Not Working?**

```bash
# Complete reinstall
npm run clean
rmdir /s /q node_modules
npm install
npm run dev
```

## 📝 SUMMARY

**The error happens because:**
- `.next` folder was deleted while server was running
- Server still running, looking for files that don't exist

**The fix:**
- **Stop server first** (Ctrl+C)
- **Then restart** (npm run dev)
- Browser auto-refreshes when ready

**Prevention:**
- Always stop server before cleaning cache
- Use normal refresh (F5) instead of hard refresh
- Let Fast Refresh handle code updates automatically

---

## ⚡ QUICK COMMAND REFERENCE

```bash
# Stop server
Ctrl + C

# Restart server
npm run dev

# Safe clean (with reminder)
npm run clean:safe

# Full clean and restart (stop server first!)
npm run clean:dev
```

**Current Status:** Server needs restart to rebuild `.next` folder
**Action Required:** Press Ctrl+C in your terminal, then run `npm run dev`
