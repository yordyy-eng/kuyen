/**
 * lib/rate-limit.ts
 * Sistema de protección anti-spam en memoria para Server Actions.
 * US-509: Limitador estricto por IP.
 */

interface RateTracker {
  count: number;
  resetAt: number;
}

// Global para persistir entre invocaciones de Server Actions en el mismo proceso
const trackers = new Map<string, RateTracker>();

// Limpieza periódica de memoria para evitar leaks (cada hora)
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, tracker] of trackers.entries()) {
      if (now > tracker.resetAt) {
        trackers.delete(ip);
      }
    }
  }, 1000 * 60 * 60);
}

export interface RateLimitResponse {
  success: boolean;
  retryAfterMinutes: number;
}

/**
 * Verifica si una IP ha excedido el límite de peticiones.
 * @param ip Dirección IP del cliente
 * @param limit Máximo de peticiones permitidas (default 5)
 * @param windowMs Ventana de tiempo en ms (default 10 minutos)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): RateLimitResponse {
  const now = Date.now();
  const tracker = trackers.get(ip);

  // 1. Si no existe o expiró, inicializar
  if (!tracker || now > tracker.resetAt) {
    trackers.set(ip, {
      count: 1,
      resetAt: now + windowMs
    });
    return { success: true, retryAfterMinutes: 0 };
  }

  // 2. Si excedió el límite
  if (tracker.count >= limit) {
    const remainingMs = tracker.resetAt - now;
    return {
      success: false,
      retryAfterMinutes: Math.ceil(remainingMs / (60 * 1000))
    };
  }

  // 3. Incrementar contador
  tracker.count++;
  return { success: true, retryAfterMinutes: 0 };
}
