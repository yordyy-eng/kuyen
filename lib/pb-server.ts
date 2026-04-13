// lib/pb-server.ts
import { notFound } from 'next/navigation';

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

export const POCKETBASE_API_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

/**
 * Genera la URL para archivos de PocketBase.
 */
export function getPBImageUrl(record: CitizenRecord | undefined, filename?: string): string | null {
  if (!record || (!filename && !record.portrait)) return null;
  const file = filename || record.portrait;
  return `${POCKETBASE_API_URL}/api/files/${record.collectionId}/${record.id}/${file}`;
}

/**
 * Obtiene la lista de ciudadanos publicados directamente mediante la API REST.
 * Optimizado para React Server Components con caché nativo de Next.js.
 */
export async function listCitizens(): Promise<CitizenRecord[]> {
  try {
    const res = await fetch(
      `${POCKETBASE_API_URL}/api/collections/citizens/records?filter=(published=true)&sort=-created`,
      {
        next: { revalidate: 3600 }, // Revalidación cada 1 hora
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch citizens: ${res.statusText}`);
    }

    const data = await res.json();
    return data.items as CitizenRecord[];
  } catch (error) {
    console.error("PocketBase fetch error:", error);
    return [];
  }
}

/**
 * Obtiene un ciudadano específico por su slug.
 * Lanza notFound() si el registro no existe o no está publicado.
 */
export async function getCitizenBySlug(slug: string): Promise<CitizenRecord> {
  const res = await fetch(
    `${POCKETBASE_API_URL}/api/collections/citizens/records?filter=(slug='${slug}' && published=true)`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch citizen: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    notFound();
  }

  return data.items[0] as CitizenRecord;
}

/**
 * Obtiene todas las relaciones de un ciudadano específico.
 * Expande los datos de los ciudadanos relacionados para el árbol.
 */
export async function getRelationshipsByCitizenId(citizenId: string): Promise<RelationshipRecord[]> {
  try {
    const res = await fetch(
      `${POCKETBASE_API_URL}/api/collections/relationships/records?filter=(from_citizen='${citizenId}' || to_citizen='${citizenId}')&expand=from_citizen,to_citizen`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch relationships: ${res.statusText}`);
    }

    const data = await res.json();
    return data.items as RelationshipRecord[];
  } catch (error) {
    console.error("PocketBase relations fetch error:", error);
    return [];
  }
}
