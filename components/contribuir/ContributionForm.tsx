'use client';

import React, { useActionState } from 'react';
import { submitProposal } from '@/app/actions/proposals';
import PhotoUploadInput from './PhotoUploadInput';
import Link from 'next/link';

interface ContributionFormProps {
  citizenId: string;
  slug: string;
}

export default function ContributionForm({ citizenId, slug }: ContributionFormProps) {
  const [state, formAction, isPending] = useActionState(submitProposal, { success: false });

  // Si fue exitoso, mostramos la pantalla de éxito según PRD (T-501.8)
  if (state.success) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl leading-none">✓</span>
        </div>
        <h2 className="text-3xl font-serif text-primary mb-4">¡Gracias por tu aporte!</h2>
        <p className="text-secondary font-sans leading-relaxed mb-8 max-w-md mx-auto">
          Hemos recibido tu propuesta patrimonial de manera exitosa. 
          Nuestro equipo de conservación la revisará e incorporará al registro en un plazo aproximado de <strong className="text-primary font-medium">72 horas</strong>.
        </p>
        <Link
          href={`/memorial/${slug}`}
          className="inline-flex items-center px-8 py-3 bg-white border border-border text-primary font-sans text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
        >
          Volver al memorial
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-white border border-border/60 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      {/* Input Oculto para la Relación en PocketBase */}
      <input type="hidden" name="citizen" value={citizenId} />

      {state.error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-sm font-sans flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xl mt-0.5">⚠️</span>
          <p className="flex-1 leading-relaxed">
            {state.error}
          </p>
        </div>
      )}

      {/* Datos Personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-primary border-b border-border pb-2">Sobre ti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contributor_name" className="block text-sm font-sans font-medium text-primary mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="contributor_name"
              name="contributor_name"
              required
              disabled={isPending}
              className="w-full px-4 py-3 bg-surface border border-transparent focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 rounded-xl outline-none transition-all font-sans text-primary disabled:opacity-50"
              placeholder="Ej. María Sánchez"
            />
          </div>
          <div>
            <label htmlFor="contributor_email" className="block text-sm font-sans font-medium text-primary mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="contributor_email"
              name="contributor_email"
              required
              disabled={isPending}
              className="w-full px-4 py-3 bg-surface border border-transparent focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 rounded-xl outline-none transition-all font-sans text-primary disabled:opacity-50"
              placeholder="Ej. correo@dominio.cl"
            />
          </div>
        </div>
      </div>

      {/* Relato / Historia */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-primary border-b border-border pb-2">Aporte Patrimonial</h3>
        <div>
          <label htmlFor="biography" className="block text-sm font-sans font-medium text-primary mb-1">
            Información o Relato Biográfico *
          </label>
          <textarea
            id="biography"
            name="biography"
            required
            disabled={isPending}
            rows={6}
            className="w-full px-4 py-3 bg-surface border border-transparent focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 rounded-xl outline-none transition-all font-sans text-primary disabled:opacity-50 resize-none"
            placeholder="Comparte datos genealógicos, hitos importantes o anécdotas..."
          ></textarea>
        </div>
      </div>

      {/* Fotos */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-primary border-b border-border pb-2">Archivos Adjuntos</h3>
        <PhotoUploadInput />
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-sans font-medium text-base hover:bg-gold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:hover:bg-primary"
        >
          {isPending ? 'Enviando propuesta...' : 'Enviar Aporte'}
        </button>
      </div>
    </form>
  );
}
