@echo off
echo ========================================
echo   CACHE CLEAR UTILITY
echo ========================================
echo.
echo WARNING: Make sure dev server is STOPPED before proceeding!
echo Press Ctrl+C in the terminal running "npm run dev"
echo.
pause

echo.
echo Clearing Next.js Build Cache...

REM Delete .next folder
if exist .next (
    rmdir /s /q .next
    echo [OK] Deleted .next folder
) else (
    echo [SKIP] .next folder not found
)

REM Delete node_modules cache
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo [OK] Deleted node_modules cache
) else (
    echo [SKIP] node_modules cache not found
)

REM Delete public service worker files
if exist public\sw.js (
    del /q public\sw.js
    echo [OK] Deleted service worker
) else (
    echo [SKIP] Service worker not found
)

if exist public\workbox-*.js (
    del /q public\workbox-*.js
    echo [OK] Deleted workbox files
) else (
    echo [SKIP] Workbox files not found
)

if exist public\sw.js.map (
    del /q public\sw.js.map
    echo [OK] Deleted service worker map
) else (
    echo [SKIP] Service worker map not found
)

echo.
echo ========================================
echo Cache cleared successfully!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Go to your terminal
echo 2. Run: npm run dev
echo 3. Wait for "Ready" message
echo 4. Refresh your browser
echo.
pause
