# KUYEN - Plataforma de Registro Patrimonial

> [!IMPORTANT]
> 🚀 **¿Eres un nuevo agente?** Lee obligatoriamente [docs/BOOTSTRAP.md](file:///d:/Adelchen/kuyen/docs/BOOTSTRAP.md) antes de tocar una sola línea de código. Ignorar esto resultará en la deshonra de la tribu y builds fallidos.

KUYEN es una plataforma diseñada para digitalizar la memoria y el patrimonio, creando un puente entre monumentos físicos y registros digitales dinámicos.

## Visión General
El proyecto permite la gestión de ciudadanos destacados, memoriales individuales y la visualización de vínculos genealógicos e institucionales complejos mediante una interfaz moderna, solemne y de alto rendimiento.

## Arquitectura Tecnológica
- **Frontend**: Next.js 16.2.3 (App Router) con Turbopack.
- **Estilos**: Tailwind CSS v4 (Light Mode First).
- **Backend**: PocketBase (BaaS) operando bajo Docker.
- **Gráficos**: React Flow (@xyflow/react) + Dagre para el layout de árboles genealógicos.
- **Infraestructura**: Docker Compose para orquestación de servicios locales y producción (ARM64).

## Configuración del Entorno (Local)

### 1. Infraestructura Docker
El backend de PocketBase está configurado para evitar conflictos comunes en plataformas Windows.
- **Puerto Host**: `8091` (Mapeado internamente al 8090 del contenedor).
- **Dashboard**: `http://localhost:8091/_/`

```bash
docker compose up -d pocketbase
```

### 2. Variables de Entorno
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8091
```

### 3. Desarrollo Frontend
```bash
npm install
npm run dev
```

## Características Clave
- **US-202 QR Redirection**: Middleware de redirección inteligente con caché en el Edge para códigos `/q/:code`.
- **Épica 4 Genealogía**: Visualización interactiva de vínculos familiares e institucionales usando layout jerárquico.
- **SEO & Performance**: Optimización agresiva para lectura en exteriores con alto contraste y tiempos de carga mínimos.

---
© 2026 KUYEN Heritage Project
