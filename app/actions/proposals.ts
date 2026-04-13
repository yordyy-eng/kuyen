'use server';

import { POCKETBASE_API_URL } from '@/lib/pb-server';

export async function submitProposal(prevState: any, formData: FormData) {
  try {
    // Asegurar el estado inicial
    formData.set('status', 'pending');

    const res = await fetch(`${POCKETBASE_API_URL}/api/collections/proposals/records`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('PocketBase proposal error:', errorData);
      return { success: false, error: 'Hubo un error al enviar la información. Revisa los datos e intenta de nuevo.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Proposal submission failed:', error);
    return { success: false, error: 'Error de conexión. Inténtalo de nuevo más tarde.' };
  }
}
