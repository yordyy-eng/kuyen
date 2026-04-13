#!/bin/bash
# scripts/backup.sh
# Sistema de respaldos automáticos para KUYEN Heritage Platform.
# Según el PRD: Programar a las 03:00 AM para minimizar impacto.

# 1. Configuración
BACKUP_DIR="./backups"
DATA_DIR="./pb_data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="kuyen_pb_backup_$TIMESTAMP.tar.gz"

# Crear carpeta de backups si no existe
mkdir -p $BACKUP_DIR

echo "📦 Iniciando respaldo de PocketBase ($TIMESTAMP)..."

# 2. Empaquetado
# Se recomienda detener brevemente el contenedor en producción para consistencia de SQLite,
# o usar el comando 'pb_data vacuum' si se prefiere no detener.
tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$DATA_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Respaldo creado exitosamente: $BACKUP_DIR/$BACKUP_NAME"
else
    echo "❌ Error al crear el respaldo."
    exit 1
fi

# 3. Limpieza (Retener últimos 7 días localmente)
find "$BACKUP_DIR" -name "kuyen_pb_backup_*" -mtime +7 -delete

# 4. Integración con OCI (Placeholder para US-104)
# aws s3 cp "$BACKUP_DIR/$BACKUP_NAME" s3://kuyen-backups/ --endpoint-url $OCI_S3_ENDPOINT
# echo "🚀 Respaldo enviado a OCI Object Storage."

echo "✨ Operación completada."
