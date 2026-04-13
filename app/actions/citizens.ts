'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createAuthenticatedPB, PB_URL } from '@/lib/pb-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-constants';

const citizenUpdateSchema = z.object({
  id: z.string().min(1),
  full_name: z.string().min(2, 'El nombre es obligatorio.').max(100),
  patrimonial_category: z.string().min(1),
  short_bio: z.string().max(280).optional(),
  biography: z.string().optional(),
  birth_year: z.coerce.number().min(1500).max(2100).nullable().optional(),
  death_year: z.coerce.number().min(1500).max(2100).nullable().optional(),
  published: z.boolean().default(false),
  is_patrimonial: z.boolean().default(false),
  exemption_active: z.boolean().default(false),
});

/**
 * US-506: Actualizar perfil de ciudadano desde el panel admin.
 * Maneja metadatos, toggles de estado y reemplazo de retrato.
 */
export async function updateCitizen(prevState: any, formData: FormData) {
  // Hardening: Verificación explícita de sesión admin
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE_NAME)) {
    return { success: false, error: 'No autorizado.' };
  }

  const pb = await createAuthenticatedPB();

  // 1. Extraer booleanos manualmente ya que FormData.get() devuelve strings o null
  const rawData = {
    id: formData.get('id'),
    full_name: formData.get('full_name'),
    patrimonial_category: formData.get('patrimonial_category'),
    short_bio: formData.get('short_bio'),
    biography: formData.get('biography'),
    birth_year: formData.get('birth_year') || null,
    death_year: formData.get('death_year') || null,
    published: formData.get('published') === 'on',
    is_patrimonial: formData.get('is_patrimonial') === 'on',
    exemption_active: formData.get('exemption_active') === 'on',
  };

  // 2. Validación Zod
  const validated = citizenUpdateSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message };
  }

  try {
    const id = validated.data.id;
    
    // 3. Preparar FormData para PocketBase (incluyendo el archivo si existe)
    // Usamos el formData original pero corregimos los campos que Zod validó
    const updateData = new FormData();
    Object.entries(validated.data).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined && value !== null) {
        updateData.set(key, value.toString());
      }
    });

    // Manejo especial de booleanos para PB
    updateData.set('published', validated.data.published ? 'true' : 'false');
    updateData.set('is_patrimonial', validated.data.is_patrimonial ? 'true' : 'false');
    updateData.set('exemption_active', validated.data.exemption_active ? 'true' : 'false');

    // Retrato (Portrait)
    const portrait = formData.get('portrait');
    if (portrait instanceof File && portrait.size > 0) {
      updateData.set('portrait', portrait);
    }

    // 4. Ejecutar PATCH
    const record = await pb.collection('citizens').update(id, updateData);

    // 5. Revalidación de Caché Purga Quirúrgica
    revalidatePath(`/memorial/${record.slug}`);
    revalidatePath('/directorio');
    revalidatePath(`/admin/ciudadanos/${id}/editar`);

  } catch (error: any) {
    // Audit: Limpieza de logs. Solo logueamos el mensaje de error, no el objeto completo.
    console.error('[Security Audit] Update Citizen failed');
    return { success: false, error: 'Error al actualizar el ciudadano.' };
  }

  // Redirigir al listado tras éxito
  redirect('/admin/ciudadanos');
}
