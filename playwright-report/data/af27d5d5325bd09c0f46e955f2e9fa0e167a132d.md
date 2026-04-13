# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-contribution.spec.ts >> Security & Resilience - Contribution Form (US-501) >> Prueba Bypass Tipos: Rechazar MIME Spoofing (.txt disfrazado de .jpg)
- Location: tests\security-contribution.spec.ts:77:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Formato no permitido"
Received string:    ""
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
    - article [ref=e9]:
      - navigation [ref=e10]:
        - link "← Volver al memorial" [ref=e11]:
          - /url: /memorial/seguridad-test
          - generic [ref=e12]: ←
          - text: Volver al memorial
      - generic [ref=e13]:
        - generic [ref=e14]: Archivo Abierto
        - heading "Contribuir al legado de Test de Seguridad" [level=1] [ref=e15]:
          - text: Contribuir al legado de
          - text: Test de Seguridad
        - paragraph [ref=e16]: La memoria compartida enriquece nuestro patrimonio. Utiliza este formulario para aportar datos históricos, fotografías relevantes o anécdotas que permitan completar el perfil biográfico.
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Sobre ti" [level=3] [ref=e20]
          - generic [ref=e21]:
            - generic [ref=e22]:
              - generic [ref=e23]: Nombre Completo *
              - textbox "Nombre Completo *" [ref=e24]:
                - /placeholder: Ej. María Sánchez
            - generic [ref=e25]:
              - generic [ref=e26]: Correo Electrónico *
              - textbox "Correo Electrónico *" [ref=e27]:
                - /placeholder: Ej. correo@dominio.cl
        - generic [ref=e28]:
          - heading "Aporte Patrimonial" [level=3] [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]: Información o Relato Biográfico *
            - textbox "Información o Relato Biográfico *" [ref=e32]:
              - /placeholder: Comparte datos genealógicos, hitos importantes o anécdotas...
        - generic [ref=e33]:
          - heading "Archivos Adjuntos" [level=3] [ref=e34]
          - generic [ref=e35]:
            - generic [ref=e36]: Fotografías históricas (Opcional, máx. 3)
            - button "Haz clic aquí para seleccionar imágenes" [ref=e37]:
              - generic [ref=e38]: Haz clic aquí para seleccionar imágenes
            - generic [ref=e40]:
              - img "Preview 1" [ref=e41]
              - button "Eliminar foto" [ref=e43]:
                - generic [ref=e44]: ✕
        - button "Enviar Aporte" [ref=e46]
  - contentinfo [ref=e47]:
    - generic [ref=e48]:
      - paragraph [ref=e49]: Sistema KUYEN
      - paragraph [ref=e50]: Municipalidad de Angol
      - paragraph [ref=e52]: Desarrollado sobre OCI • 2024
  - button "Open Next.js Dev Tools" [ref=e58] [cursor=pointer]:
    - img [ref=e59]
  - alert [ref=e64]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import fs from 'fs';
  3   | import path from 'path';
  4   | import crypto from 'crypto';
  5   | 
  6   | /**
  7   |  * Utilidad: Crea un archivo dummy del tamaño especificado para simular distintos archivos
  8   |  */
  9   | const createDummyFile = (size: number, name: string) => {
  10  |   const filePath = path.join(__dirname, name);
  11  |   const buffer = crypto.randomBytes(size);
  12  |   fs.writeFileSync(filePath, buffer);
  13  |   return filePath;
  14  | };
  15  | 
  16  | /**
  17  |  * Utilidad: Limpiar archivos creados post-test
  18  |  */
  19  | const cleanupFile = (filePath: string) => {
  20  |   if (fs.existsSync(filePath)) {
  21  |     fs.unlinkSync(filePath);
  22  |   }
  23  | };
  24  | 
  25  | /**
  26  |  * US-501: Security & Contribution Form Resilience
  27  |  * Vectors: DoS (File Size), MIME Spoofing, XSS/Payload Overload, API Bypass
  28  |  */
  29  | test.describe('Security & Resilience - Contribution Form (US-501)', () => {
  30  |   
  31  |   test.beforeEach(async ({ page }) => {
  32  |     // Mockeamos la existencia del ciudadano 'seguridad-test' para que no tengamos
  33  |     // dependencia de la DB de PocketBase en el frontend al renderizar la página.
  34  |     await page.route('**/api/collections/citizens/records*', async route => {
  35  |       await route.fulfill({
  36  |         status: 200,
  37  |         json: {
  38  |           items: [{
  39  |             id: 'cit_sec_12345',
  40  |             slug: 'seguridad-test',
  41  |             full_name: 'Test de Seguridad',
  42  |             patrimonial_category: 'Militar'
  43  |           }]
  44  |         }
  45  |       });
  46  |     });
  47  |   });
  48  | 
  49  |   test('Prueba de DoS: Rechazar carga de archivos mayores a 5MB', async ({ page }) => {
  50  |     await page.goto('/contribuir/seguridad-test');
  51  |     
  52  |     // Archivo de 6MB (Supera el límite de 5MB)
  53  |     const largeFilePath = createDummyFile(6 * 1024 * 1024, 'payload_large.jpg');
  54  |     
  55  |     try {
  56  |       let dialogMessage = '';
  57  |       
  58  |       page.once('dialog', async dialog => {
  59  |         dialogMessage = dialog.message();
  60  |         await dialog.dismiss();
  61  |       });
  62  | 
  63  |       const fileChooserPromise = page.waitForEvent('filechooser');
  64  |       await page.click('text=Haz clic aquí para seleccionar imágenes');
  65  |       const fileChooser = await fileChooserPromise;
  66  |       
  67  |       await fileChooser.setFiles(largeFilePath);
  68  |       await page.waitForTimeout(500);
  69  | 
  70  |       expect(dialogMessage).toContain('excede los 5MB');
  71  |       
  72  |     } finally {
  73  |       cleanupFile(largeFilePath);
  74  |     }
  75  |   });
  76  | 
  77  |   test('Prueba Bypass Tipos: Rechazar MIME Spoofing (.txt disfrazado de .jpg)', async ({ page }) => {
  78  |     await page.goto('/contribuir/seguridad-test');
  79  |     
  80  |     // Archivo de texto engañoso
  81  |     const spoofedFilePath = path.join(__dirname, 'spoofed.jpg');
  82  |     fs.writeFileSync(spoofedFilePath, 'Este texto es un payload disfrazado. MZ MZ EXE');
  83  |     
  84  |     try {
  85  |       let dialogMessage = '';
  86  |       
  87  |       page.once('dialog', async dialog => {
  88  |         dialogMessage = dialog.message();
  89  |         await dialog.dismiss();
  90  |       });
  91  | 
  92  |       const fileChooserPromise = page.waitForEvent('filechooser');
  93  |       await page.click('text=Haz clic aquí para seleccionar imágenes');
  94  |       const fileChooser = await fileChooserPromise;
  95  |       
  96  |       await fileChooser.setFiles(spoofedFilePath);
  97  |       await page.waitForTimeout(500);
  98  | 
> 99  |       expect(dialogMessage).toContain('Formato no permitido');
      |                             ^ Error: expect(received).toContain(expected) // indexOf
  100 |       
  101 |     } finally {
  102 |       cleanupFile(spoofedFilePath);
  103 |     }
  104 |   });
  105 | 
  106 |   test('Prueba Inyección: Control de XSS Payload Masivo (Overload)', async ({ page }) => {
  107 |     await page.goto('/contribuir/seguridad-test');
  108 |     
  109 |     // Generar un payload destructivo de más de 10,000 caracteres
  110 |     const xssScript = '<script>window.location="http://evil.com"; alert("hacked");</script>';
  111 |     const massivePayload = xssScript + 'M'.repeat(10050);
  112 |     
  113 |     // Monitoreamos eventos onDialog para confirmar si el XSS se ejecutara en vivo
  114 |     let executedAlert = false;
  115 |     page.on('dialog', dialog => {
  116 |       executedAlert = true;
  117 |       dialog.dismiss();
  118 |     });
  119 | 
  120 |     await page.fill('input[name="contributor_name"]', '<img src="x" onerror="alert(1)">');
  121 |     await page.fill('input[name="contributor_email"]', 'xss@test.org');
  122 |     await page.fill('textarea[name="biography"]', massivePayload);
  123 |     
  124 |     await page.click('button[type="submit"]');
  125 |     
  126 |     // Debe bloquearse por Next.js CSRF, ser sanitizado por React y/o bloqueado por Zod > limit
  127 |     expect(executedAlert).toBeFalsy(); 
  128 |     
  129 |     // Si la BD de Next no se cae, y el payload largo es truncado o rechazado con error:
  130 |     await expect(page.getByText('Error')).toBeVisible().catch(() => {}); // Optional check for custom error UX
  131 |   });
  132 | 
  133 |   test('Prueba Bypasear Next.js: Envío Directo a PocketBase debe estar Cerrado (400/403/401)', async ({ request }) => {
  134 |     // Simulamos un atacante que descubre el endpoint expuesto de DB e intenta escribir sin Next.js
  135 |     const response = await request.post('http://127.0.0.1:8091/api/collections/proposals/records', {
  136 |       data: {
  137 |         citizen: 'cit_sec_12345',
  138 |         contributor_name: 'Direct Attacker',
  139 |         contributor_email: 'direct@attacker.com',
  140 |         biography: 'Direct bypass payload',
  141 |         status: 'approved' // Intentando auto-aprobarse
  142 |       }
  143 |     });
  144 | 
  145 |     // Ya que se instruyó usar `createRule: null`, la BD rechazará la petición anónima directa.
  146 |     // PocketBase retorna comunmente 400 o 403 a la creación inválida de guest con roles nulos.
  147 |     expect(response.status()).toBeGreaterThanOrEqual(400);    
  148 |   });
  149 | 
  150 |   test('Happy Path Seguro: Propuesta Válida renderiza Éxito Inline', async ({ page }) => {
  151 |     // Mockeamos la ruta del Server Action de PocketBase como ÉXITO si tiene auth o admin.
  152 |     // Esto asegura que la prueba de UI no dependa del estado asíncrono real de la DB, 
  153 |     // sino que garantice la UX de Next.js
  154 |     await page.route('**/api/collections/proposals/records', async route => {
  155 |       if (route.request().method() === 'POST') {
  156 |         await route.fulfill({
  157 |           status: 200,
  158 |           json: { id: 'new_valid_proposal', status: 'pending' }
  159 |         });
  160 |       } else {
  161 |         await route.fallback();
  162 |       }
  163 |     });
  164 | 
  165 |     await page.goto('/contribuir/seguridad-test');
  166 |     
  167 |     const validImage = createDummyFile(1024, 'valid_foto.jpg');
  168 |     
  169 |     try {
  170 |       const fileChooserPromise = page.waitForEvent('filechooser');
  171 |       await page.click('text=Haz clic aquí para seleccionar imágenes');
  172 |       const fileChooser = await fileChooserPromise;
  173 |       await fileChooser.setFiles(validImage);
  174 |       
  175 |       await page.fill('input[name="contributor_name"]', 'Ciudadano Responsable');
  176 |       await page.fill('input[name="contributor_email"]', 'ciudadano@chile.cl');
  177 |       await page.fill('textarea[name="biography"]', 'Biografía histórica documentada válida.');
  178 |       
  179 |       await page.click('button[type="submit"]');
  180 |       
  181 |       // US-501 Criterios de Aceptación: Éxito Inline
  182 |       await expect(page.getByText('¡Gracias por tu aporte!')).toBeVisible({ timeout: 10000 });
  183 |       await expect(page.getByText('72 horas')).toBeVisible();
  184 |       
  185 |       // Asertamos que el formulario original desaparece (condición inline form swap)
  186 |       await expect(page.locator('input[name="contributor_name"]')).not.toBeVisible();
  187 |     } finally {
  188 |       cleanupFile(validImage);
  189 |     }
  190 |   });
  191 | });
  192 | 
```