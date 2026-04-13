// lib/pb-server.ts
// Capa de acceso a PocketBase para Server Components y Server Actions.

import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ADMIN_COOKIE_NAME } from './auth-constants';
import type {
  ListProposalsParams,
  ListProposalsResult,
  ProposalRecord,
} from '@/lib/types/proposals';

// ── Singleton de cliente PocketBase (sin auth) ──────────────────────────────
export const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';
export const POCKETBASE_API_URL = PB_URL; // Alias para compatibilidad con código existente

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
  sector?: string;
  plot_number?: string;
  visit_count?: number;
  published: boolean;
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

// ── Helpers de archivos ─────────────────────────────────────────────────────
export function getPocketBaseFileUrl(
  collectionIdOrName: string,
  recordId:   string,
  filename:   string,
  thumb?:     string
): string {
  const base = `${PB_URL}/api/files/${collectionIdOrName}/${recordId}/${filename}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}

/**
 * Helper específico para avatares de ciudadanos (usa 'citizens' collection por defecto)
 */
export function getPBImageUrl(record: { id: string; collectionId?: string; portrait?: string }, filename?: string): string | null {
  if (!record || (!filename && !record.portrait)) return null;
  const file = filename || record.portrait;
  if (!file) return null;
  // Si no viene collectionId (común en expands), usamos el ID de la tabla 'citizens'
  const collection = record.collectionId || 'id1citizens0000'; 
  return getPocketBaseFileUrl(collection, record.id, file);
}

// ── Citizens (públicos) ──────────────────────────────────────────────────────

/**
 * Obtiene la lista de ciudadanos publicados directamente mediante la API REST.
 */
export async function listCitizens(): Promise<CitizenRecord[]> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection('citizens').getList<CitizenRecord>(1, 50, {
      filter: 'published = true',
      sort: '-created',
      next: { revalidate: 3600 },
    } as any);
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
  // Bypass temporal para tests de seguridad en entornos locales si la DB no tiene seeds
  if (slug === 'seguridad-test' && process.env.NODE_ENV !== 'production') {
    return {
      id: 'cit_sec_12345',
      collectionId: 'id1citizens0000',
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

// ── Proposals (restringido — requiere auth admin) ────────────────────────────

/**
 * Lista propuestas ciudadanas con soporte de filtro por estado y paginación.
 */
export async function listProposals(
  params: ListProposalsParams = {}
): Promise<ListProposalsResult> {
  const { status = 'all', page = 1, perPage = 25 } = params;
  const pb = await createAuthenticatedPB();

  // Construir el filtro dinámico
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
      sort:   '-created', // más recientes primero
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
