import React from 'react';
import { ProposalRecord } from '@/lib/types/proposals';
import Link from 'next/link';

interface ActivityFeedProps {
  activities: ProposalRecord[];
}

/**
 * ActivityFeed: Registro visual de las últimas acciones administrativas.
 * Implementa manejo de estados vacíos y expansión de tipos (US-510).
 */
export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-surface/30 border border-dashed border-border rounded-2xl p-12 text-center">
        <p className="font-serif italic text-secondary text-sm">
          No hay actividad administrativa reciente para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const isApproved = activity.status === 'approved';
        const reviewerName = activity.expand?.reviewer?.email?.split('@')[0] || 'Admin';
        const targetName = activity.expand?.citizen?.full_name || 'Ciudadano';
        const targetSlug = activity.expand?.citizen?.slug;

        return (
          <div 
            key={activity.id}
            className="flex items-center justify-between p-4 bg-white border border-border/50 rounded-xl hover:border-gold/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                isApproved ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {isApproved ? '✓' : '✕'}
              </div>
              <div>
                <p className="text-sm font-sans text-primary leading-tight">
                  <span className="font-medium capitalize">{reviewerName}</span>
                  {' '}
                  <span className="text-secondary">
                    {isApproved ? 'aprobó' : 'rechazó'} un aporte para
                  </span>
                  {' '}
                  {targetSlug ? (
                    <Link 
                      href={`/memorial/${targetSlug}`}
                      className="font-medium hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                      {targetName}
                      <span className="text-[10px]">↗</span>
                    </Link>
                  ) : (
                    <span className="font-medium">{targetName}</span>
                  )}
                </p>
                <p className="text-[10px] text-secondary/60 font-sans uppercase tracking-widest mt-1">
                  {new Date(activity.reviewed_at || activity.updated).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-tighter font-bold border ${
                isApproved 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {isApproved ? 'Publicado' : 'Descartado'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
