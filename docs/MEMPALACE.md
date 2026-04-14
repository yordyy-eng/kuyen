# 🏛️ Palacio de Memoria: KUYEN

Índice maestro de decisiones, arquitectura y estado del proyecto. Consultar antes de cualquier cambio estructural.

---

## 🏗️ Arquitectura Cloud (OCI)
- **Engine**: Docker standalone (Multi-stage).
- **Reverse Proxy**: Nginx Proxy Manager (NPM).
- **Bridge IP**: `172.17.0.1` (Vital enlace NPM <-> Containers).
- **Zero Trust**: Administración puerto 81 vía Túnel SSH (`L 8181:127.0.0.1:81`).

### 🌐 Subdominios & Puertos
- `kuyen.adelchen.cl` -> Port 3005
- `cda.adelchen.cl` -> Port 3000
- `tecsin.adelchen.cl` -> Port 80 (Dolibarr)
- `werken.adelchen.cl` -> Port 3001

---

## 🛡️ Seguridad & SecOps
- **Rate Limiting**: US-509 activo (En memoria).
- **IP Extraction**: Header `x-forwarded-for` obligatorio para identificar clientes reales tras el proxy.
- **Validación**: Zod en Server Actions + PocketBase Schema Rules.

---

## ⚡ Performance & UX
- **Build**: `.next/standalone` para consumo < 512MB RAM.
- **Analítica (US-511)**: Patrón *Fire-and-Forget* en `/q/[code]`. Colección `scan_logs`.
- **UI/UX**: Premium Design, Glassmorphism, Google Fonts, SVGs nativos con Escudo de Angol.

---

## 🛠️ Herramientas de Agente
- **Caveman**: Tersedad máxima (Skills).
- **AutoSkills**: Gestión automatizada de capacidades.
- **Frontend-Design**: Prohibido placeholders, calidad premium.

---

**Última Sincronización**: 13 de abril de 2026.
