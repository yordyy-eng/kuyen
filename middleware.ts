// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Estructura para el caché en memoria
interface CacheEntry {
  slug: string;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo interceptamos rutas que empiecen con /q/
  if (pathname.startsWith('/q/')) {
    const code = pathname.split('/')[2];

    if (!code) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // 1. Verificar caché
    const cached = cache.get(code);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.redirect(new URL(`/memorial/${cached.slug}`, request.url));
    }

    // 2. Consultar PocketBase
    try {
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/qr_codes/records?filter=(code='${code}')`,
        { 
          headers: { 'Content-Type': 'application/json' },
          next: { revalidate: 300 } // Opcional: Next.js también puede cachear el fetch
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const redirectSlug = data.items[0].redirect_slug;

        // 3. Guardar en caché local
        cache.set(code, {
          slug: redirectSlug,
          expiry: Date.now() + CACHE_TTL
        });

        return NextResponse.redirect(new URL(`/memorial/${redirectSlug}`, request.url));
      } else {
        // Código no encontrado
        return NextResponse.redirect(new URL('/not-found', request.url));
      }
    } catch (error) {
      console.error('Middleware QR Error:', error);
      // Fallback a not-found en caso de error de red o base de datos
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  return NextResponse.next();
}

// Configuración del Matcher
export const config = {
  matcher: '/q/:code*',
};
