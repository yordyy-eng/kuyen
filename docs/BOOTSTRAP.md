# Protocolo de Arranque del Agente (KUYEN BOOTSTRAP)

Este documento es de lectura obligatoria para cualquier Agente de IA o desarrollador humano que inicie una sesión de trabajo en el repositorio KUYEN.

---

## 1. Stack Tecnológico & Skills Activas

Al iniciar, el agente debe asegurarse de tener cargadas y activas las siguientes capacidades:

- **Caveman Mode**: Intensidad `Full/Ultra`. Tersedad técnica absoluta.
- **Frontend Design**: Estética `Heritage Modern`. Glassmorphism, micro-animaciones, prohibido el uso de placeholders.
- **Next.js 15+**: App Router, Server Components por defecto, Server Actions para mutaciones.
- **PocketBase**: Backend as a Service. Consultas vía `lib/pb-server.ts`.

---

## 2. Flujo de Trabajo (GitOps Driven)

KUYEN opera bajo un modelo de **Configuración como Código Centralizada**.

1.  **Consulta MemPalace**: Siempre lee `docs/MEMPALACE.md` para entender el estado actual de la infraestructura.
2.  **Estandarización UI**: Antes de modificar un texto en un componente, verifica si debe estar en `constants/site-config.ts`. Si es un texto institucional, **DEBE** ir en la constante.
3.  **Validación de Build**: Antes de cualquier despliegue, ejecuta `npm run build` localmente para atrapar errores de tipado o de RSC.
4.  **Despliegue Atómico**:
    - `git add .`
    - `git commit -m "feat/fix: descripción"`
    - `git push origin main`
    - SSH al servidor OCI para ejecutar el despliegue (`docker compose up -d --build`).

---

## 3. Comandos Esenciales

- **SSH Tunnel (Admin Dashboard PB/NPM)**:
  `ssh -i "path/to/key" -L 8181:127.0.0.1:81 ubuntu@146.235.246.171`
- **Build Local**:
  `npm run build`
- **Deploy Remoto**:
  `ssh -i "path/to/key" ubuntu@146.235.246.171 "cd ~/kuyen && git pull && docker compose -f docker-compose.prod.yml up -d --build"`

---

## 4. Leyes Inquebrantables

1.  **Sin Placeholders**: Si falta una imagen, genérala con `generate_image` o usa assets reales del proyecto.
2.  **Sin Console.Logs**: El código en producción debe ser silencioso.
3.  **Atomicidad**: Un commit, una funcionalidad o corrección clara.
4.  **Memoria**: Si cambias algo estructural, actualiza `docs/MEMPALACE.md` de inmediato.

---

> [!CAUTION]
> Ignorar este protocolo resultará en desincronización de la infraestructura y builds fallidos en OCI ARM64.
