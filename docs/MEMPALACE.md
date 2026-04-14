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

## ⚙️ GitOps & Estandarización
- **SITE_CONFIG**: Fuente única de verdad para UI (`constants/site-config.ts`).
- **Workflow**: Cambios en UI se realizan vía código, no hardcoded en componentes.
- **Admin Guidance**: Consultar `docs/GUIA_HISTORIADOR.md` para gestión de PocketBase.

---

## 🖨️ Módulo de Impresión QR (Phygital)
- **Ruta**: `/admin/ciudadanos/[id]/imprimir`.
- **Logic**: Generación de placas QR institucionales (9x9cm) con Escudo de Angol.
- **Library**: `qrcode.react`.
- **CSS**: Media query `@media print` optimizado para ocultar UI administrativa.

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
- **Protocolo**: Consultar `docs/BOOTSTRAP.md` antes de iniciar sesión.

---

**Última Sincronización**: 14 de abril de 2026.
