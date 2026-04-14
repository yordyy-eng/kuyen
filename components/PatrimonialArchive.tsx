'use client';

import React, { useState, useMemo } from 'react';
import CitizenCard from './CitizenCard';

interface CitizenRecord {
  id: string;
  full_name: string;
  slug: string;
  patrimonial_category: string;
  biography: string;
  death_year?: number;
}

interface PatrimonialArchiveProps {
  initialCitizens: CitizenRecord[];
}

export default function PatrimonialArchive({ initialCitizens }: PatrimonialArchiveProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCitizens = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return initialCitizens;

    return initialCitizens.filter((citizen) => 
      citizen.full_name.toLowerCase().includes(term) ||
      citizen.biography.toLowerCase().includes(term)
    );
  }, [searchTerm, initialCitizens]);

  return (
    <>
      {/* 1. Hero Search Section (Parte Dinámica) */}
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

          {/* Búsqueda Minimalista Reactiva */}
          <div className="max-w-lg mx-auto relative group">
            <input 
              type="text" 
              placeholder="Buscar por nombre o apellido..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/60 border border-amber-900/20 rounded-lg px-5 py-4 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/30 transition-all placeholder:text-secondary/50 placeholder:italic"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-gold/60 transition-colors pointer-events-none">
              🔎
            </span>
          </div>

          <div className="mt-8 text-secondary/70 font-sans text-xs uppercase tracking-widest">
            {searchTerm ? (
              <span>Encontrados: {filteredCitizens.length} registros</span>
            ) : (
              <span>Explora la memoria colectiva de Angol</span>
            )}
          </div>
        </div>
      </section>

      {/* 2. Citizens List Result (Parte Dinámica) */}
      <section className="container mx-auto px-4 py-24 min-h-[400px]">
        <div className="mb-12">
          <h2 className="text-3xl font-serif text-primary border-b border-gold/20 pb-4 inline-block">
            Registros <span className="italic text-gold">Patrimoniales</span>
          </h2>
        </div>

        {filteredCitizens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 transition-all duration-500">
            {filteredCitizens.map((citizen) => (
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
          <div className="bg-white/40 backdrop-blur-sm p-12 text-center border border-amber-900/10 rounded-xl max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
            <p className="text-secondary font-serif italic text-xl mb-2">
              Ningún registro coincide con "{searchTerm}" en nuestros archivos históricos.
            </p>
            <p className="text-[10px] text-secondary/60 uppercase tracking-widest font-sans mt-4">
              Intenta con un nombre diferente o navega por los registros destacados
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-gold font-sans text-xs uppercase tracking-widest hover:underline"
            >
              Ver todos los registros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
