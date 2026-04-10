# Changelog

All notable changes to the KUYEN project will be documented in this file.

## [0.1.0] - 2026-04-10

### Added
- [x] [US-302] Prototipo de Inicio (Mock Data)
    - [x] Crear componente CitizenCard.tsx
    - [x] Poblar app/page.tsx con datos mock
    - [x] Implementar Grid Responsivo
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
