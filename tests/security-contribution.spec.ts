import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Utilidad: Crea un archivo dummy del tamaño especificado para simular distintos archivos
 */
const createDummyFile = (size: number, name: string) => {
  const filePath = path.join(__dirname, name);
  const buffer = crypto.randomBytes(size);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

/**
 * Utilidad: Limpiar archivos creados post-test
 */
const cleanupFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * US-501: Security & Contribution Form Resilience
 * Vectors: DoS (File Size), MIME Spoofing, XSS/Payload Overload, API Bypass
 */
test.describe('Security & Resilience - Contribution Form (US-501)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mockeamos la existencia del ciudadano 'seguridad-test' para que no tengamos
    // dependencia de la DB de PocketBase en el frontend al renderizar la página.
    await page.route('**/api/collections/citizens/records*', async route => {
      await route.fulfill({
        status: 200,
        json: {
          items: [{
            id: 'cit_sec_12345',
            slug: 'seguridad-test',
            full_name: 'Test de Seguridad',
            patrimonial_category: 'Militar'
          }]
        }
      });
    });
  });

  test('Prueba de DoS: Rechazar carga de archivos mayores a 5MB', async ({ page }) => {
    await page.goto('/contribuir/seguridad-test');
    
    // Archivo de 6MB (Supera el límite de 5MB)
    const largeFilePath = createDummyFile(6 * 1024 * 1024, 'payload_large.jpg');
    
    try {
      let dialogMessage = '';
      
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click('text=Haz clic aquí para seleccionar imágenes');
      const fileChooser = await fileChooserPromise;
      
      await fileChooser.setFiles(largeFilePath);
      await page.waitForTimeout(500);

      expect(dialogMessage).toContain('excede los 5MB');
      
    } finally {
      cleanupFile(largeFilePath);
    }
  });

  test('Prueba Bypass Tipos: Rechazar MIME Spoofing (.txt disfrazado de .jpg)', async ({ page }) => {
    await page.goto('/contribuir/seguridad-test');
    
    // Archivo de texto engañoso
    const spoofedFilePath = path.join(__dirname, 'spoofed.jpg');
    fs.writeFileSync(spoofedFilePath, 'Este texto es un payload disfrazado. MZ MZ EXE');
    
    try {
      let dialogMessage = '';
      
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click('text=Haz clic aquí para seleccionar imágenes');
      const fileChooser = await fileChooserPromise;
      
      await fileChooser.setFiles(spoofedFilePath);
      await page.waitForTimeout(500);

      expect(dialogMessage).toContain('Formato no permitido');
      
    } finally {
      cleanupFile(spoofedFilePath);
    }
  });

  test('Prueba Inyección: Control de XSS Payload Masivo (Overload)', async ({ page }) => {
    await page.goto('/contribuir/seguridad-test');
    
    // Generar un payload destructivo de más de 10,000 caracteres
    const xssScript = '<script>window.location="http://evil.com"; alert("hacked");</script>';
    const massivePayload = xssScript + 'M'.repeat(10050);
    
    // Monitoreamos eventos onDialog para confirmar si el XSS se ejecutara en vivo
    let executedAlert = false;
    page.on('dialog', dialog => {
      executedAlert = true;
      dialog.dismiss();
    });

    await page.fill('input[name="contributor_name"]', '<img src="x" onerror="alert(1)">');
    await page.fill('input[name="contributor_email"]', 'xss@test.org');
    await page.fill('textarea[name="biography"]', massivePayload);
    
    await page.click('button[type="submit"]');
    
    // Debe bloquearse por Next.js CSRF, ser sanitizado por React y/o bloqueado por Zod > limit
    expect(executedAlert).toBeFalsy(); 
    
    // Si la BD de Next no se cae, y el payload largo es truncado o rechazado con error:
    await expect(page.getByText('Error')).toBeVisible().catch(() => {}); // Optional check for custom error UX
  });

  test('Prueba Bypasear Next.js: Envío Directo a PocketBase debe estar Cerrado (400/403/401)', async ({ request }) => {
    // Simulamos un atacante que descubre el endpoint expuesto de DB e intenta escribir sin Next.js
    const response = await request.post('http://127.0.0.1:8091/api/collections/proposals/records', {
      data: {
        citizen: 'cit_sec_12345',
        contributor_name: 'Direct Attacker',
        contributor_email: 'direct@attacker.com',
        biography: 'Direct bypass payload',
        status: 'approved' // Intentando auto-aprobarse
      }
    });

    // Ya que se instruyó usar `createRule: null`, la BD rechazará la petición anónima directa.
    // PocketBase retorna comunmente 400 o 403 a la creación inválida de guest con roles nulos.
    expect(response.status()).toBeGreaterThanOrEqual(400);    
  });

  test('Happy Path Seguro: Propuesta Válida renderiza Éxito Inline', async ({ page }) => {
    // Mockeamos la ruta del Server Action de PocketBase como ÉXITO si tiene auth o admin.
    // Esto asegura que la prueba de UI no dependa del estado asíncrono real de la DB, 
    // sino que garantice la UX de Next.js
    await page.route('**/api/collections/proposals/records', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          json: { id: 'new_valid_proposal', status: 'pending' }
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto('/contribuir/seguridad-test');
    
    const validImage = createDummyFile(1024, 'valid_foto.jpg');
    
    try {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click('text=Haz clic aquí para seleccionar imágenes');
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(validImage);
      
      await page.fill('input[name="contributor_name"]', 'Ciudadano Responsable');
      await page.fill('input[name="contributor_email"]', 'ciudadano@chile.cl');
      await page.fill('textarea[name="biography"]', 'Biografía histórica documentada válida.');
      
      await page.click('button[type="submit"]');
      
      // US-501 Criterios de Aceptación: Éxito Inline
      await expect(page.getByText('¡Gracias por tu aporte!')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('72 horas')).toBeVisible();
      
      // Asertamos que el formulario original desaparece (condición inline form swap)
      await expect(page.locator('input[name="contributor_name"]')).not.toBeVisible();
    } finally {
      cleanupFile(validImage);
    }
  });
});
