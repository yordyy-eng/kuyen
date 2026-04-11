import React from 'react';
import CitizenCard from '@/components/CitizenCard';
import { listCitizens } from '@/lib/pb-server';

/**
 * Directorio Público de Ciudadanos
 * Esta versión utiliza React Server Components para un fetching de alto rendimiento
 * y optimización de SEO, integrándose directamente con PocketBase.
 */
export default async function Home() {
  const citizens = await listCitizens();

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Cabecera de Sección */}
      <section className="mb-16 text-center lg:text-left">
        <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
            Archivo Vivo
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
          Anglinos que hicieron <span className="text-gold italic">historia</span>
        </h2>
        <p className="mt-4 text-secondary max-w-2xl font-sans leading-relaxed text-sm md:text-base">
          Explora la memoria de los hombres y mujeres que dieron forma a nuestra identidad ciudadana. 
          Cada piedra y cada nombre cuenta una parte del alma de Angol.
        </p>
      </section>

      {/* Grid Responsivo Dinámico */}
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
        /* Estado vacío / Error sutil */
        <div className="bg-surface p-12 text-center border border-dashed border-border rounded-lg max-w-4xl mx-auto">
          <p className="text-secondary font-serif italic text-lg">
            Registros en proceso de digitalización...
          </p>
          <p className="text-xs text-secondary/60 mt-2 uppercase tracking-widest font-sans">
            La memoria patrimonial está siendo actualizada
          </p>
        </div>
      )}
    </main>
  );
}
