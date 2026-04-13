#!/bin/bash
# scripts/deploy.sh
# US-602: Script de Despliegue Automatizado para OCI
# Autor: KUYEN DevOps

set -e

echo "🚀 Iniciando despliegue de KUYEN en OCI..."

# 1. Traer cambios más recientes
echo "📥 Sincronizando repositorio..."
git pull origin main

# 2. Reconstrucción de imágenes (No-Cache para asegurar frescura)
echo "🏗️ Construyendo contenedores de producción..."
docker compose -f docker-compose.prod.yml build --no-cache

# 3. Reinicio de servicios
echo "🔄 Levantando servicios..."
docker compose -f docker-compose.prod.yml up -d

# 4. Limpieza de imágenes huérfanas
echo "🧹 Limpiando recursos antiguos..."
docker image prune -f

echo "✅ Despliegue completado con éxito."
