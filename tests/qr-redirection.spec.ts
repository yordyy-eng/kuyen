import { test, expect } from '@playwright/test';

/**
 * US-202: QR Redirection Middleware Verification
 * Validates that /q/:code correctly redirects to /memorial/:slug
 * or shows the custom 404 page.
 */
test.describe('QR Redirection (US-202)', () => {
  
  test('should gracefully handle unseeded specific QR code like /q/c001', async ({ page }) => {
    // Note: In an unseeded CI environment, c001 will not be found in PocketBase.
    // The middleware should safely fallback to the 404 custom experience.
    
    // We navigate to a QR code path
    await page.goto('/q/c001');
    
    // We expect the URL to change to the not-found page because it's not seeded
    await expect(page).toHaveURL(/\/not-found/);
  });

  test('should redirect invalid QR codes to /not-found', async ({ page }) => {
    // Navigate to a definitely nonexistent code
    await page.goto('/q/nonexistent-code-999');
    
    // Should be on the not-found page
    await expect(page).toHaveURL(/\/not-found/);
    
    // Verify the custom text is present
    const heading = page.locator('h1');
    await expect(heading).toContainText('Registro Patrimonial No Encontrado');
  });

  test('should handle missing code parameter by redirecting to /not-found', async ({ page }) => {
    await page.goto('/q/');
    await expect(page).toHaveURL(/\/not-found/);
  });
});
