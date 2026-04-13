# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\admin-auth.spec.ts >> Autenticación Admin >> debe redirigir al login si no hay sesión activa
- Location: tests\e2e\admin-auth.spec.ts:9:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Administración/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: /Administración/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4] [cursor=pointer]: KUYEN
      - button "Menú principal" [ref=e5]:
        - img [ref=e6]
  - main [ref=e8]:
    - main [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: KUYEN
          - paragraph [ref=e13]: Sistema de Gestión Patrimonial
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: Acceso Restringido
            - heading "Iniciar sesión" [level=1] [ref=e17]
            - paragraph [ref=e18]: Área reservada para personal autorizado del sistema KUYEN.
          - generic [ref=e19]:
            - generic [ref=e20]:
              - generic [ref=e21]: Correo electrónico
              - textbox "Correo electrónico" [ref=e22]:
                - /placeholder: admin@kuyen.cl
            - generic [ref=e23]:
              - generic [ref=e24]: Contraseña
              - textbox "Contraseña" [ref=e25]:
                - /placeholder: ••••••••
            - button "Acceder al panel" [ref=e26]
        - paragraph [ref=e27]: © 2026 KUYEN — Municipalidad de Angol
  - contentinfo [ref=e28]:
    - generic [ref=e29]:
      - paragraph [ref=e30]: Sistema KUYEN
      - paragraph [ref=e31]: Municipalidad de Angol
      - paragraph [ref=e33]: Desarrollado sobre OCI • 2024
  - button "Open Next.js Dev Tools" [ref=e39] [cursor=pointer]:
    - img [ref=e40]
  - alert [ref=e43]
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
  10 |     await page.goto('/admin');
  11 |     // Verifica que la URL contenga /admin/login
  12 |     await expect(page).toHaveURL(/\/admin\/login/);
> 13 |     await expect(page.getByRole('heading', { name: /Administración/i })).toBeVisible();
     |                                                                          ^ Error: expect(locator).toBeVisible() failed
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