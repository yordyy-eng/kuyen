# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\contribution.spec.ts >> Contribución Ciudadana >> debe mostrar error de Rate Limiting tras múltiples envíos
- Location: tests\e2e\contribution.spec.ts:31:7

# Error details

```
Error: page.goto: net::ERR_EMPTY_RESPONSE at http://127.0.0.1:3000/contribuir/saavedra
Call log:
  - navigating to "http://127.0.0.1:3000/contribuir/saavedra", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * contribution.spec.ts
  5  |  * US-501: Flujo de Contribución Ciudadana
  6  |  */
  7  | test.describe('Contribución Ciudadana', () => {
  8  |   const CITIZEN_SLUG = 'saavedra'; // Basado en el seed data
  9  | 
  10 |   test('debe cargar el formulario y enviar una propuesta válida', async ({ page }) => {
  11 |     // 1. Navegar a la página de contribución
  12 |     await page.goto(`/contribuir/${CITIZEN_SLUG}`);
  13 |     await page.waitForLoadState('networkidle');
  14 |     
  15 |     // 2. Verificar elementos clave del UI (Respetando el diseño Heritage)
  16 |     await expect(page.getByText(/Contribuir al legado/i)).toBeVisible();
  17 |     
  18 |     // 3. Llenar el formulario con datos de prueba
  19 |     await page.getByLabel(/Nombre completo/i).fill('Test User');
  20 |     await page.getByLabel(/Correo electrónico/i).fill('test@example.com');
  21 |     await page.getByLabel(/Relación o vínculo/i).fill('Amigo de la familia');
  22 |     await page.getByLabel(/relato/i).fill('Esta es una biografía de prueba generada por QA Automation.');
  23 | 
  24 |     // 4. Enviar
  25 |     await page.getByRole('button', { name: /Enviar Aporte/i }).click();
  26 | 
  27 |     // 5. Verificar mensaje de éxito
  28 |     await expect(page.getByText(/¡Gracias por tu aporte!/i)).toBeVisible();
  29 |   });
  30 | 
  31 |   test('debe mostrar error de Rate Limiting tras múltiples envíos', async ({ page }) => {
  32 |     // Nota: El rate limit es de 5 peticiones por 10 min. 
  33 |     // Para no saturar el servidor real en CI, este test es descriptivo 
  34 |     // o se puede ejecutar con un mock si es necesario.
  35 |     // Aquí validamos que el mensaje de error se renderice correctamente 
  36 |     // si el backend responde con 429.
  37 |     
> 38 |     await page.goto(`/contribuir/${CITIZEN_SLUG}`);
     |                ^ Error: page.goto: net::ERR_EMPTY_RESPONSE at http://127.0.0.1:3000/contribuir/saavedra
  39 |     
  40 |     // Forzamos el envío rápido (el componente deshabilita el botón, 
  41 |     // pero podemos interceptar o simplemente llenar y clickear).
  42 |     for (let i = 0; i < 2; i++) {
  43 |         await page.getByLabel(/Nombre completo/i).fill(`Spammer ${i}`);
  44 |         await page.getByLabel(/Correo electrónico/i).fill(`spam${i}@example.com`);
  45 |         await page.getByLabel(/Tu aporte biográfico/i).fill('Spam spam spam spam spam spam.');
  46 |         await page.getByRole('button', { name: /Enviar Propuesta/i }).click();
  47 |         // Esperamos a que el formulario se resetee o muestre éxito
  48 |         await page.waitForTimeout(1000);
  49 |     }
  50 |   });
  51 | });
  52 | 
```