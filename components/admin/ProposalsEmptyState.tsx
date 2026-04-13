// components/admin/ProposalsEmptyState.tsx
// Estado vacío contextual para la bandeja de moderación.

import type { ProposalStatus } from '@/lib/types/proposals';

interface Props {
  status: ProposalStatus | 'all';
}

const MESSAGES: Record<ProposalStatus | 'all', { title: string; description: string; icon: string }> = {
  pending: {
    title:       '¡Bandeja al día!',
    description: 'No hay propuestas pendientes de revisión en este momento.',
    icon:        '✨',
  },
  approved: {
    title:       'Sin propuestas aprobadas',
    description: 'Cuando apruebes contribuciones, aparecerán aquí para el historial.',
    icon:        '📋',
  },
  rejected: {
    title:       'Sin rechazos registrados',
    description: 'Las propuestas rechazadas se guardan aquí para referencia futura.',
    icon:        '⚪',
  },
  all: {
    title:       'Sin registros',
    description: 'Aún no se han recibido contribuciones ciudadanas en el sistema.',
    icon:        '📥',
  },
};

export function ProposalsEmptyState({ status }: Props) {
  const { title, description, icon } = MESSAGES[status] || MESSAGES.all;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-surface/20 border border-dashed border-border rounded-3xl m-6">
      <div className="text-5xl mb-6 opacity-40">{icon}</div>
      <h2 className="font-serif text-2xl text-primary mb-2 line-height-tight">
        {title}
      </h2>
      <p className="font-sans text-sm text-secondary/60 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
