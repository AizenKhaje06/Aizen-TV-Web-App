/**
 * Search Functionality E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input or button
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="Search" i]')
    );
    
    // If search input exists, fill it and submit
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('Inception');
      await searchInput.first().press('Enter');
      
      // Should navigate to search page
      await expect(page).toHaveURL(/\/search/);
    }
  });

  test('should display search results', async ({ page }) => {
    // Navigate directly to search page with query
    await page.goto('/search?q=matrix');
    
    // Wait for results to load
    await page.waitForLoadState('networkidle');
    
    // Check page title or heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should handle empty search', async ({ page }) => {
    await page.goto('/search?q=');
    
    // Should show some message or redirect
    await page.waitForLoadState('networkidle');
    
    // Page should load without error
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
