// scratch/seed-test-data.js
/**
 * Script de sembrado de datos iniciales para desarrollo.
 * Crea al ciudadano Cornelio Saavedra y una propuesta pendiente.
 */
const PocketBase = require('pocketbase/cjs');

async function seed() {
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

  if (!email || !password) {
    console.error('❌ ERROR: Credenciales de admin no definidas.');
    process.exit(1);
  }

  const pb = new PocketBase(pbUrl);

  try {
    console.log(`🔐 Autenticando como ${email}...`);
    await pb.collection('_superusers').authWithPassword(email, password);

    // 1. Crear Ciudadano: Cornelio Saavedra
    console.log('👤 Creando ciudadano: Cornelio Saavedra...');
    let saavedra;
    try {
      saavedra = await pb.collection('citizens').getFirstListItem('slug="saavedra"');
      console.log('ℹ️ Ciudadano ya existe, omitiendo creación.');
    } catch (e) {
      saavedra = await pb.collection('citizens').create({
        full_name: 'Cornelio Saavedra',
        slug: 'saavedra',
        patrimonial_category: 'Militar',
        biography: '<p>Líder de la Revolución de Mayo y presidente de la Primera Junta.</p>',
        birth_year: 1759,
        death_year: 1829,
        published: true,
        is_patrimonial: true,
        exemption_active: false
      });
      console.log('✅ Ciudadano creado.');
    }

    // 2. Crear Registro QR (SVD-01)
    console.log('📱 Creando registro QR para Saavedra...');
    try {
      await pb.collection('qr_codes').getFirstListItem(`code="SVD-01"`);
      console.log('ℹ️ Registro QR ya existe.');
    } catch (e) {
      await pb.collection('qr_codes').create({
        code: 'SVD-01',
        redirect_slug: 'saavedra',
        citizen: saavedra.id,
        plate_printed: false
      });
      console.log('✅ Registro QR creado.');
    }

    // 3. Crear Propuesta Pendiente
    console.log('📥 Creando propuesta pendiente...');
    try {
      await pb.collection('proposals').create({
        citizen: saavedra.id,
        contributor_name: 'Historiador Anónimo',
        contributor_email: 'anonimo@historia.cl',
        contributor_relation: 'Investigador',
        biography: 'Saavedra nació en la Hacienda de Otuyo, cerca de Potosí.',
        status: 'pending'
      });
      console.log('✅ Propuesta creada.');
    } catch (e) {
      console.warn('⚠️ No se pudo crear la propuesta (posiblemente falta la colección proposals):', e.message);
    }

    console.log('✨ Sembrado de datos completado.');
  } catch (err) {
    console.error('❌ Error en el sembrado:', err.response?.data || err.message);
    process.exit(1);
  }
}

seed();
