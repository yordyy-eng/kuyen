// app/admin/propuestas/page.tsx
// Bandeja de moderación de propuestas ciudadanas.
// US-504: Listado con filtros y paginación (Server Component).

import { Suspense } from 'react';
import { listProposals } from '@/lib/pb-server';
import { ProposalRow } from '@/components/admin/ProposalRow';
import { ProposalsFilterTabs } from '@/components/admin/ProposalsFilterTabs';
import { ProposalsEmptyState } from '@/components/admin/ProposalsEmptyState';
import type { Metadata } from 'next';
import type { ProposalStatus } from '@/lib/types/proposals';

export const metadata: Metadata = {
  title: 'Bandeja de Moderación',
};

interface PageProps {
  searchParams: Promise<{
    estado?: string;
    pagina?: string;
  }>;
}

const VALID_STATUSES = new Set<ProposalStatus>(['pending', 'approved', 'rejected']);

function parseStatus(raw?: string): ProposalStatus | 'all' {
  if (!raw || raw === 'all') return 'all';
  return VALID_STATUSES.has(raw as ProposalStatus) ? (raw as ProposalStatus) : 'all';
}

function parsePage(raw?: string): number {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function PropuestasPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentStatus = parseStatus(resolvedParams.estado);
  const currentPage = parsePage(resolvedParams.pagina);

  /**
   * 6 Fetches en paralelo para obtener:
   * 1. Propuestas filtradas
   * 2. Conteos para los badges de las pestañas
   */
  const [
    { items: proposals, totalItems, totalPages },
    pendingCount,
    approvedCount,
    rejectedCount,
    allCount
  ] = await Promise.all([
    listProposals({ status: currentStatus, page: currentPage, perPage: 25 }),
    listProposals({ status: 'pending', page: 1, perPage: 1 }).then(r => r.totalItems),
    listProposals({ status: 'approved', page: 1, perPage: 1 }).then(r => r.totalItems),
    listProposals({ status: 'rejected', page: 1, perPage: 1 }).then(r => r.totalItems),
    listProposals({ status: 'all', page: 1, perPage: 1 }).then(r => r.totalItems),
  ]);

  const counts = {
    pendingCount,
    approvedCount,
    rejectedCount,
    allCount,
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Cabecera de la sección */}
      <header className="px-8 py-8 border-b border-border bg-white sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
                Moderación
              </span>
            </div>
            <h1 className="text-4xl font-serif text-primary">
              Propuestas <span className="text-gold italic font-light">Ciudadanas</span>
            </h1>
            <p className="text-sm text-secondary font-sans mt-2 max-w-xl">
              Gestione las contribuciones recibidas. Revise la veracidad de la información antes de integrarla al perfil oficial.
            </p>
          </div>

          <ProposalsFilterTabs currentStatus={currentStatus} counts={counts} />
        </div>
      </header>

      {/* Lista de registros */}
      <section className="flex-1 overflow-auto bg-surface/5">
        {proposals.length === 0 ? (
          <ProposalsEmptyState status={currentStatus} />
        ) : (
          <div className="max-w-6xl mx-auto py-6 px-4">
            <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
              <ul className="divide-y divide-border">
                {proposals.map(proposal => (
                  <li key={proposal.id}>
                    <ProposalRow proposal={proposal} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between px-2">
                <p className="text-xs text-secondary font-sans uppercase tracking-widest">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <PaginationLink 
                    page={currentPage - 1} 
                    currentStatus={currentStatus} 
                    disabled={currentPage <= 1}
                    label="Anterior"
                  />
                  <PaginationLink 
                    page={currentPage + 1} 
                    currentStatus={currentStatus} 
                    disabled={currentPage >= totalPages}
                    label="Siguiente"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// Sub-componente simple para paginación (Server Side)
function PaginationLink({ page, currentStatus, disabled, label }: { page: number; currentStatus: string; disabled: boolean; label: string }) {
  if (disabled) {
    return (
      <span className="px-4 py-2 border border-border rounded-lg text-xs font-sans font-medium text-secondary/30 cursor-not-allowed">
        {label}
      </span>
    );
  }

  const params = new URLSearchParams();
  if (currentStatus !== 'all') params.set('estado', currentStatus);
  if (page > 1) params.set('pagina', page.toString());
  const href = `/admin/propuestas?${params.toString()}`;

  return (
    <a href={href} className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-sans font-medium text-primary hover:border-gold hover:text-gold transition-all">
      {label}
    </a>
  );
}
