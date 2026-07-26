/**
 * Homepage E2E Tests
 * 
 * Tests the main landing page functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/MyStream/);
    
    // Check main heading or hero banner exists
    const hero = page.locator('[data-testid="hero-banner"]').or(page.locator('h1').first());
    await expect(hero).toBeVisible();
  });

  test('should display content rows', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for content rows
    const contentRows = page.locator('[data-testid="content-row"]');
    const count = await contentRows.count();
    
    // Should have at least one content row
    expect(count).toBeGreaterThan(0);
  });

  test('should show navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    await expect(nav).toBeVisible();
  });

  test('should be able to scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Check scroll position changed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
