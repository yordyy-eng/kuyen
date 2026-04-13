const http = require('http');

async function seed() {
  const citizen = JSON.stringify({
    full_name: "Cornelio Saavedra",
    slug: "saavedra",
    patrimonial_category: "Militar",
    published: true
  });

  const request = (path, data) => {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 8090,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  try {
    console.log("Creating citizen...");
    const citizenRes = await request('/api/collections/citizens/records', citizen);
    console.log("Citizen created:", citizenRes);

    const qr = JSON.stringify({
      code: "c001",
      redirect_slug: "saavedra"
    });

    console.log("Creating QR code...");
    const qrRes = await request('/api/collections/qr_codes/records', qr);
    console.log("QR created:", qrRes);
  } catch (e) {
    console.error("Error seeding:", e);
  }
}

seed();
