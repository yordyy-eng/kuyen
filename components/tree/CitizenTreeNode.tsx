'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CitizenRecord, getPBImageUrl } from '@/lib/pb-server';

export interface CitizenNodeData extends CitizenRecord {
  relationLabel: string;
  isCurrent?: boolean;
}

/**
 * US-403: Nodo personalizado para el árbol genealógico.
 * Diseño solemne con soporte para avatares y estados activos.
 */
export default function CitizenTreeNode({ data: rawData }: NodeProps) {
  const data = rawData as unknown as CitizenNodeData;
  const { full_name, birth_year, death_year, relationLabel, isCurrent } = data;
  const imageUrl = getPBImageUrl(data);
  const initials = full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div 
      className={`
        relative px-4 py-3 rounded-xl border transition-all duration-300 w-[220px]
        ${isCurrent 
          ? 'bg-stone-100 border-gold border-2 shadow-md pointer-events-none' 
          : 'bg-white border-border hover:border-gold-light hover:shadow-sm cursor-pointer'}
      `}
    >
      {/* Handles invisibles para permitir conexiones sin ruido visual */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      <div className="flex flex-col items-center text-center gap-2">
        {/* Avatar / Iniciales */}
        <div 
          className={`
            w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2
            ${isCurrent ? 'border-gold' : 'border-stone-100'}
            bg-surface
          `}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={full_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-secondary font-serif font-bold text-sm">
              {initials}
            </span>
          )}
        </div>

        {/* Información del Ciudadano */}
        <div className="flex flex-col">
          <span className="font-serif font-bold text-primary leading-tight text-sm">
            {full_name}
          </span>
          <span className="text-[10px] text-gold-light italic font-serif mt-0.5">
            {birth_year || '—'} • {death_year || 'Presente'}
          </span>
          <div className="mt-1">
            <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-medium text-secondary/70 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
              {relationLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Indicador visual para nodos clicables */}
      {!isCurrent && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gold h-1 w-8 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
