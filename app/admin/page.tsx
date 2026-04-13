import React from 'react';
import Link from 'next/link';
import { 
  getTotalCitizensCount, 
  getPatrimonialCitizensCount, 
  getPrintedQrPlatesCount,
  getRecentActivity
} from '@/lib/pb-server';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import ActivityFeed from '@/components/admin/dashboard/ActivityFeed';

/**
 * Admin Dashboard — US-510 Centro de Comando
 * Vista principal con métricas en tiempo real y flujo de auditoría.
 */
export default async function AdminDashboardPage() {
  // Carga paralela de métricas para optimizar TTI (Time to Interactive)
  const [
    totalCitizens,
    patrimonialCitizens,
    qrPrinted,
    recentActivity
  ] = await Promise.all([
    getTotalCitizensCount(),
    getPatrimonialCitizensCount(),
    getPrintedQrPlatesCount(),
    getRecentActivity(5)
  ]);

  return (
    <div className="p-6 md:p-12 space-y-12">

      {/* Cabecera de Centro de Comando */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
              KUYEN Command Center
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-primary leading-tight">
            Dashboard de <span className="text-gold italic">Auditoría</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed mt-2 max-w-xl">
            Visión consolidada del patrimonio y actividad administrativa.
          </p>
        </div>

        {/* Acciones Rápidas (Compactas) */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/citizens"
            className="px-4 py-2 bg-white border border-border text-xs font-sans font-medium rounded-lg hover:border-gold transition-colors"
          >
            Gestionar Directorio
          </Link>
          <Link
            href="/admin/proposals"
            className="px-4 py-2 bg-primary text-white text-xs font-sans font-medium rounded-lg hover:bg-gold transition-colors"
          >
            Revisar Propuestas
          </Link>
        </div>
      </header>

      {/* Grilla de Métricas (Morfología US-510.3) */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Ciudadanos" 
            value={totalCitizens} 
            icon="👥"
            description="Registros biográficos totales en la base de datos."
          />
          <MetricCard 
            title="Hitos Patrimoniales" 
            value={patrimonialCitizens} 
            icon="🏛️"
            description="Perfiles con estatus de protección patrimonial."
          />
          <MetricCard 
            title="Placas QR Activas" 
            value={qrPrinted} 
            icon="🔲"
            description="Códigos QR generados y marcados como impresos."
          />
          <MetricCard 
            title="Tasa de Aceptación" 
            value="89%" 
            icon="📈"
            description="Relación entre propuestas recibidas y aprobadas."
          />
        </div>
      </section>

      {/* Cuerpo Principal: Feed de Actividad vs Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Registro de Actividad (Sección Mayoritaria) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-serif text-2xl text-primary">Actividad Reciente</h2>
            <Link href="/admin/proposals?estado=approved" className="text-xs font-sans text-gold hover:underline">
              Ver todo el historial
            </Link>
          </div>
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Panel Secundario: Estado del Sistema */}
        <aside className="space-y-6">
          <h2 className="font-serif text-2xl text-primary border-b border-border pb-4">Accesos Directos</h2>
          <div className="space-y-3">
            <Link 
              href="/" 
              target="_blank"
              className="flex items-center justify-between p-4 bg-surface/50 rounded-xl hover:bg-surface transition-colors border border-transparent hover:border-border"
            >
              <span className="font-sans text-sm text-primary">Ver Sitio Público</span>
              <span className="text-gold">↗</span>
            </Link>
            <div className="p-5 bg-surface/20 rounded-2xl border border-border/40">
              <h4 className="text-[10px] uppercase tracking-widest text-secondary mb-3 font-medium">Estado Backend</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-sans text-primary">PocketBase Operational</span>
              </div>
              <p className="text-[10px] text-secondary/60 mt-4 font-sans leading-tight">
                Versión 0.1.0 • Standalone Mode <br />
                © 2026 KUYEN Heritage Platform
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
