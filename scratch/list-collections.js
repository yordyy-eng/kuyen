// scratch/list-collections.js
const PocketBase = require('pocketbase/cjs');

async function list() {
  const pb = new PocketBase('http://127.0.0.1:8091');
  try {
    await pb.collection('_superusers').authWithPassword('admin@kuyen.cl', 'K@y3nAdm1n2026!');
    const collections = await pb.collections.getFullList();
    console.log('Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('List failed:', err.message);
  }
}
list();
