'use client';

import React, { useState } from 'react';
import { getPocketBaseFileUrl } from '@/lib/pb-client-utils';

interface Props {
  proposalId: string;
  photos: string[];
}

/**
 * US-505: PhotoReviewGrid — Rejilla de selección de fotos propuestas.
 * Permite al admin elegir individualmente cuáles se integran al perfil público.
 */
export default function PhotoReviewGrid({ proposalId, photos }: Props) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(photos);

  const togglePhoto = (photo: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photo) ? prev.filter(p => p !== photo) : [...prev, photo]
    );
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 bg-stone-50/50">
        <span className="text-3xl opacity-40">📷</span>
        <p className="text-sm font-sans text-secondary/60 italic">No se adjuntaron fotografías en esta propuesta.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-surface border-l-4 border-gold">
        <span className="text-xl">📸</span>
        <h3 className="font-serif text-lg text-primary">Revisión de Fotografías</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => {
          const url = getPocketBaseFileUrl('proposals', proposalId, photo, '400x400');
          const isSelected = selectedPhotos.includes(photo);

          return (
            <div 
              key={index}
              className={`
                relative rounded-2xl overflow-hidden border-2 transition-all duration-300 group cursor-pointer
                ${isSelected ? 'border-gold shadow-md scale-100' : 'border-transparent opacity-60 grayscale scale-95 hover:grayscale-0 hover:opacity-100'}
              `}
              onClick={() => togglePhoto(photo)}
            >
              <img 
                src={url} 
                alt={`Propuesta ${index + 1}`} 
                className="w-full h-48 object-cover"
              />
              
              {/* Checkbox Overlay */}
              <div className="absolute top-2 right-2">
                <input 
                  type="checkbox"
                  name="approved_photos"
                  value={photo}
                  checked={isSelected}
                  onChange={() => {}} // Manejado por el div click
                  className="w-6 h-6 rounded-full border-2 border-white bg-white/20 checked:bg-gold checked:border-gold focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Accion indicadora */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] text-white font-sans font-bold uppercase tracking-wider">
                  {isSelected ? '✓ Fotografía Seleccionada' : 'Click para Incluir'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-secondary/50 font-sans mt-2">
        * Selecciona las fotografías que cumplen con los estándares de calidad para ser añadidas a la galería del ciudadano.
      </p>
    </div>
  );
}
