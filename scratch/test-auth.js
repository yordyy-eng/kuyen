// scratch/test-auth.js
const PocketBase = require('pocketbase/cjs');

async function test() {
  const pb = new PocketBase('http://127.0.0.1:8091');
  const email = 'admin@kuyen.cl';
  const pass = 'K@y3nAdm1n2026!';

  console.log('Trying new auth (_superusers)...');
  try {
    await pb.collection('_superusers').authWithPassword(email, pass);
    console.log('✅ NEW AUTH SUCCESS');
    return;
  } catch (e) {
    console.log('❌ NEW AUTH FAILED:', e.message, e.response?.data);
  }

  console.log('Trying legacy auth (admins)...');
  try {
    // In SDK < 0.26, pb.admins was the way. In 0.26 it might still work if server is old.
    // We can also try the collection 'admins' if it exists.
    await pb.collection('admins').authWithPassword(email, pass);
    console.log('✅ LEGACY COLLECTION AUTH SUCCESS');
    return;
  } catch (e) {
    console.log('❌ LEGACY COLLECTION AUTH FAILED:', e.message, e.response?.data);
  }
  
  try {
    // Some versions use 'admin' (singular)
    await pb.collection('admin').authWithPassword(email, pass);
    console.log('✅ SINGULAR ADMIN AUTH SUCCESS');
    return;
  } catch (e) {}

  console.log('All auth attempts failed.');
}

test();
