import React from 'react';
import CreateCitizenForm from '@/components/admin/CreateCitizenForm';
import Link from 'next/link';

export default function NewCitizenPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary/40">
          <Link href="/admin/dashboard" className="hover:text-primary transition-all">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/ciudadanos" className="hover:text-primary transition-all">Ciudadanos</Link>
          <span>/</span>
          <span className="text-primary">Nuevo Registro</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-primary">Nuevo Ciudadano</h1>
            <p className="text-secondary/60 mt-2 font-sans italic max-w-xl">
              Crea un nuevo registro patrimonial. El sistema generará automáticamente los metadatos SEO.
            </p>
          </div>
          <Link 
            href="/admin/ciudadanos"
            className="text-xs font-bold font-sans text-secondary/60 hover:text-primary flex items-center gap-2 transition-all"
          >
            <span>←</span> Cancelar y Volver
          </Link>
        </header>

        {/* Form Container */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <CreateCitizenForm />
        </div>
      </div>
    </div>
  );
}
