'use client';

import React, { useState, useEffect } from 'react';

/**
 * Utility to slugify strings.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalizar tildes
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .trim()
    .replace(/\s+/g, '-') // Espacios por guiones
    .replace(/[^\w-]+/g, '') // Quitar caracteres especiales
    .replace(/--+/g, '-'); // Quitar dobles guiones
}

interface SEOFieldsProps {
  initialFullName?: string;
  initialSlug?: string;
  initialMetaDescription?: string;
}

export default function SEOFields({ 
  initialFullName = '', 
  initialSlug = '', 
  initialMetaDescription = '' 
}: SEOFieldsProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [metaDesc, setMetaDesc] = useState(initialMetaDescription);
  const [name, setName] = useState(initialFullName);

  // Efecto para auto-slug si está vacío
  useEffect(() => {
    // Escuchar el input de nombre que está fuera de este componente (vía DOM o props si se prefiere)
    // Pero aquí usaremos un listener de evento simple para mayor desacoplamiento o simplemente Props.
    // Por ahora, el componente padre pasará el fullName.
    if (!slug || slug === slugify(initialFullName)) {
       setSlug(slugify(initialFullName));
    }
  }, [initialFullName]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
       // Reset al nombre si se borra todo
       const nameInput = document.querySelector('input[name="full_name"]') as HTMLInputElement;
       setSlug(slugify(nameInput?.value || ''));
    } else {
       setSlug(val);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-border/40">
      <h3 className="text-sm font-serif font-bold text-primary flex items-center gap-2">
        <span>🌐</span> Centro de Control SEO
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campo Slug */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 block font-sans">
            Slug de URL (Permanente)
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-sans">
              kuyen.cl/memorial/
            </span>
            <input 
              type="text" 
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              required
              className="w-full bg-white border border-border rounded-xl pl-[135px] pr-4 py-3 text-sm font-sans text-primary focus:border-gold transition-all"
              placeholder="ej: pedro-de-ona"
            />
          </div>
          <p className="text-[9px] text-secondary/40 italic font-sans">
            * Se genera automáticamente si se deja vacío. Evite cambiarlo tras publicar.
          </p>
        </div>

        {/* Campo Meta Descripción */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 block font-sans">
              Meta Descripción (Google)
            </label>
            <span className={`text-[10px] font-bold font-sans ${metaDesc.length > 160 ? 'text-red-500' : 'text-green-600'}`}>
              {metaDesc.length} / 160
            </span>
          </div>
          <textarea 
            name="meta_description"
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            maxLength={200}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-sans min-h-[80px] resize-none focus:border-gold transition-all"
            placeholder="Resumen optimizado para buscadores..."
          />
          <p className="text-[9px] text-secondary/40 italic font-sans leading-tight">
            Este texto es el que aparece bajo el título en los resultados de Google.
          </p>
        </div>
      </div>
    </div>
  );
}
