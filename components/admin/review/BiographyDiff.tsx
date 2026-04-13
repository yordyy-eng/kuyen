'use client';

import React from 'react';

interface Props {
  currentBio: string;
  proposedBio: string;
}

/**
 * US-505: BiographyDiff — Comparación lado a lado de biografías.
 * El lado propuesto es editable por el admin para correcciones finales.
 */
export default function BiographyDiff({ currentBio, proposedBio }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-surface border-l-4 border-gold">
        <span className="text-xl">✍️</span>
        <h3 className="font-serif text-lg text-primary">Revisión de Biografía</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Izquierdo: Actual */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-secondary/60 font-sans font-bold">
            Versión Actual en Repositorio
          </span>
          <div 
            className="p-4 bg-stone-50 border border-border rounded-xl min-h-[200px] text-sm text-secondary font-serif leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentBio || '<p class="italic text-secondary/40">Sin biografía registrada actualmente.</p>' }}
          />
        </div>

        {/* Lado Derecho: Propuesto e Interactivo */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold">
            Versión Propuesta (Editable)
          </span>
          <textarea
            name="final_biography"
            defaultValue={proposedBio}
            className="p-4 bg-white border-2 border-gold/30 rounded-xl min-h-[200px] text-sm text-primary font-serif leading-relaxed focus:border-gold focus:ring-0 transition-all resize-y"
            placeholder="Edita la biografía propuesta aquí..."
          />
          <p className="text-[9px] text-secondary/50 italic px-1">
            * Los cambios realizados en este cuadro serán los que se publiquen definitivamente.
          </p>
        </div>
      </div>
    </div>
  );
}
