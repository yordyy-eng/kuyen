# Changelog

All notable changes to the KUYEN project will be documented in this file.
  
### [0.2.1] - 2026-04-12

### Added
- **Premium Nodes (US-403)**: Implemented `CitizenTreeNode` with custom avatars, Serif typography, and dynamic states for the current heritage record.
- **Node Detail Panel (US-406)**: Created a mobile-first Bottom Sheet component for extended family data with swipe-to-close gestures.
- **Improved Interaction**: Added automatic panel closing on map pan/click and enriched node data injection.
- **PB Helper**: Integrated `getPBImageUrl` utility for standardized multi-media retrieval.

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
