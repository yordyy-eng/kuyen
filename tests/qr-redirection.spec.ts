import { test, expect } from '@playwright/test';

/**
 * US-202: QR Redirection Middleware Verification
 * Validates that /q/:code correctly redirects to /memorial/:slug
 * or shows the custom 404 page.
 */
test.describe('QR Redirection (US-202)', () => {
  
  test('should redirect /q/c001 to the correct memorial slug', async ({ page }) => {
    // Note: This test assumes code 'c001' exists in PocketBase and redirects to 'test-slug'
    // or whatever is in the sample data. In a real environment, we'd seed this.
    // For now, we verify the redirection logic handles the response.
    
    // We navigate to a QR code path
    await page.goto('/q/c001');
    
    // We expect the URL to change to the memorial page
    // Using a regex because we might not know the exact slug if it's dynamic
    await expect(page).toHaveURL(/\/memorial\/.+/);
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
