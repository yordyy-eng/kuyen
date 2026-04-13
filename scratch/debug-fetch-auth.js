// scratch/debug-fetch-auth.js
async function test() {
  const email = 'admin@kuyen.cl';
  const pass = '1234567890';
  const url = 'http://localhost:8091/api/collections/_superusers/auth-with-password';

  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: email, password: pass })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
test();
