'use client';

import React, { useState } from 'react';
import { exportIneData } from '@/app/actions/reports';

/**
 * US-511: Botón de Exportación INE
 * Componente cliente para manejar la descarga de archivos CSV.
 */
export default function ExportIneButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const result = await exportIneData();
      
      if (!result.success || !result.csv) {
        alert(result.error || 'Error al exportar datos.');
        return;
      }

      // Crear Blob y descargar
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `kuyen_reporte_ine_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Error crítico durante la descarga.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isExporting}
      className="px-4 py-2 bg-stone-900 text-white text-xs font-sans font-medium rounded-lg hover:bg-gold transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          📊 Exportar Reporte INE (CSV)
        </>
      )}
    </button>
  );
}
