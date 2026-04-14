import React from 'react';
import Image from 'next/image';
import PatrimonialArchive from '@/components/PatrimonialArchive';
import { listCitizens } from "@/lib/pb-server";
import { SITE_CONFIG } from "@/constants/site-config";

/**
 * Directorio Público de Ciudadanos — Modern Heritage Edition
 */
export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialCitizens = await listCitizens();

  return (
    <main className="relative min-h-screen bg-[#f8f4ef]">
      {/* 1. Background Watermark Map */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-screen">
        <Image 
          src="/assets/map_watermark.png" 
          alt="Mapa Histórico de Angol" 
          fill
          className="object-cover opacity-[0.07] mix-blend-multiply"
          priority
        />
      </div>

      <div className="relative z-10 px-4">
        {/* 2. Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gold/10 border border-gold/20">
              <span className="text-gold font-sans text-[10px] uppercase tracking-widest font-medium">
                {SITE_CONFIG.hero.badge}
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif text-primary mb-6 tracking-tight">
              {SITE_CONFIG.hero.title} <span className="text-gold italic font-light">{SITE_CONFIG.hero.titleGold}</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-sans text-secondary max-w-2xl mx-auto leading-relaxed font-light italic opacity-80">
              &ldquo;{SITE_CONFIG.hero.exploreText}&rdquo;
            </p>
          </div>
        </section>

        {/* 3. Dynamic Archive Section */}
        <div className="max-w-7xl mx-auto pb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border/60"></div>
            <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] text-secondary/60 font-semibold">
              {SITE_CONFIG.gallery.sectionTitle} <span className="text-gold">{SITE_CONFIG.gallery.sectionTitleGold}</span>
            </h2>
            <div className="h-px flex-1 bg-border/60"></div>
          </div>
          
          <PatrimonialArchive initialCitizens={initialCitizens} />
        </div>

        {/* 4. Historical Portraits Section (The Genius Hover Section) */}
        <section className="py-24 border-t border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end justify-items-center opacity-80 decoration-gold/30 underline-offset-8">
              
              {/* Pedro de Oña */}
              <div className="flex flex-col items-center gap-6 group">
                <div className="relative w-44 h-60 overflow-hidden rounded-sm grayscale-[.80] sepia-[.40] mix-blend-multiply shadow-2xl ring-1 ring-gold/10 transition-all duration-1000 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.02] group-hover:ring-gold/30">
                  <Image 
                    src="/assets/ona_portrait.png" 
                    alt="Pedro de Oña" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="font-serif italic text-primary text-lg block tracking-wide">Pedro de Oña</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold mt-1 block font-sans">Poeta Angolino</span>
                </div>
              </div>

              {/* Cornelio Saavedra */}
              <div className="flex flex-col items-center gap-6 group mb-12 md:mb-0 scale-110">
                <div className="relative w-52 h-72 overflow-hidden rounded-sm grayscale-[.80] sepia-[.40] mix-blend-multiply shadow-2xl ring-1 ring-gold/10 transition-all duration-1000 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.02] group-hover:ring-gold/30">
                  <Image 
                    src="/assets/saavedra_portrait.png" 
                    alt="Cornelio Saavedra" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="font-serif italic text-primary text-xl block tracking-wide">C. Saavedra</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold mt-1 block font-sans">Fundador de Angol</span>
                </div>
              </div>

              {/* Botánica Illustration */}
              <div className="flex flex-col items-center gap-6 group">
                <div className="relative w-44 h-60 overflow-hidden rounded-sm grayscale-[.80] sepia-[.40] mix-blend-multiply shadow-2xl ring-1 ring-gold/10 transition-all duration-1000 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.02] group-hover:ring-gold/30">
                  <Image 
                    src="/assets/botanica_illustration.png" 
                    alt="Botánica del Cementerio" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="font-serif italic text-primary text-lg block tracking-wide">Flora Sacra</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold mt-1 block font-sans">Patrimonio Natural</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
