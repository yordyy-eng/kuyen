import React from 'react';
import Image from 'next/image';
import PatrimonialArchive from '@/components/PatrimonialArchive';
import { listCitizens } from '@/lib/pb-server';

/**
 * Directorio Público de Ciudadanos — Modern Heritage Edition
 * Refactorización hacia una estética de museo minimalista.
 */
export const dynamic = 'force-dynamic';

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
        {/* 2. Patrimonial Archive (Hero & Grid Logic) */}
        <PatrimonialArchive initialCitizens={citizens} />

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
      </main>
    </div>
  );
}
