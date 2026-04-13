# Manual de Inicio — KUYEN Heritage Platform

Bienvenido al ecosistema KUYEN. Este documento detalla los pasos para poner en marcha el proyecto desde cero.

---

## 🛠️ Requisitos Técnicos
- **Node.js**: v20+
- **Docker & Docker Compose** (para el backend)
- **PocketBase**: Incluido vía Docker.

---

## 🚀 Instalación y Configuración

1. **Clonar y Dependencias**:
   ```bash
   git clone <repo_url>
   cd kuyen
   npm install
   ```

2. **Variables de Env**:
   Crea un archivo `.env.local` con:
   ```env
   PB_ADMIN_EMAIL=admin@kuyen.cl
   PB_ADMIN_PASSWORD=TuPasswordSegura
   NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8091
   ```

3. **Levantar Backend**:
   ```bash
   docker compose up -d
   ```

---

## 👤 Administración
- **Panel**: `/admin`
- **Moderación**: `/admin/propuestas`
- **QR**: Generación protegida en `/api/qr-plate/[code]`

---

## 📦 Producción (OCI)
```bash
bash scripts/deploy.sh
```

---

© 2026 KUYEN Heritage Project
