const { products } = require('../server/data/products.js');
const fs = require('fs');

const archContent = fs.readFileSync('./src/data/watchArchitectures.ts', 'utf8');

const missing = [];
for (const p of products) {
  if (!archContent.includes(`'${p.slug}'`)) {
    missing.push({ id: p.id, name: p.name, slug: p.slug });
  }
}
console.log('Missing architectures count:', missing.length);
if (missing.length > 0) {
  console.log('Missing architectures:', missing);
} else {
  console.log('All 22 products have matching architectures in watchArchitectures.ts!');
}
