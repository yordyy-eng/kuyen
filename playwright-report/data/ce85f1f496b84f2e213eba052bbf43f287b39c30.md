# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\admin-auth.spec.ts >> Autenticación Admin >> debe redirigir al login si no hay sesión activa
- Location: tests\e2e\admin-auth.spec.ts:9:7

# Error details

```
Error: page.goto: Server returned nothing (no headers, no data)
Call log:
  - navigating to "http://127.0.0.1:3000/admin", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * admin-auth.spec.ts
  5  |  * US-503: Autenticación Administrativa
  6  |  */
  7  | test.describe('Autenticación Admin', () => {
  8  | 
  9  |   test('debe redirigir al login si no hay sesión activa', async ({ page }) => {
> 10 |     await page.goto('/admin');
     |                ^ Error: page.goto: Server returned nothing (no headers, no data)
  11 |     // Verifica que la URL contenga /admin/login
  12 |     await expect(page).toHaveURL(/\/admin\/login/);
  13 |     await expect(page.getByRole('heading', { name: /Administración/i })).toBeVisible();
  14 |   });
  15 | 
  16 |   test('debe permitir el acceso con credenciales válidas', async ({ page }) => {
  17 |     await page.goto('/admin/login');
  18 |     
  19 |     // Usar credenciales de desarrollo
  20 |     await page.getByLabel(/Correo electrónico/i).fill('admin@kuyen.cl');
  21 |     await page.getByLabel(/Contraseña/i).fill('K@y3nAdm1n2026!');
  22 |     
  23 |     await page.getByRole('button', { name: /Acceder al panel/i }).click();
  24 | 
  25 |     // Debería entrar al Dashboard (US-510)
  26 |     await expect(page).toHaveURL('/admin');
  27 |     await expect(page.getByText(/KUYEN Command Center/i)).toBeVisible();
  28 |     await expect(page.getByRole('heading', { name: /Dashboard de Auditoría/i })).toBeVisible();
  29 |   });
  30 | 
  31 |   test('debe mostrar error con credenciales inválidas', async ({ page }) => {
  32 |     await page.goto('/admin/login');
  33 |     
  34 |     await page.getByLabel(/Correo electrónico/i).fill('hacker@evil.com');
  35 |     await page.getByLabel(/Contraseña/i).fill('wrong password');
  36 |     
  37 |     await page.getByRole('button', { name: /Acceder al panel/i }).click();
  38 | 
  39 |     // Debe mostrar alerta de error
  40 |     await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible();
  41 |     await expect(page).toHaveURL('/admin/login');
  42 |   });
  43 | });
  44 | 
```