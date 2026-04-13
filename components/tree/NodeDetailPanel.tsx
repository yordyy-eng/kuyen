'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { CitizenRecord, getPBImageUrl } from '@/lib/pb-server';

interface NodeDetailPanelProps {
  citizen: CitizenRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * US-406: Panel de detalle inferior (Bottom Sheet).
 * Diseño optimizado para móviles con gestos de cierre y navegación.
 */
export default function NodeDetailPanel({ citizen, isOpen, onClose }: NodeDetailPanelProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lógica de Swipe Down para cerrar
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    const isSwipeDown = distance > minSwipeDistance;
    if (isSwipeDown) onClose();
  };

  // Bloquear scroll del cuerpo cuando el panel está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!citizen) return null;

  const imageUrl = getPBImageUrl(citizen);

  return (
    <>
      {/* Overlay translúcido */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel Bottom Sheet */}
      <div
        ref={panelRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-[32px] shadow-2xl
          transition-transform duration-500 ease-out transform
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-w-2xl mx-auto w-full
        `}
      >
        {/* Tirador para el gesto de swipe */}
        <div className="w-full h-8 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-border rounded-full" />
        </div>

        <div className="px-6 pb-10 pt-2">
          {/* Botón de Cierre */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-secondary hover:bg-stone-200 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Imagen de Perfil */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-surface border border-border flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={citizen.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                   <span className="text-4xl font-serif">👤</span>
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold">
                  {citizen.patrimonial_category}
                </span>
                <h3 className="text-2xl font-serif text-primary mt-1">
                  {citizen.full_name}
                </h3>
                <p className="text-sm text-secondary font-serif italic">
                  {citizen.birth_year || '—'} — {citizen.death_year || 'Presente'}
                </p>
              </div>

              {citizen.short_bio && (
                <p className="text-sm text-primary leading-relaxed font-sans line-clamp-3">
                  {citizen.short_bio}
                </p>
              )}

              <div className="pt-4">
                <Link
                  href={`/memorial/${citizen.slug}`}
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl font-sans text-sm font-medium hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                >
                  Ver perfil completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
