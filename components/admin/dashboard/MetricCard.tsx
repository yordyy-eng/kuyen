import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: string;
  description?: string;
}

/**
 * MetricCard: Visualización solemne de métricas para el dashboard.
 */
export default function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-secondary/70">
            {title}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-serif text-primary group-hover:text-gold transition-colors">
              {value}
            </span>
          </div>
        </div>
        {icon && (
          <span className="text-2xl bg-surface p-2 rounded-xl grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">
            {icon}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-secondary font-sans leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
