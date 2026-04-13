'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createAuthenticatedPB, PB_URL } from '@/lib/pb-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-constants';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

// Zod schemas
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const proposalSchema = z.object({
  citizen: z.string().min(1, 'El ID de ciudadano es requerido.'),
  contributor_name: z.string().min(2, 'El nombre debe ser válido.').max(100),
  contributor_email: z.string().email('Ingresa un correo electrónico válido.'),
  biography: z.string().min(10, 'La biografía debe ser más extensa.').max(5000, 'El texto excede el límite permitido.'),
});

const rejectionSchema = z.object({
  reviewer_note: z.string().min(10, 'El motivo del rechazo debe tener al menos 10 caracteres.'),
});

// ── US-501: Público — Enviar Propuesta ──────────────────────────────────────

export async function submitProposal(prevState: any, formData: FormData) {
  // ── US-509: Protección Anti-Spam (Rate Limiting) ──
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  
  // Extraemos la IP real (la primera en la lista si hay proxies)
  const clientIp = forwardedFor 
    ? forwardedFor.split(',')[0].trim() 
    : '127.0.0.1';

  const limitCheck = checkRateLimit(clientIp);

  if (!limitCheck.success) {
    return { 
      success: false, 
      error: `Límite de envíos excedido. Por seguridad, intenta de nuevo en ${limitCheck.retryAfterMinutes} minutos.` 
    };
  }

  try {
    const rawData = {
      citizen: formData.get('citizen') as string,
      contributor_name: formData.get('contributor_name') as string,
      contributor_email: formData.get('contributor_email') as string,
      biography: formData.get('biography') as string,
    };

    const validatedFields = proposalSchema.safeParse(rawData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0]?.message };
    }

    // Validación de archivos en el lado servidor
    const photos = formData.getAll('photos');
    for (const file of photos) {
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) return { success: false, error: 'Fotos máx 5MB.' };
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return { success: false, error: 'Formato inválido.' };
      }
    }

    formData.set('status', 'pending');

    const res = await fetch(`${PB_URL}/api/collections/proposals/records`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('PB Post Failed');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error de servidor.' };
  }
}

// ── US-505: Admin — Aprobar Propuesta ───────────────────────────────────────

export async function approveProposal(formData: FormData) {
  // Hardening: Verificación de sesión admin
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE_NAME)) {
    throw new Error('No autorizado.');
  }

  const pb = await createAuthenticatedPB();
  const proposalId = formData.get('proposalId') as string;
  const citizenId = formData.get('citizenId') as string;
  const finalBio = formData.get('final_biography') as string;
  const approvedPhotos = formData.getAll('approved_photos') as string[];

  if (!proposalId || !citizenId) throw new Error('IDs faltantes');

  try {
    // 1. Obtener la propuesta para acceder a los archivos originales
    const proposal = await pb.collection('proposals').getOne(proposalId);
    
    // 2. Preparar el Ciudadano para el update
    const citizenUpdate = new FormData();
    // Sanitización básica (Next.js 16/React ya escapa en render, pero limpiamos tags peligrosos)
    citizenUpdate.set('biography', finalBio.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, ""));

    // 3. Transferencia de Fotos: Proposals -> Citizens
    // PocketBase requiere los archivos reales para moverlos entre colecciones.
    for (const filename of approvedPhotos) {
      const fileUrl = `${PB_URL}/api/files/proposals/${proposalId}/${filename}`;
      const response = await fetch(fileUrl);
      if (response.ok) {
        const blob = await response.blob();
        citizenUpdate.append('gallery', blob, filename);
      }
    }

    // 4. Ejecutar cambios en el Ciudadano
    await pb.collection('citizens').update(citizenId, citizenUpdate);

    // 5. Marcar Propuesta como Aprobada
    await pb.collection('proposals').update(proposalId, {
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewer: pb.authStore.model?.id,
      reviewer_note: 'Aprobada por el administrador.',
    });

    // 6. Invalidación de Caché Purga Quirúrgica
    const citizen = await pb.collection('citizens').getOne(citizenId);
    revalidatePath(`/memorial/${citizen.slug}`);
    revalidatePath('/');
    
  } catch (error) {
    console.error('[Security Audit] Approve Proposal failed');
    throw new Error('No se pudo procesar la aprobación.');
  }

  redirect('/admin/propuestas?estado=approved');
}

// ── US-505: Admin — Rechazar Propuesta ──────────────────────────────────────

export async function rejectProposal(formData: FormData) {
  // Hardening: Verificación de sesión admin
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE_NAME)) {
    throw new Error('No autorizado.');
  }

  const pb = await createAuthenticatedPB();
  const proposalId = formData.get('proposalId') as string;
  const reviewerNote = formData.get('reviewer_note') as string;

  const valid = rejectionSchema.safeParse({ reviewer_note: reviewerNote });
  if (!valid.success) {
    throw new Error(valid.error.issues[0]?.message);
  }

  try {
    await pb.collection('proposals').update(proposalId, {
      status: 'rejected',
      reviewer_note: reviewerNote,
      reviewed_at: new Date().toISOString(),
      reviewer: pb.authStore.model?.id,
    });
  } catch (error) {
    throw new Error('Error al rechazar propuesta.');
  }

  redirect('/admin/propuestas?estado=rejected');
}
