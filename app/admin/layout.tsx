import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminLogout } from '@/app/actions/auth';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-constants';

/**
 * US-503: Admin Layout — Sidebar + Secondary Auth Check.
 *
 * Diseño inteligente que evita el loop de redirección:
 * - Si NO hay sesión: renderiza children directamente (aplica a /admin/login).
 *   El proxy.ts ya habrá redirigido cualquier ruta protegida antes de llegar aquí.
 * - Si HAY sesión: renderiza la sidebar de administración con el contenido.
 *
 * Nota: Este layout es hijo de app/layout.tsx (que incluye Header/Footer públicos).
 * Para una separación visual completa, se puede migrar a route groups en el futuro.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);

  // Sin sesión: modo transparente (para /admin/login, sin sidebar)
  if (!session?.value) {
    return <>{children}</>;
  }

  // Con sesión: renderizar el panel de administración
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-primary flex flex-col flex-shrink-0 border-r border-white/10">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin">
            <div className="text-2xl font-serif tracking-tight text-white">
              KU<span className="text-gold font-semibold text-3xl">YEN</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-sans mt-1">
              Panel de Administración
            </p>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-sans px-4 pt-2 pb-1">
            Gestión
          </p>

          <Link
            href="/admin/proposals"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all font-sans text-sm"
          >
            <span className="w-5 text-center">📋</span>
            <span>Propuestas</span>
          </Link>

          <Link
            href="/admin/citizens"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all font-sans text-sm"
          >
            <span className="w-5 text-center">👤</span>
            <span>Ciudadanos</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all font-sans text-sm"
          >
            <span className="w-5 text-center">🌐</span>
            <span>Ver sitio público</span>
          </Link>
        </nav>

        {/* Cerrar sesión */}
        <div className="p-4 border-t border-white/10">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all font-sans text-sm text-left"
            >
              <span className="w-5 text-center">↩</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
