import React from 'react';
import Image from 'next/image';
import CitizenCard from '@/components/CitizenCard';
import { listCitizens } from '@/lib/pb-server';

/**
 * Directorio Público de Ciudadanos — Modern Heritage Edition
 * Refactorización hacia una estética de museo minimalista.
 */
export default async function Home() {
  const citizens = await listCitizens();

  return (
    <div className="relative min-h-screen bg-[#f8f4ef]">
      {/* 1. Background Watermark Map */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-[80vh]">
        <Image 
          src="/assets/map_watermark.png" 
          alt="Mapa Histórico de Angol" 
          fill
          className="object-cover opacity-10 mix-blend-multiply transition-opacity duration-1000"
          priority
        />
      </div>

      <main className="relative z-10">
        {/* 2. Hero Section: Glassmorphism & Minimalist Search */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/40 border border-amber-900/10 shadow-md rounded-2xl p-8 md:p-12 text-center">
            <div className="mb-6 inline-block py-1 px-4 bg-amber-900/5 rounded-full">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-amber-900/70">
                Archivo Vivo del Patrimonio
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-primary leading-tight mb-8">
              Kuyen <span className="text-gold italic">Heritage</span>
            </h1>

            {/* Búsqueda Minimalista */}
            <div className="max-w-lg mx-auto relative group">
              <input 
                type="text" 
                placeholder="Buscar por nombre o apellido..." 
                className="w-full bg-white/60 border border-amber-900/20 rounded-lg px-5 py-4 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/30 transition-all placeholder:text-secondary/50 placeholder:italic"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-gold/60 transition-colors">
                🔎
              </span>
            </div>

            <div className="mt-8 text-secondary/70 font-sans text-xs uppercase tracking-widest">
              Explora la memoria colectiva de Angol
            </div>
          </div>
        </section>

        {/* 3. Historical Gallery (Modern Heritage) */}
        <section className="py-20 bg-amber-900/[0.02] border-y border-amber-900/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 opacity-80">
              {/* Oña */}
              <div className="flex flex-col items-center gap-4 group">
                <div className="relative w-40 h-54 overflow-hidden rounded-sm grayscale-[.40] sepia-[.30] mix-blend-multiply transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 opacity-60">
                  <Image src="/assets/ona_portrait.png" alt="Pedro de Oña" fill className="object-cover" />
                </div>
                <span className="font-serif italic text-secondary text-sm">Pedro de Oña</span>
              </div>

              {/* Saavedra */}
              <div className="flex flex-col items-center gap-4 group mt-8 md:mt-0">
                <div className="relative w-48 h-64 overflow-hidden rounded-sm grayscale-[.40] sepia-[.30] mix-blend-multiply shadow-sm transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 opacity-60">
                  <Image src="/assets/saavedra_portrait.png" alt="Cornelio Saavedra" fill className="object-cover" />
                </div>
                <span className="font-serif italic text-secondary text-sm">C. Saavedra</span>
              </div>

              {/* Botánica */}
              <div className="flex flex-col items-center gap-4 group">
                <div className="relative w-40 h-54 overflow-hidden rounded-sm grayscale-[.40] sepia-[.30] mix-blend-multiply transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 opacity-60">
                  <Image src="/assets/botanica_illustration.png" alt="Botánica Patrimonial" fill className="object-cover" />
                </div>
                <span className="font-serif italic text-secondary text-sm">Botánica</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Citizens List Archive */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-primary border-b border-gold/20 pb-4 inline-block">
              Registros <span className="italic text-gold">Patrimoniales</span>
            </h2>
          </div>

          {citizens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {citizens.map((citizen) => (
                <CitizenCard 
                  key={citizen.id}
                  name={citizen.full_name}
                  slug={citizen.slug}
                  role={citizen.patrimonial_category}
                  era={citizen.patrimonial_category}
                  year={citizen.death_year ? citizen.death_year.toString() : undefined}
                  bio={citizen.biography}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-sm p-12 text-center border border-amber-900/10 rounded-xl max-w-2xl mx-auto shadow-sm">
              <p className="text-secondary font-serif italic text-xl mb-2">
                Digitalizando la memoria de Angol...
              </p>
              <p className="text-[10px] text-secondary/60 uppercase tracking-widest font-sans">
                El archivo patrimonial se actualiza en tiempo real
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
