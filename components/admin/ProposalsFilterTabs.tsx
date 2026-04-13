// components/admin/ProposalsFilterTabs.tsx
// Tabs de filtro con sincronización de URL via searchParams.
// Client Component para manejo de navegación y feedback visual.

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { ProposalStatus } from '@/lib/types/proposals';

type FilterValue = ProposalStatus | 'all';

interface TabConfig {
  value:  FilterValue;
  label:  string;
  count?: number;
}

interface Props {
  currentStatus: FilterValue;
  counts: {
    allCount:     number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
}

export function ProposalsFilterTabs({ currentStatus, counts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tabs: TabConfig[] = [
    { value: 'pending',  label: 'Pendientes',  count: counts.pendingCount },
    { value: 'approved', label: 'Aprobadas',   count: counts.approvedCount },
    { value: 'rejected', label: 'Rechazadas',  count: counts.rejectedCount },
    { value: 'all',      label: 'Todas',       count: counts.allCount },
  ];

  function handleTabChange(value: FilterValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('estado');
    } else {
      params.set('estado', value);
    }
    // Resetear a la primera página al cambiar el filtro
    params.delete('pagina');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div
      role="tablist"
      aria-label="Filtrar propuestas por estado"
      className="flex gap-1 p-1 bg-surface border border-border rounded-xl w-full sm:w-auto overflow-x-auto"
    >
      {tabs.map(tab => {
        const isActive = currentStatus === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabChange(tab.value)}
            disabled={isPending}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-medium
              whitespace-nowrap transition-all duration-200
              ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary hover:text-primary hover:bg-amber-50'
              }
              ${isPending ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 
                  rounded-full text-[10px] font-bold border
                  ${isActive 
                    ? 'bg-white/20 border-white/30 text-white' 
                    : 'bg-surface border-border text-secondary/60'
                  }
                `}
              >
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
