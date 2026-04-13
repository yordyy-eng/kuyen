import React from 'react';
import Link from 'next/link';

/**
 * Admin Dashboard — Placeholder v0.4.0
 * Será expandido con widgets de propuestas pendientes y métricas en futuras US.
 */
export default function AdminDashboardPage() {
  return (
    <div className="p-8 md:p-12">

      {/* Cabecera */}
      <div className="mb-10">
        <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
            Sistema KUYEN
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
          Panel de <span className="text-gold italic">Administración</span>
        </h1>
        <p className="text-secondary font-sans leading-relaxed mt-3 max-w-2xl">
          Gestiona el registro patrimonial del Cementerio Municipal de Angol.
          Desde aquí puedes revisar propuestas ciudadanas, actualizar perfiles y administrar el directorio.
        </p>
      </div>

      {/* Widgets de acceso rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">

        {/* Propuestas */}
        <Link
          href="/admin/proposals"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="font-serif text-xl text-primary group-hover:text-gold transition-colors">
            Propuestas
          </h2>
          <p className="text-sm text-secondary font-sans mt-1 leading-relaxed">
            Revisa y modera los aportes ciudadanos pendientes de aprobación.
          </p>
          <div className="flex items-center gap-1 mt-4 text-gold font-sans text-sm font-medium">
            <span>Gestionar</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Ciudadanos */}
        <Link
          href="/admin/citizens"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-3">👥</div>
          <h2 className="font-serif text-xl text-primary group-hover:text-gold transition-colors">
            Ciudadanos
          </h2>
          <p className="text-sm text-secondary font-sans mt-1 leading-relaxed">
            Administra los perfiles del directorio patrimonial público.
          </p>
          <div className="flex items-center gap-1 mt-4 text-gold font-sans text-sm font-medium">
            <span>Administrar</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Sitio público */}
        <Link
          href="/"
          target="_blank"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-3">🌐</div>
          <h2 className="font-serif text-xl text-primary group-hover:text-gold transition-colors">
            Sitio Público
          </h2>
          <p className="text-sm text-secondary font-sans mt-1 leading-relaxed">
            Ver el portal KUYEN tal como lo ven los ciudadanos.
          </p>
          <div className="flex items-center gap-1 mt-4 text-gold font-sans text-sm font-medium">
            <span>Abrir</span>
            <span className="group-hover:translate-x-1 transition-transform">↗</span>
          </div>
        </Link>
      </div>

      {/* Nota técnica */}
      <div className="mt-16 max-w-2xl border-t border-border pt-8">
        <p className="text-[11px] text-secondary/50 font-sans uppercase tracking-widest">
          v0.4.0 — Panel en construcción
        </p>
        <p className="text-xs text-secondary/40 font-sans mt-1">
          Las secciones de Propuestas y Ciudadanos estarán disponibles en US-504.
        </p>
      </div>
    </div>
  );
}
