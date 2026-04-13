# Plan de Migración: Nginx Nativo ➔ Nginx Proxy Manager (NPM)

Este documento detalla el procedimiento para migrar la red del servidor `vnic-adelchen-prod` a un sistema centralizado con NPM (Docker) en el futuro.

## ⚠️ Análisis de Riesgos (High Risk)

> [!CAUTION]
> **Downtime Requerido**: Esta operación requiere detener el servicio de Nginx nativo. Durante la transición, todos los dominios (`kuyen`, `cda`, `tecsin`, `werken`) estarán fuera de línea.

## 📋 Pre-requisitos
1.  **Backup Completo**: Realizar backup de todos los archivos en `/etc/nginx/sites-enabled/`.
2.  **Docker Compose**: Archivo listo para levantar NPM en los puertos 80 y 443.

## 🛠️ Procedimiento de Migración

### Paso 1: Liberar los Puertos 80 y 443
```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### Paso 2: Ignición de NPM
Levantar el contenedor de NPM (asegurándose de mapear los puertos 80, 443 y 81 para el panel).

### Paso 3: Migración de Sitios (Maniobra Manual)
Para cada sitio activo (`cda`, `tecsin`, etc.), crear un "Proxy Host" en el panel de NPM:
- **Forward IP**: `172.17.0.1` (Gate de Docker).
- **Forward Port**: El puerto interno respectivo (ej. 3000 para cda, 3005 para kuyen).

### Paso 4: Re-certificación SSL
Como los certificados de Certbot nativo están en `/etc/letsencrypt`, NPM no los verá por defecto. Se recomienda solicitar nuevos certificados a través de la interfaz de NPM para mayor simplicidad.

## 🩺 Criterios de Éxito
1. Todos los dominios resuelven correctamente con HTTPS.
2. Nginx nativo está desactivado permanentemente.

---
UGA. Bisturí preparado. Esperando la ventana de mantenimiento. 🦍💉☁️
# Proyecto KUYEN - Certificación 2026.
