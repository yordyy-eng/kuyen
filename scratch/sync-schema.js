// scratch/sync-schema.js
/**
 * Script de sincronización de esquema para PocketBase.
 * Lee las credenciales de administración del entorno para mayor seguridad.
 */
const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

async function sync() {
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

  console.log('DEBUG: URI:', pbUrl);
  console.log('DEBUG: Identity:', email);

  if (!email || !password) {
    console.error('❌ ERROR: PB_ADMIN_EMAIL o PB_ADMIN_PASSWORD no están definidos.');
    console.error('Asegúrate de ejecutar este script con: node --env-file=.env.local scratch/sync-schema.js');
    process.exit(1);
  }

  const pb = new PocketBase(pbUrl);
  
  try {
    console.log(`🔐 Autenticando en ${pbUrl} como ${email}...`);
    await pb.collection('_superusers').authWithPassword(email, password);
    console.log('✅ Autenticación exitosa.');

    const schemaPath = path.join(__dirname, '..', 'pb_schema.json');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`No se encontró el archivo de esquema en ${schemaPath}`);
    }

    const collections = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    console.log(`🚀 Importando ${collections.length} colecciones...`);
    // Importación masiva de colecciones (pb.collections.import es para v0.20+)
    await pb.collections.import(collections, false);
    
    console.log('✨ Sincronización de esquema completada con éxito.');
  } catch (err) {
    console.error('❌ Error en la sincronización:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

sync();
