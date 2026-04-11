import React from 'react';
import Link from 'next/link';

/**
 * Página 404 Personalizada - Sistema KUYEN
 * Diseño minimalista y solemne para registros no encontrados.
 */
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Iconografía Sutil */}
      <div className="mb-8 opacity-20">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-primary"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      </div>

      {/* Título Serif */}
      <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4 leading-tight">
        Registro Patrimonial <span className="text-gold italic">No Encontrado</span>
      </h1>

      {/* Descripción Sans */}
      <p className="max-w-md text-secondary font-sans leading-relaxed mb-10">
        El código QR o el perfil que buscas no fue encontrado en el registro patrimonial. 
        Por favor, verifica el código o regresa al directorio general.
      </p>

      {/* Acción Principal */}
      <Link 
        href="/" 
        className="bg-primary text-white font-sans px-8 py-4 rounded-full transition-all hover:bg-stone-800 hover:shadow-lg active:scale-95"
      >
        Explorar Directorio
      </Link>

      {/* Footer del error */}
      <div className="mt-12 pt-8 border-t border-border w-24">
        <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-sans">
          Error 404
        </p>
      </div>
    </main>
  );
}
