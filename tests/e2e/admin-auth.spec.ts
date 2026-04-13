import { test, expect } from '@playwright/test';

/**
 * admin-auth.spec.ts
 * US-503: Autenticación Administrativa
 */
test.describe('Autenticación Admin', () => {

  test('debe redirigir al login si no hay sesión activa', async ({ page }) => {
    await page.goto('/admin');
    // Verifica que la URL contenga /admin/login
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole('heading', { name: /Administración/i })).toBeVisible();
  });

  test('debe permitir el acceso con credenciales válidas', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Usar credenciales de desarrollo
    await page.getByLabel(/Correo electrónico/i).fill('admin@kuyen.cl');
    await page.getByLabel(/Contraseña/i).fill('K@y3nAdm1n2026!');
    
    await page.getByRole('button', { name: /Acceder al panel/i }).click();

    // Debería entrar al Dashboard (US-510)
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText(/KUYEN Command Center/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Dashboard de Auditoría/i })).toBeVisible();
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/admin/login');
    
    await page.getByLabel(/Correo electrónico/i).fill('hacker@evil.com');
    await page.getByLabel(/Contraseña/i).fill('wrong password');
    
    await page.getByRole('button', { name: /Acceder al panel/i }).click();

    // Debe mostrar alerta de error
    await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible();
    await expect(page).toHaveURL('/admin/login');
  });
});
