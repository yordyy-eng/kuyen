'use client';

import React, { useState, useMemo } from 'react';
import CitizenCard from './CitizenCard';
import { SITE_CONFIG } from '@/constants/site-config';

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
    <div className="space-y-16">
      {/* 1. Barrita de Búsqueda Minimalista */}
      <div className="max-w-2xl mx-auto relative group">
        <input 
          type="text" 
          placeholder={SITE_CONFIG.hero.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/60 backdrop-blur-sm border border-gold/20 rounded-xl px-6 py-5 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all shadow-sm placeholder:text-secondary/40"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform pointer-events-none grayscale opacity-30 group-focus-within:opacity-100 group-focus-within:grayscale-0">
          🔍
        </span>
        
        <div className="absolute -bottom-8 left-0 w-full text-center">
          <p className="text-[10px] uppercase tracking-widest text-secondary/50 font-medium">
            {searchTerm 
              ? SITE_CONFIG.hero.resultsText.replace('{count}', filteredCitizens.length.toString())
              : SITE_CONFIG.hero.exploreText}
          </p>
        </div>
      </div>

      {/* 2. Listado de Registros */}
      <div className="pt-8">
        {filteredCitizens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
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
          <div className="bg-white/40 backdrop-blur-sm p-16 text-center border border-gold/10 rounded-2xl max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
            <p className="text-secondary font-serif italic text-2xl mb-4">
              {SITE_CONFIG.hero.noResultsTitle.replace('{term}', searchTerm)}
            </p>
            <p className="text-xs text-secondary/60 uppercase tracking-widest font-sans">
              {SITE_CONFIG.hero.noResultsSubtitle}
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-10 px-6 py-2 border border-gold/30 text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-all rounded-full"
            >
              {SITE_CONFIG.hero.viewAllCta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
