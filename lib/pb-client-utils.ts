// lib/pb-client-utils.ts
// Utility helpers for PocketBase that are safe to use in both Client and Server components.
// These must NOT import 'next/headers' or other server-only APIs.

export const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';
export const POCKETBASE_API_URL = PB_URL;

/**
 * Genera la URL pública para un archivo en PocketBase.
 */
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
 * Helper específico para avatares e imágenes (usa 'id1citizens0000' por defecto si no hay collectionId).
 */
export function getPBImageUrl(
  record: { id: string; collectionId?: string; portrait?: string }, 
  filename?: string
): string | null {
  if (!record || (!filename && !record.portrait)) return null;
  const file = filename || record.portrait;
  if (!file) return null;
  const collection = record.collectionId || 'id1citizens0000'; 
  return getPocketBaseFileUrl(collection, record.id, file);
}
