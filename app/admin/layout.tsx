import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminLogout } from '@/app/actions/auth';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-constants';
import { getPendingProposalsCount } from '@/lib/pb-server';

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

  // Obtenemos el conteo de pendientes para el badge del sidebar.
  // Usamos el helper de pb-server que ya tiene manejo de errores silenciado.
  const pendingCount = await getPendingProposalsCount();

  // Con sesión: renderizar el panel de administración
  return (
    <div className="flex h-screen bg-white">
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-primary flex flex-col flex-shrink-0 border-r border-white/5">
        {/* Logo */}
        <div className="p-8 border-b border-white/5">
          <Link href="/admin" className="group">
            <div className="text-3xl font-serif tracking-tight text-white transition-all group-hover:tracking-wider">
              KU<span className="text-gold font-semibold">YEN</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[1px] w-4 bg-gold/50" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-sans">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-sans px-4 mb-4">
            Gestión de Contenidos
          </p>

          <Link
            href="/admin/propuestas"
            className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="text-xl group-hover:scale-110 transition-transform">📥</span>
              <span className="font-sans text-sm font-medium">Propuestas</span>
            </div>
            {pendingCount > 0 && (
              <span className="bg-gold text-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/citizens"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">👤</span>
            <span className="font-sans text-sm font-medium">Ciudadanos</span>
          </Link>

          <div className="pt-6">
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-sans px-4 mb-4">
              Sistema
            </p>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
              <span className="font-sans text-xs tracking-wide">Portal Público</span>
            </Link>
          </div>
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
