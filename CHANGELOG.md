# Changelog

All notable changes to the KUYEN project will be documented in this file.

### [0.4.0] - 2026-04-13

### Added
- **Admin Auth (Epic 5 / US-503)**: Implementado el muro de seguridad del Panel de Administración.
- **Proxy Consolidado**: Actualizado `proxy.ts` con matcher dual (`/q/:code*` + `/admin/:path*`). La lógica de protección de rutas intercepta todas las rutas `/admin/*` excepto `/admin/login`.
- **Server Actions de Auth**: Creado `app/actions/auth.ts` con `adminLogin` (usando `pb.collection('_superusers')` — API correcta para PocketBase v0.23+) y `adminLogout`.
- **Cookie de Sesión Segura**: `kuyen_admin_session` con flags `httpOnly: true`, `sameSite: 'lax'`, `secure` en producción y `maxAge` de 8 horas.
- **Admin Layout**: `app/admin/layout.tsx` con sidebar de navegación (doble defensa per Next.js 16) y diseño condicional (sin sidebar en página de login para evitar bucles de redirección).
- **Login Page**: `app/admin/login/page.tsx` con formulario de acceso solemne y mensajes de error genéricos (sin information leakage).
- **Admin Dashboard**: `app/admin/page.tsx` con widgets de acceso rápido a futuras secciones del panel.

### Security
- Mensajes de error genéricos (`"Credenciales incorrectas."`) que no revelan si el email o la contraseña son incorrectos.
- Cookie de sesión inaccesible al JavaScript del cliente (`httpOnly`).
- PocketBase `_superusers` con `createRule: null` (solo creación vía dashboard/API).

---

### [0.3.0] - 2026-04-12

### Added
- **Crowdsourcing (Epic 5)**: Iniciada la Épica 5 con la página de contribución ciudadana (US-501).
- **Client Forms**: Creado `ContributionForm` y `PhotoUploadInput` para ingesta de datos con manejo de imágenes local y `useActionState`.
- **Server Actions**: Implementado `submitProposal` para enviar y registrar propuestas en texto e imagen directos hacia PocketBase.
- **Schema Updates**: Añadida la colección `proposals` al esquema base con permisos públicos controlados.
  
### [0.2.1] - 2026-04-12

### Added
- **Finalización de Épica 4**: Cierre funcional de la visualización genealógica.
- **Fullscreen nativo (US-405)**: Implementación de `TreeFullscreenModal` usando la API `<dialog>` y unidades `100dvh/w` para máxima compatibilidad móvil.
- **Estado Vacío / Participación (US-409)**: Nuevo componente `TreeContributePrompt` con invitación a colaborar para registros sin datos familiares.
- **Refactor Arquitectónico**: Movido el fetch de relaciones a nivel de página (`MemorialPage`) para renderizado condicional optimizado.
- **Premium Nodes (US-403)**: Implemented `CitizenTreeNode` with custom avatars, Serif typography, and dynamic states.
- **Node Detail Panel (US-406)**: Created a mobile-first Bottom Sheet component with swipe-to-close gestures.

### [0.2.0] - 2026-04-11

### Added
- **Family Genealogy (Epic 4)**: Integrated React Flow (@xyflow/react) for interactive family tree visualization.
- **Dynamic Layout**: Implementation of Dagre-based hierarchical layout for automated tree generation (US-402).
- **Relationships Schema**: Added `relationships` collection to PocketBase with support for multi-directional ties.
- **Interactive UX**: Click-to-navigate functionality on family nodes with mobile-first zoom/pan protections (US-403).

### [0.1.3] - 2026-04-11

### Added
- **QR Intelligence**: Implemented native Next.js Middleware to intercept `/q/:code` requests and redirect them to memorial pages (US-202).
- **Edge Cache**: Integrated in-memory `Map` cache with 5-minute TTL to optimize redirection speed and protect backend.
- **Custom 404 Experience**: Dedicated `app/not-found.tsx` for missing heritage records with brand-aligned design.

### [0.1.2] - 2026-04-10

### Added
- **Memorial Experience**: Implemented dynamic memorial pages (`/memorial/[slug]`) with mobile-first design (US-303).
- **Navigation**: Integrated "Back to directory" navigation and deep linking from the main directory.
- **Robust Fetching**: Enhanced server-side logic with `notFound()` integration and 60s revalidation.

### [0.1.1] - 2026-04-10

### Added
- **Data Integration**: Finalized US-302 by connecting the home page directory to the real PocketBase backend.
- **Server Data Layer**: Implemented `lib/pb-server.ts` for optimized server-side fetching with 1h revalidation.
- **Dynamic UI**: Updated `app/page.tsx` as a Server Component to map database fields to the UI.

## [0.1.0] - 2026-04-10
    - [x] Crear componente CitizenCard.tsx
    - [x] [US-303] Página de Memorial Individual
    - [x] Implementar getCitizenBySlug en pb-server.ts
    - [x] Crear ruta dinámica app/memorial/[slug]/page.tsx
    - [x] Diseñar layout de detalle Mobile-First
    - [x] Manejo de 404 (notFound)
- [x] [US-202] Middleware de Redirección QR
    - [x] Crear middleware.ts con matcher /q/:code*
    - [x] Implementar fetch hacia PocketBase qr_codes
    - [x] Caché en memoria (5min TTL)
    - [x] Página 404 personalizada (app/not-found.tsx)
- [x] [US-201] Configuración de PocketBase
    - [x] Crear pb_schema.json (Citizens & QR)
    - [x] Instalar SDK de PocketBase
- [x] [US-203] Cliente API en Next.js
    - [x] Crear lib/pb-client.ts (Singleton)
- **Workflow**: Initialized `pb_data` directory for persistent local storage.
- **Dependencies**: Added `pocketbase` SDK to `package.json`.

### Changed
- Refactored project from legacy scaffold to modern Next.js 14 architecture.
- Inverted design theme from Dark to Light mode for outdoors readability.
