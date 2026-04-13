// components/admin/ProposalRow.tsx
// Fila de la bandeja de moderación (Server Component).

import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { getPocketBaseFileUrl, getPBImageUrl } from '@/lib/pb-server';
import type { ProposalRecord } from '@/lib/types/proposals';

interface Props {
  proposal: ProposalRecord;
}

// Formatea la fecha de creación de forma legible (es-CL).
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-CL', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function ProposalRow({ proposal }: Props) {
  const citizen = proposal.expand?.citizen;
  const imageUrl = citizen ? getPBImageUrl(citizen) : null;
  const isPending = proposal.status === 'pending';

  return (
    <Link
      href={`/admin/propuestas/${proposal.id}`}
      className={`
        group flex items-center gap-4 px-6 py-5 transition-all duration-200
        border-b border-border last:border-b-0
        hover:bg-amber-50/50
        ${isPending ? 'bg-white' : 'bg-surface/30'}
      `}
    >
      {/* Indicador de "Pendiente" */}
      <div className="flex-shrink-0 w-2 h-2 rounded-full transition-all">
        {isPending && (
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        )}
      </div>

      {/* Avatar del Ciudadano */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={citizen?.full_name || 'Ciudadano'}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
            />
          ) : (
            <span className="text-secondary font-serif font-bold text-sm">
              {citizen?.full_name?.charAt(0) || '?'}
            </span>
          )}
        </div>
      </div>

      {/* Información principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-serif truncate ${isPending ? 'font-bold text-primary' : 'text-secondary'}`}>
            {citizen?.full_name || 'Ciudadano desconocido'}
            {citizen?.sector && (
              <span className="ml-2 text-[10px] text-secondary/50 font-sans uppercase tracking-widest font-normal">
                · {citizen.sector}
              </span>
            )}
          </h3>
          <StatusBadge status={proposal.status} />
        </div>

        <p className="text-xs text-secondary font-sans truncate mb-2">
          <span className="font-medium text-primary">{proposal.contributor_name}</span>
          <span className="mx-1 text-border">|</span>
          <span className="text-secondary/60 italic">{proposal.contributor_email}</span>
        </p>

        <div className="flex items-center gap-4">
          <time className="text-[10px] uppercase tracking-wider text-secondary/40 font-sans">
            {formatDate(proposal.created)}
          </time>
          
          {/* Indicadores de adjuntos */}
          <div className="flex items-center gap-2">
            {proposal.photos?.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gold font-sans font-medium">
                🖼️ {proposal.photos.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flecha indicadora */}
      <div className="text-border group-hover:text-gold transition-colors ml-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
