'use client';

import React from 'react';
import Link from 'next/link';

interface TreeContributePromptProps {
  slug: string;
}

/**
 * US-409: Estado Vacío / Invitación a Colaborar.
 * Aparece cuando no hay relaciones registradas para un ciudadano.
 */
export default function TreeContributePrompt({ slug }: TreeContributePromptProps) {
  return (
    <section className="mt-16 bg-surface/30 rounded-3xl border border-border/40 p-8 md:p-12 text-center">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-border shadow-sm mb-2">
          <span className="text-3xl font-serif text-gold">?</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif text-primary">
          ¿Conoces la historia de esta familia?
        </h2>
        
        <p className="text-secondary font-sans leading-relaxed">
          Nuestra misión es preservar el legado y los vínculos de quienes forjaron nuestra identidad. 
          Aún no hemos documentado los lazos familiares de este registro patrimonial.
        </p>
        
        <div className="pt-4">
          <Link
            href={`/contribuir/${slug}`}
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white rounded-xl font-sans text-sm font-medium hover:bg-gold transition-all shadow-lg active:scale-95"
          >
            Contribuir información
          </Link>
        </div>
        
        <p className="text-[10px] uppercase tracking-widest text-secondary/60 font-sans pt-4">
          Cada fragmento de memoria ayuda a completar el puente entre generaciones.
        </p>
      </div>
    </section>
  );
}
