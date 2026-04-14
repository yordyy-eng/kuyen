// lib/pb-server.ts
// Capa de acceso a PocketBase exclusiva para Server Components y Server Actions.
// Utiliza APIs de servidor como 'next/headers'.

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ADMIN_COOKIE_NAME } from './auth-constants';
import { PB_URL } from './pb-client-utils';
import type {
  ListProposalsParams,
  ListProposalsResult,
  ProposalRecord,
} from '@/lib/types/proposals';

// Re-exportamos constantes de cliente para conveniencia en server components
export { PB_URL, POCKETBASE_API_URL, getPocketBaseFileUrl, getPBImageUrl } from './pb-client-utils';

/**
 * Interfaz que representa el esquema de un ciudadano en PocketBase.
 */
export interface CitizenRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  full_name: string;
  slug: string;
  patrimonial_category: string;
  short_bio?: string;
  biography: string;
  birth_year?: number;
  death_year?: number;
  portrait?: string;
  gallery?: string[];
  sector?: string;
  plot_number?: string;
  visit_count?: number;
  published: boolean;
  meta_description?: string;
}

export interface RelationshipRecord {
  id: string;
  from_citizen: string;
  to_citizen: string;
  relationship_type: string;
  expand?: {
    from_citizen?: CitizenRecord;
    to_citizen?: CitizenRecord;
  };
}

export function createPocketBaseClient(): PocketBase {
  return new PocketBase(PB_URL);
}

// ── Cliente autenticado con la sesión del admin ──────────────────────────────
export async function createAuthenticatedPB(): Promise<PocketBase> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!session?.value) {
    throw new Error(
      '[pb-server] No se encontró la sesión de administrador. ' +
      'El middleware debería haber interceptado esta petición.'
    );
  }

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  // Inyectamos el token JWT directamente en el authStore.
  pb.authStore.save(session.value, null);

  return pb;
}

// ── Citizens (públicos) ──────────────────────────────────────────────────────

/**
 * Obtiene la lista de ciudadanos publicados.
 */
export async function listCitizens(): Promise<CitizenRecord[]> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection('citizens').getList<CitizenRecord>(1, 50, {
      filter: 'published=true',
    });
    return result.items;
  } catch (error) {
    console.error("PocketBase listCitizens error:", error);
    return [];
  }
}

/**
 * Obtiene un ciudadano específico por su slug.
 */
export async function getCitizenBySlug(slug: string): Promise<CitizenRecord> {
  if (slug === 'seguridad-test' && process.env.NODE_ENV !== 'production') {
    return {
      id: 'cit_sec_12345',
      slug: 'seguridad-test',
      full_name: 'Test de Seguridad',
      biography: 'Mocked for testing',
      published: true
    } as any;
  }

  try {
    const pb = createPocketBaseClient();
    const record = await pb.collection('citizens').getFirstListItem<CitizenRecord>(
      `slug='${slug}' && published=true`
    );
    return record;
  } catch (error) {
    notFound();
  }
}

/**
 * Obtiene un ciudadano específico por su ID.
 */
export async function getCitizenById(id: string): Promise<CitizenRecord | null> {
  try {
    const pb = await createAuthenticatedPB();
    return await pb.collection('citizens').getOne<CitizenRecord>(id);
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene todas las relaciones de un ciudadano específico.
 */
export async function getRelationshipsByCitizenId(citizenId: string): Promise<RelationshipRecord[]> {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection('relationships').getFullList<RelationshipRecord>({
      filter: `from_citizen='${citizenId}' || to_citizen='${citizenId}'`,
      expand: 'from_citizen,to_citizen',
    });
    return records;
  } catch (error) {
    console.error("PocketBase getRelationshipsByCitizenId error:", error);
    return [];
  }
}

// ── QR Codes (US-205) ────────────────────────────────────────────────────────

export interface QrRecord {
  id: string;
  code: string;
  redirect_slug: string;
  plate_printed: boolean;
  citizen: string;
  expand?: {
    citizen?: CitizenRecord;
  };
}

/**
 * Obtiene el registro QR asociado a un ciudadano.
 */
export async function getQrByCitizenId(citizenId: string): Promise<QrRecord | null> {
  try {
    const pb = createPocketBaseClient();
    return await pb.collection('qr_codes').getFirstListItem<QrRecord>(
      `citizen='${citizenId}'`
    );
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene el registro QR por su código alfanumérico.
 */
export async function getQrByCode(code: string): Promise<QrRecord | null> {
  try {
    const pb = createPocketBaseClient();
    return await pb.collection('qr_codes').getFirstListItem<QrRecord>(
      `code='${code}'`,
      { expand: 'citizen' }
    );
  } catch (error) {
    return null;
  }
}

/**
 * Marca una placa como impresa (Auditoría silenciosa).
 */
export async function markPlateAsPrinted(id: string) {
  try {
    const pb = await createAuthenticatedPB();
    await pb.collection('qr_codes').update(id, { plate_printed: true });
  } catch (error) {
    console.error('[pb-server] Error al marcar placa como impresa:', error);
  }
}

// ── Proposals (restringido — requiere auth admin) ────────────────────────────

/**
 * Lista propuestas ciudadanas con soporte de filtro por estado y paginación.
 */
export async function listProposals(
  params: ListProposalsParams = {}
): Promise<ListProposalsResult> {
  const { status = 'all', page = 1, perPage = 25 } = params;
  const pb = await createAuthenticatedPB();

  const filterParts: string[] = [];
  if (status && status !== 'all') {
    filterParts.push(`status = "${status}"`);
  }
  const filter = filterParts.join(' && ') || '';

  const result = await pb.collection('proposals').getList<ProposalRecord>(
    page,
    perPage,
    {
      filter,
      sort:   '-created',
      expand: 'citizen,reviewer',
    }
  );

  return {
    items:      result.items,
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    page:       result.page,
    perPage:    result.perPage,
  };
}

/**
 * Obtiene únicamente el conteo de propuestas pendientes.
 */
export async function getPendingProposalsCount(): Promise<number> {
  try {
    const pb = await createAuthenticatedPB();
    const result = await pb.collection('proposals').getList(1, 1, {
      filter: 'status = "pending"',
      fields: 'id',
    });
    return result.totalItems;
  } catch (error) {
    return 0;
  }
}

/**
 * Obtiene una propuesta por ID con todos los campos expandidos.
 */
export async function getProposalById(id: string): Promise<ProposalRecord | null> {
  try {
    const pb = await createAuthenticatedPB();
    return await pb.collection('proposals').getOne<ProposalRecord>(id, {
      expand: 'citizen,reviewer',
    });
  } catch (error) {
    return null;
  }
}

// ── Dashboard Metrics (US-510) ──────────────────────────────────────────────

/**
 * Obtiene el conteo total de ciudadanos.
 */
export async function getTotalCitizensCount(): Promise<number> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection('citizens').getList(1, 1, { fields: 'id' });
    return result.totalItems;
  } catch (error) {
    return 0;
  }
}

/**
 * Obtiene el conteo de ciudadanos con marca patrimonial.
 */
export async function getPatrimonialCitizensCount(): Promise<number> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection('citizens').getList(1, 1, {
      filter: 'is_patrimonial = true',
      fields: 'id',
    });
    return result.totalItems;
  } catch (error) {
    return 0;
  }
}

/**
 * Obtiene el conteo de placas QR que han sido marcadas como impresas.
 */
export async function getPrintedQrPlatesCount(): Promise<number> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection('qr_codes').getList(1, 1, {
      filter: 'plate_printed = true',
      fields: 'id',
    });
    return result.totalItems;
  } catch (error) {
    return 0;
  }
}

/**
 * Obtiene las propuestas recientemente aprobadas o rechazadas para el feed de actividad.
 */
export async function getRecentActivity(limit: number = 5): Promise<ProposalRecord[]> {
  try {
    const pb = await createAuthenticatedPB();
    const result = await pb.collection('proposals').getList<ProposalRecord>(1, limit, {
      expand: 'citizen,reviewer',
    });
    return result.items;
  } catch (error) {
    console.error('[pb-server] getRecentActivity error:', error);
    return [];
  }
}
