// lib/pb-client.ts
import PocketBase from 'pocketbase';

/**
 * Singleton del cliente de PocketBase para el frontend.
 * Se conecta a la instancia local por defecto.
 */
const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

// Desactivar el auto-cancellation para evitar problemas con React 18 Strict Mode en desarrollo
pb.autoCancellation(false);

export default pb;
