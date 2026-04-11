import React from 'react';
import Link from 'next/link';
import { getCitizenBySlug } from '@/lib/pb-server';

/**
 * Vista de Detalle: Memorial del Ciudadano
 * Diseño optimizado para lectura móvil bajo el sol.
 */
export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const citizen = await getCitizenBySlug(slug);

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Navegación Superior */}
      <nav className="max-w-3xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="text-gold font-sans text-sm font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">←</span> Volver al directorio
        </Link>
      </nav>

      {/* Cabecera del Memorial */}
      <header className="max-w-3xl mx-auto px-4 mb-12 text-center md:text-left">
        <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
            In memoriam
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight mb-4">
          {citizen.full_name}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-y border-border/40 py-6 mt-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-sans">Periodo</span>
            <span className="text-lg font-serif italic text-gold">
              {citizen.birth_year || '—'} — {citizen.death_year || 'Presente'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-sans">Categoría</span>
            <span className="text-lg font-serif italic text-gold">
              {citizen.patrimonial_category}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Biográfico */}
      <section className="max-w-2xl mx-auto px-6 md:px-0">
        <div className="bg-surface/30 rounded-xl p-1 mb-10">
          <div className="border border-border/20 rounded-lg p-6 md:p-10 bg-white shadow-sm">
            <p className="font-sans text-primary text-lg leading-relaxed whitespace-pre-wrap selection:bg-gold-light/30">
              {citizen.biography}
            </p>
          </div>
        </div>

        {/* Cita de cierre o metadato cultural */}
        <div className="mt-16 text-center border-t border-border pt-12">
          <div className="text-3xl text-gold font-serif opacity-40 mb-4">“</div>
          <p className="font-serif italic text-secondary text-lg max-w-md mx-auto">
            La memoria es el único paraíso del que no podemos ser expulsados.
          </p>
        </div>
      </section>
    </article>
  );
}
