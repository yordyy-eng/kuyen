// app/admin/ciudadanos/page.tsx
import Link from 'next/link';
import { createAuthenticatedPB } from '@/lib/pb-server';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directorio de Ciudadanos | Admin',
};

async function getCitizens() {
  const pb = await createAuthenticatedPB();
  // Traemos todos para el gestor, ordenados por nombre
  return await pb.collection('citizens').getFullList({
    sort: 'full_name',
  });
}

export default async function CitizensAdminPage() {
  const citizens = await getCitizens();

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-8 py-6 border-b border-border bg-white sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-primary">Gestión de Ciudadanos</h1>
          <p className="text-secondary/60 text-sm font-sans italic">Control central del repositorio patrimonial.</p>
        </div>
        <Link 
          href="/admin/ciudadanos/nuevo" 
          className="px-6 py-2 bg-gold text-primary font-sans font-bold rounded-xl hover:shadow-lg transition-all text-sm"
        >
          + Nuevo Ciudadano
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-8 bg-stone-50/30">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 border-b border-border">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Ciudadano</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Categoría</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Estado</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Patrimonial</th>
                <th className="px-6 py-4 text-center text-[10px] uppercase tracking-widest text-secondary font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {citizens.map((citizen) => (
                <tr key={citizen.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-border shrink-0">
                        {citizen.portrait && (
                          <img 
                            src={`http://localhost:8091/api/files/citizens/${citizen.id}/${citizen.portrait}?thumb=100x100`} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-sm font-bold text-primary leading-tight">{citizen.full_name}</p>
                        <p className="text-[10px] text-secondary/50 font-sans tracking-tight">{citizen.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-sans text-secondary bg-stone-100 px-2 py-1 rounded-md border border-border/50">
                      {citizen.patrimonial_category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${citizen.published ? 'bg-green-500' : 'bg-stone-300'}`} />
                      <span className="text-xs font-sans text-primary">
                        {citizen.published ? 'Público' : 'Borrador'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {citizen.is_patrimonial && (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-sans font-bold rounded-lg border border-amber-200">
                        Patrimonial
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/admin/ciudadanos/${citizen.id}/editar`}
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-border rounded-lg text-xs font-sans font-bold text-secondary hover:border-gold hover:text-primary transition-all shadow-sm"
                    >
                      <span>✏️</span> Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {citizens.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-secondary/40 font-serif italic">No hay ciudadanos registrados en el directorio.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
