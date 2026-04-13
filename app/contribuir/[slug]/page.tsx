import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCitizenBySlug } from '@/lib/pb-server';
import ContributionForm from '@/components/contribuir/ContributionForm';

export default async function ContribuirPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let citizen;
  try {
    citizen = await getCitizenBySlug(slug);
  } catch (error) {
    // Si no existe, next-navigation/notFound será lanzado por getCitizenBySlug,
    // o el Error será capturado aquí. Obligamos la redirección:
    redirect('/');
  }

  // Prevenir un caso borde donde el objeto no llega propiamente
  if (!citizen) {
    redirect('/');
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Navegación Superior */}
      <nav className="max-w-3xl mx-auto px-4 py-8">
        <Link 
          href={`/memorial/${slug}`}
          className="text-gold font-sans text-sm font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">←</span> Volver al memorial
        </Link>
      </nav>

      {/* Cabecera */}
      <header className="max-w-3xl mx-auto px-4 mb-10 text-center md:text-left">
        <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
            Archivo Abierto
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-4">
          Contribuir al legado de <br />
          <span className="text-gold italic">{citizen.full_name}</span>
        </h1>
        <p className="text-secondary font-sans leading-relaxed max-w-2xl mt-4">
          La memoria compartida enriquece nuestro patrimonio. Utiliza este formulario para aportar datos históricos, 
          fotografías relevantes o anécdotas que permitan completar el perfil biográfico.
        </p>
      </header>

      {/* Contenedor del Formulario (Client Component) */}
      <section className="max-w-3xl mx-auto px-4 relative z-10">
        <ContributionForm citizenId={citizen.id} slug={citizen.slug} />
      </section>
      
      {/* Elemento Decorativo */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-surface to-transparent pointer-events-none z-0"></div>
    </article>
  );
}
