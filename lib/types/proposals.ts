// lib/types/proposals.ts
// Tipos compartidos para el módulo de propuestas ciudadanas.
// Ajustado para coincidir con el esquema real de PocketBase (citizen vs target_citizen).

export type ProposalStatus =
  | 'pending'
  | 'approved'
  | 'rejected';
  // Nota: 'needs_review' no está en el esquema actual de PB, se omite por ahora para evitar errores de API.

export interface CitizenExpand {
  id:         string;
  full_name:  string;
  slug:       string;
  portrait:   string;
  sector:     string;
  plot_number:string;
}

export interface ReviewerExpand {
  id:   string;
  name: string;
}

export interface ProposalRecord {
  id:                   string;
  contributor_name:     string;
  contributor_email:    string;
  contributor_relation?: string; // Opcional si no está en el esquema
  biography:            string;
  photos:               string[];
  status:               ProposalStatus;
  reviewer_note?:       string;
  reviewed_at?:         string;
  created:              string;
  updated:              string;
  // Relaciones sin expand
  citizen:              string;
  reviewer?:            string;
  // Relaciones expandidas
  expand?: {
    citizen?: CitizenExpand;
    reviewer?: ReviewerExpand;
  };
}

export interface ListProposalsResult {
  items:       ProposalRecord[];
  totalItems:  number;
  totalPages:  number;
  page:        number;
  perPage:     number;
}

export interface ListProposalsParams {
  status?:  ProposalStatus | 'all';
  page?:    number;
  perPage?: number;
}

// Mapa canónico de labels y colores por estado (WCAG AA compliant)
export const STATUS_META: Record<
  ProposalStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label:  'Pendiente',
    color:  '#92400e', // Amber 800
    bg:     '#fef9c3', // Amber 100
    border: '#fde047', // Amber 300
  },
  approved: {
    label:  'Aprobada',
    color:  '#166534', // Green 800
    bg:     '#f0fdf4', // Green 50
    border: '#86efac', // Green 300
  },
  rejected: {
    label:  'Rechazada',
    color:  '#991b1b', // Red 800
    bg:     '#fef2f2', // Red 50
    border: '#fca5a5', // Red 300
  },
};
