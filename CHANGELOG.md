# Changelog

All notable changes to the KUYEN project will be documented in this file.

### [0.7.0] - 2026-04-13

### Añadido (US-205 — Generación Nativa de Placas)
- **SSR QR Plate**: Generación nativa de placas QR en formato SVG desde `/api/qr-plate/[code]`.
- **Identidad Oficial**: Integración del Escudo de Angol oficial inyectado directamente en la plantilla SVG.
- **Independencia de APIs**: Eliminación de dependencias externas para QR (ahora usa la librería `qrcode` local).
- **Auditoría**: Marcado automático de `plate_printed` en PocketBase tras la generación exitosa.
- **Acceso Admin**: Botón de descarga directa en la vista de edición de ciudadano.

### Añadido (US-510 — Dashboard de Auditoría y Métricas)
- **Centro de Comando**: Transformación de la landing administrativa en un panel de control vivo con métricas agregadas.
- **Métricas SSR**: Implementación de conteos paralelos con `Promise.all` para ciudadanos, hitos patrimoniales y placas QR impresas.
- **Registro de Auditoría**: Nuevo `ActivityFeed` que despliega las últimas 5 acciones de moderación (aprobaciones/rechazos) con trazabilidad de administradores.
- **Diseño Heritage**: Componentes `MetricCard` y `ActivityFeed` integrados con la estética solemne del proyecto.
- **Cierre de Desarrollo**: Finalización de todas las épicas administrativas planeadas para la fase de lanzamiento.

### Seguridad (US-509 — Protección Anti-Spam)
- **Rate Limiting**: Implementación de limitador de tasa en memoria (`lib/rate-limit.ts`) con una ventana de 10 minutos.
- **Detección de IP Blindada**: Extracción de IP real compatible con proxies (X-Forwarded-For) para evitar suplantaciones de origen.
- **Feedback Elegante**: Integración de mensajes de reintento en el formulario de contribución, bloqueando el procesamiento de archivos si se excede el límite.

### Infraestructura (US-104)
- **Backups**: Script `scripts/backup.sh` para respaldos automatizados de `pb_data` con rotación de 7 días.

### [0.6.0] - 2026-04-13

### Añadido (US-506 — Gestión de Directorio)
- **Panel Administrativo**: Nueva tabla de gestión de ciudadanos en `/admin/ciudadanos`.
- **Edición de Perfiles**: Formulario de edición avanzado en `/admin/ciudadanos/[id]/editar` con:
  - Toggles para `published`, `is_patrimonial` y `exemption_active`.
  - Subida y reemplazo de retrato (portrait) con previsualización en tiempo real.
- **Acciones**: Server Action `updateCitizen` con validación Zod y revalidación de caché quirúrgica.

### Seguridad e Infraestructura
- **Persistencia Docker**: Corrección crítica en `docker-compose.yml` usando bind mounts (`./pb_data`) para asegurar la supervivencia de datos SQLite.
- **Automatización**: Nuevos scripts `scratch/sync-schema.js` y `scratch/seed-test-data.js` con soporte para secretos desde `.env.local`.

### [0.5.0] - 2026-04-13

### Añadido (US-505 — Aprobación Granular)
- **Vista de Detalle**: Nueva pantalla de revisión quirúrgica en `app/admin/propuestas/[id]`.
- **Comparativa de Bio**: Componente `BiographyDiff` que permite editar el texto propuesto antes de la publicación definitiva.
- **Gestión de Medios**: `PhotoReviewGrid` con sistema de selección individual para decidir qué fotos se integran a la galería pública.
- **Acciones Administrativas**: 
  - `approveProposal`: Proceso de aprobación con transferencia de archivos, sanitización de bio e invalidación de caché quirúrgica.
  - `rejectProposal`: Rechazo con auditoría obligatoria (`reviewer_note`).
- **Esquema**: Actualización de la base de datos para soportar galerías de imágenes en ciudadanos y campos de auditoría en propuestas.

### [0.4.0] - 2026-04-13

### Added
- **Moderación de Propuestas (US-504)**: 
  - **Capa de Datos**: Implementada `createAuthenticatedPB()` para acceso seguro al backend con el token de administrador.
  - **Moderación**: Nuevas funciones `listProposals()`, `getPendingProposalsCount()` y `getProposalById()` en `lib/pb-server.ts`.
  - **UI Admin**: `StatusBadge`, `ProposalRow`, `ProposalsFilterTabs` y `ProposalsEmptyState` diseñados para una gestión de crowdsourcing eficiente y solemne.
  - **Navegación**: Badge dinámico de notificaciones en el sidebar que indica el conteo de registros pendientes en tiempo real.
- **Admin Auth (US-503)**: Implementado el muro de seguridad del Panel de Administración con middleware dual y Server Actions de login/logout.

### Changed
- **Arquitectura**: Migración del sistema de tipos a `lib/types/proposals.ts` para asegurar consistencia entre la UI y el esquema de PocketBase.
- **Rendimiento**: Optimización de carga en la bandeja administrativa mediante fetches paralelos con `Promise.all`.

### Security
- Mensajes de error genéricos y protección de la cookie de sesión (`httpOnly`).
- Validación asíncrona de `cookies()` y `searchParams` compatible con Next.js 16.

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
