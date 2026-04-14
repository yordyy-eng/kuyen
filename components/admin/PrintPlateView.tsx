'use client';

import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SITE_CONFIG } from '@/constants/site-config';

interface PrintPlateViewProps {
  citizen: {
    full_name: string;
    biography: string;
    slug: string;
  };
  qrCode: string;
}

export default function PrintPlateView({ citizen, qrCode }: PrintPlateViewProps) {
  // El link que el ciudadano escaneará
  const scanUrl = `${window.location.protocol}//${window.location.host}/ciudadanos/${citizen.slug}`;

  // Auto-activar diálogo de impresión
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-12 flex flex-col items-center justify-center print:p-0">
      
      {/* Botón Flotante (Desaparece en impresión) */}
      <div className="fixed top-8 right-8 print:hidden flex gap-4">
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-primary text-white font-sans font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          🖨️ Imprimir Ahora
        </button>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-stone-100 text-primary font-sans font-bold rounded-xl border border-border hover:bg-stone-200 transition-all"
        >
          Volver
        </button>
      </div>

      {/* La Placa Patrimonial (Diseño Físico) */}
      <div className="w-[12cm] h-[18cm] border-[3px] border-primary p-8 flex flex-col items-center text-center relative bg-white shadow-2xl print:shadow-none print:border-[2px]">
        
        {/* Esquinas Decorativas */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold" />

        {/* Encabezado Institucional */}
        <div className="mb-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-secondary/60 mb-1">{SITE_CONFIG.footer.organization}</p>
          <h2 className="font-serif text-2xl text-primary tracking-tighter">RUTA PATRIMONIAL</h2>
        </div>

        {/* Nombre del Prócer */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="h-px w-20 bg-gold/40 mx-auto" />
          <h1 className="font-serif text-4xl text-primary leading-tight px-4">{citizen.full_name}</h1>
          <div className="h-px w-20 bg-gold/40 mx-auto" />
          
          <p className="font-sans italic text-sm text-secondary/70 leading-relaxed px-6 max-h-32 overflow-hidden text-ellipsis">
            {citizen.biography.length > 150 
              ? `${citizen.biography.substring(0, 150)}...` 
              : citizen.biography}
          </p>
        </div>

        {/* Bloque QR */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
            <QRCodeSVG 
              value={scanUrl} 
              size={120}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/logo.png", // Asumiendo que hay un logo, si no, se ignora
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <div className="space-y-1">
            <p className="font-sans text-[9px] uppercase tracking-widest text-primary font-bold">Escanea para conocer su historia</p>
            <p className="font-sans text-[8px] text-secondary/60 italic">{scanUrl}</p>
          </div>
        </div>

        {/* Footer de la Placa */}
        <div className="mt-12 pt-4 border-t border-gold/20 w-full">
          <p className="font-serif italic text-xs text-gold">Proyecto KUYEN • Memoria Viva de Angol</p>
        </div>

      </div>

      <p className="mt-8 text-secondary/40 font-sans text-[10px] uppercase tracking-widest print:hidden">
        Diseño optimizado para placa de 12cm x 18cm • Escala 1:1
      </p>
    </div>
  );
}
