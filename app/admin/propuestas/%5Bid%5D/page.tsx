// app/admin/propuestas/[id]/page.tsx
// US-505: Sala de Revisión Quirúrgica.
// Interface de revisión lado a lado, edición de bio y selección de fotos.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProposalById, createAuthenticatedPB } from '@/lib/pb-server';
import BiographyDiff from '@/components/admin/review/BiographyDiff';
import PhotoReviewGrid from '@/components/admin/review/PhotoReviewGrid';
import ReviewModals from '@/components/admin/review/ReviewModals';
import { approveProposal, rejectProposal } from '@/app/actions/proposals';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revisión de Propuesta',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);

  if (!proposal) {
    notFound();
  }

  const citizen = proposal.expand?.citizen;
  const isPending = proposal.status === 'pending';

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Cabecera de Revisión */}
      <header className="px-8 py-6 border-b border-border bg-white sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/propuestas" 
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-stone-50 transition-all"
          >
            <span className="text-xl">←</span>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={proposal.status} />
              <span className="text-[10px] uppercase tracking-widest text-secondary/40 font-sans">
                ID: {proposal.id}
              </span>
            </div>
            <h1 className="text-2xl font-serif text-primary">
              Revisión: <span className="text-gold italic">{citizen?.full_name || 'Ciudadano'}</span>
            </h1>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-sans">Enviado por</p>
          <p className="font-sans text-sm font-bold text-primary">{proposal.contributor_name}</p>
          <p className="font-sans text-[10px] text-secondary/60">{proposal.contributor_email}</p>
        </div>
      </header>

      {/* Cuerpo de la Propuesta */}
      <div className="flex-1 overflow-auto bg-stone-50/30">
        <div className="max-w-5xl mx-auto py-12 px-6">
          
          <form id="review-form" action={approveProposal} className="space-y-12">
            <input type="hidden" name="proposalId" value={proposal.id} />
            <input type="hidden" name="citizenId" value={citizen?.id} />

            {/* 1. Comparativa de Biografía */}
            <section className="bg-white p-8 rounded-3xl border border-border shadow-sm">
              <BiographyDiff 
                currentBio={citizen?.biography || ''} 
                proposedBio={proposal.biography || ''} 
              />
            </section>

            {/* 2. Galería de Fotos */}
            <section className="bg-white p-8 rounded-3xl border border-border shadow-sm">
              <PhotoReviewGrid 
                proposalId={proposal.id} 
                photos={proposal.photos || []} 
              />
            </section>

            {/* 3. Información del Contribuyente (Read Only) */}
            <section className="bg-stone-100/50 p-6 rounded-2xl border border-dashed border-border">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary/60 mb-4 font-sans">
                Metadata de Contribución
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-secondary/40 uppercase font-sans">Relación con el ciudadano</p>
                  <p className="text-sm font-serif text-primary">{proposal.contributor_relation || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary/40 uppercase font-sans">Fecha de Envío</p>
                  <p className="text-sm font-serif text-primary">
                    {new Date(proposal.created).toLocaleDateString('es-CL', { 
                      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Modales y Controles finales */}
            {isPending ? (
              <ReviewModals 
                onApprove={() => {}} // El botón del modal triggerea el submit del form 'review-form'
                onReject={async (fd) => {
                  fd.set('proposalId', proposal.id);
                  await rejectProposal(fd);
                }}
                isApproveLoading={false}
                isRejectLoading={false}
              />
            ) : (
              <div className="p-8 border-2 border-border rounded-3xl text-center bg-white">
                <p className="text-sm text-secondary font-sans italic">
                  Esta propuesta ya fue procesada y no permite cambios adicionales.
                </p>
                {proposal.reviewer_note && (
                  <div className="mt-4 p-4 bg-stone-50 rounded-xl text-left border-l-4 border-secondary/20">
                    <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-1">Nota del Revisor</p>
                    <p className="text-sm font-sans text-secondary">{proposal.reviewer_note}</p>
                  </div>
                )}
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
