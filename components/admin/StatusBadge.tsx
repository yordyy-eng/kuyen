// components/admin/StatusBadge.tsx
// Badge semántico de estado para las propuestas de crowdsourcing.
// Adaptado para Light Mode con contraste accesible.

import { STATUS_META, type ProposalStatus } from '@/lib/types/proposals';

interface Props {
  status:    ProposalStatus;
  className?: string;
  size?:     'sm' | 'md';
}

export function StatusBadge({ status, className = '', size = 'sm' }: Props) {
  const meta = STATUS_META[status];

  // Si por alguna razón el estado no existe en el mapa (aunque esté tipado)
  if (!meta) return null;

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-3 py-1';

  return (
    <span
      role="status"
      aria-label={`Estado: ${meta.label}`}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-serif font-semibold
        border whitespace-nowrap select-none tracking-wide uppercase
        ${sizeClasses} ${className}
      `}
      style={{
        color:           meta.color,
        backgroundColor: meta.bg,
        borderColor:     meta.border,
      }}
    >
      {/* Indicador visual (punto de color) */}
      <span
        aria-hidden
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}
