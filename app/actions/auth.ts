'use server';

/**
 * US-503: Server Actions de Autenticación del Panel Admin.
 * Usa pb.collection('_superusers') — API correcta para PocketBase v0.23+.
 * NUNCA devolver mensajes específicos sobre qué campo falló (info leakage).
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { ADMIN_COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth-constants';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface AuthState {
  error: string | null;
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

// ── adminLogin ─────────────────────────────────────────────────────────────────
/**
 * Autentica un superusuario contra PocketBase (_superusers collection).
 * En caso de error (credenciales inválidas, red, etc.), retorna un mensaje
 * genérico que no revela qué campo falló.
 * En caso de éxito, guarda el token en cookie httpOnly y redirige a /admin.
 */
export async function adminLogin(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim();
  const password = formData.get('password') as string | null;

  // Defensive: inputs vacíos (HTML required ya lo previene, pero por seguridad)
  if (!email || !password) {
    return { error: 'Credenciales incorrectas.' };
  }

  try {
    // Nueva instancia por request (no compartir estado entre usuarios)
    const pb = new PocketBase(PB_URL);
    pb.autoCancellation(false);

    // PocketBase v0.23+: admins → _superusers collection
    const authData = await pb.collection('_superusers').authWithPassword(email, password);

    const token = authData.token;
    if (!token) {
      return { error: 'Credenciales incorrectas.' };
    }

    // Guardar token en cookie HttpOnly — inaccesible a JavaScript del cliente
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  } catch {
    // Mensaje genérico: no revelar si el email no existe o la contraseña es incorrecta
    return { error: 'Credenciales incorrectas.' };
  }

  // Redirigir FUERA del try/catch (redirect() lanza internamente)
  redirect('/admin');
}

// ── adminLogout ────────────────────────────────────────────────────────────────
/**
 * Destruye la sesión admin eliminando la cookie y redirige al login.
 */
export async function adminLogout(): Promise<never> {
  const cookieStore = await cookies();

  // Eliminar la cookie de sesión
  cookieStore.delete(ADMIN_COOKIE_NAME);

  redirect('/admin/login');
}
