import { notFound } from 'next/navigation';
import { getCitizenById, getQrByCitizenId } from '@/lib/pb-server';
import PrintPlateView from '@/components/admin/PrintPlateView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintCitizenPage({ params }: PageProps) {
  const { id } = await params;
  
  const [citizen, qrRecord] = await Promise.all([
    getCitizenById(id),
    getQrByCitizenId(id)
  ]);

  if (!citizen || !qrRecord) {
    notFound();
  }

  return (
    <PrintPlateView 
      citizen={{
        full_name: citizen.full_name,
        biography: citizen.biography,
        slug: citizen.slug
      }} 
      qrCode={qrRecord.code} 
    />
  );
}
