'use client';

/**
 * US-503: Página de Login del Panel Admin.
 * Diseño minimalista y solemne, consistente con el sistema de diseño KUYEN.
 * No revela información operacional sobre la infraestructura.
 */

import React, { useActionState } from 'react';
import { adminLogin } from '@/app/actions/auth';
import type { AuthState } from '@/app/actions/auth';

const initialState: AuthState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl font-serif tracking-tight text-primary">
            KU<span className="text-gold font-semibold text-5xl">YEN</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary font-sans mt-3">
            Sistema de Gestión Patrimonial
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">

          {/* Header de la card */}
          <div className="mb-8">
            <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
                Acceso Restringido
              </span>
            </div>
            <h1 className="text-2xl font-serif text-primary leading-tight">
              Iniciar sesión
            </h1>
            <p className="text-sm text-secondary font-sans mt-1.5">
              Área reservada para personal autorizado del sistema KUYEN.
            </p>
          </div>

          {/* Formulario */}
          <form action={formAction} className="space-y-5" noValidate>

            {/* Error genérico (sin revelar qué campo falló) */}
            {state.error && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-sans"
              >
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                <span>{state.error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-medium text-primary mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                disabled={isPending}
                autoComplete="email"
                className="w-full px-4 py-3 bg-surface border border-transparent focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 rounded-xl outline-none transition-all font-sans text-primary placeholder:text-secondary/40 disabled:opacity-50"
                placeholder="admin@kuyen.cl"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-sans font-medium text-primary mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                disabled={isPending}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-surface border border-transparent focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 rounded-xl outline-none transition-all font-sans text-primary disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Botón de acceso */}
            <button
              type="submit"
              disabled={isPending}
              id="btn-admin-login"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-sans font-medium text-base hover:bg-gold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:hover:bg-primary mt-2"
            >
              {isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acceder al panel'
              )}
            </button>
          </form>
        </div>

        {/* Footer legal */}
        <p className="text-center text-[10px] uppercase tracking-widest text-secondary/40 font-sans mt-8">
          © 2026 KUYEN — Municipalidad de Angol
        </p>
      </div>
    </main>
  );
}
