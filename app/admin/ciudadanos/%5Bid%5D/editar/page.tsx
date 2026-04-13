// app/admin/ciudadanos/[id]/editar/page.tsx
import { notFound } from 'next/navigation';
import EditCitizenForm from '@/components/admin/EditCitizenForm';
import Link from 'next/link';
import { createAuthenticatedPB, getQrByCitizenId } from '@/lib/pb-server';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCitizen(id: string) {
  const pb = await createAuthenticatedPB();
  try {
    return await pb.collection('citizens').getOne(id);
  } catch (e) {
    return null;
  }
}

export default async function EditCitizenPage({ params }: PageProps) {
  const { id } = await params;
  const [citizen, qrRecord] = await Promise.all([
    getCitizen(id),
    getQrByCitizenId(id)
  ]);

  if (!citizen) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="px-8 py-6 border-b border-border bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/ciudadanos" 
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-stone-50 transition-all"
          >
            <span className="text-xl">←</span>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-primary">Editar Ciudadano</h1>
            <p className="text-secondary/60 text-sm font-sans italic">Modificando perfil de {citizen.full_name}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-stone-50/20">
        <div className="max-w-4xl mx-auto py-12 px-8 bg-white border-x border-border min-h-full shadow-sm">
          <EditCitizenForm citizen={citizen} qrRecord={qrRecord} />
        </div>
      </div>
    </div>
  );
}
