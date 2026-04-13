/**
 * Constantes compartidas de autenticación admin.
 * Separadas del archivo 'use server' porque Next.js 16 solo permite
 * exportar funciones async desde módulos marcados con 'use server'.
 */
export const ADMIN_COOKIE_NAME = 'kuyen_admin_session';
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas
