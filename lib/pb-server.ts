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
  birth_year: number;
  death_year: number;
  biography: string;
  published: boolean;
  qr_code_image: string;
}

const POCKETBASE_API_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';

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
  try {
    const res = await fetch(
      `${POCKETBASE_API_URL}/api/collections/citizens/records?filter=(slug='${slug}' && published=true)`,
      {
        next: { revalidate: 60 }, // Revalidación rápida de 1 minuto
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch citizen: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      notFound();
    }

    return data.items[0] as CitizenRecord;
  } catch (error) {
    // Si es un error de notFound() lanzado internamente, lo propagamos
    if (error instanceof Error && error.message.includes('NEXT_NOT_FOUND')) {
      throw error;
    }
    console.error("PocketBase fetch error:", error);
    notFound(); 
  }
}
