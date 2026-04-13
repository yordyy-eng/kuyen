const http = require('http');

async function seedFamily() {
  const post = (path, data) => new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const req = http.request({
      hostname: '127.0.0.1', port: 8091, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': dataStr.length }
    }, res => {
      let body = ''; res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject); req.write(dataStr); req.end();
  });

  try {
    console.log("Seeding Familia Saavedra...");
    
    // 1. Crear Ciudadanos
    const cornelio = await post('/api/collections/citizens/records', {
      full_name: "Cornelio Saavedra",
      slug: "cornelio-saavedra",
      patrimonial_category: "Militar",
      biography: "Presidente de la Primera Junta de Gobierno de las Provincias Unidas del Río de la Plata.",
      published: true
    });

    const santiago = await post('/api/collections/citizens/records', {
      full_name: "Santiago de Saavedra",
      slug: "santiago-saavedra",
      patrimonial_category: "Social",
      biography: "Padre de Cornelio Saavedra, comerciante y funcionario colonial.",
      published: true
    });

    const juana = await post('/api/collections/citizens/records', {
      full_name: "Juana Francisca de Ituarte",
      slug: "juana-ituarte",
      patrimonial_category: "Social",
      biography: "Esposa de Cornelio Saavedra.",
      published: true
    });

    const agustin = await post('/api/collections/citizens/records', {
      full_name: "Agustín Saavedra",
      slug: "agustin-saavedra",
      patrimonial_category: "Política",
      biography: "Hijo de Cornelio Saavedra.",
      published: true
    });

    // 2. Crear Relaciones
    await post('/api/collections/relationships/records', {
      from_citizen: santiago.id,
      to_citizen: cornelio.id,
      relationship_type: "Padre/Madre"
    });

    await post('/api/collections/relationships/records', {
      from_citizen: juana.id,
      to_citizen: cornelio.id,
      relationship_type: "Cónyuge"
    });

    await post('/api/collections/relationships/records', {
      from_citizen: cornelio.id,
      to_citizen: agustin.id,
      relationship_type: "Hijo/a"
    });

    console.log("Familia Saavedra seeded successfully!");
  } catch (e) {
    console.error("Seed error:", e.message);
  }
}

seedFamily();
