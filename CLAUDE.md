# KUYEN Agent Guidelines

## Technical Context
- **PocketBase Port**: MUST use `8091` for host access (to avoid conflict with `WsToastNotification.exe` on port 8090).
- **Backend API**: Accessible at `http://127.0.0.1:8091` in local env.
- **Middleware**: Intercepts `/q/:code` for QR redirection.

## Coding Standards
- **Styling**: Tailwind CSS v4. Use semantic classes.
- **Components**: 
  - Prefer Server Components for data fetching.
  - Interactive components (like React Flow) MUST be Client Components (`"use client"`) and loaded via `next/dynamic` with `ssr: false`.
- **Naming**: Use Spanish for business logic/labels (Heritage context), but keeping code technical terms in English.

## Genealogy Logic (Epic 4)
- **Relationships**: Managed in the `relationships` collection.
- **Layout**: Uses `dagre` for top-down tree calculation. See `lib/tree-utils.ts`.
- **Canvas**: Rendered in `components/memorial/FamilyTreeCanvas.tsx`.

## Common Commands
- **Seed Data**: Use scripts in `scratch/` for populating PocketBase.
- **Schema**: Import `pb_schema.json` via PocketBase UI or API after reset.
- **Tests**: `npm test` runs Playwright redirection tests.

@AGENTS.md
