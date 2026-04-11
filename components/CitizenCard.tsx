import React from 'react';
import Link from 'next/link';

interface CitizenProps {
  name: string;
  role: string;
  era: string;
  bio: string;
  slug: string;
  year?: string;
}

const CitizenCard = ({ name, role, era, bio, slug, year }: CitizenProps) => {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Era/Año: Metadatos superiores con tracking amplio */}
        <div className="text-[10px] uppercase tracking-[0.2em] text-secondary font-sans mb-3 flex justify-between items-center">
          <span>{era}</span>
          {year && <span className="opacity-60">{year}</span>}
        </div>

        {/* Nombre: Fuerte impacto Serif */}
        <h3 className="font-serif text-2xl text-primary leading-tight mb-1 group-hover:text-gold transition-colors">
          {name}
        </h3>

        {/* Rol/Título: Serif Itálico Dorado */}
        <p className="font-serif italic text-gold text-lg mb-4">
          {role}
        </p>

        {/* Bio: Truncado a 3 líneas nativo de Tailwind v4 */}
        <p className="text-sm text-secondary font-sans leading-relaxed line-clamp-3 mb-6">
          {bio}
        </p>

        {/* Enlace de Acción: Botón fantasma con padding táctil */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <Link 
            href={`/memorial/${slug}`}
            className="text-gold font-sans text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer inline-flex"
          >
            Ver memorial <span className="text-lg leading-none">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenCard;
