import { checkRateLimit } from '../lib/rate-limit';

console.log('--- Iniciando Prueba de Fuego (Rate Limit) ---');

const testIp = '192.168.1.1';

for (let i = 1; i <= 7; i++) {
  const result = checkRateLimit(testIp, 5, 10000); // 5 intentos, 10 seg ventana para el test
  console.log(`Petición ${i}: ${result.success ? '✅ ÉXITO' : '❌ BLOQUEADO'} (Reintento en: ${result.retryAfterMinutes} min)`);
}

console.log('--- Fin de la prueba ---');
