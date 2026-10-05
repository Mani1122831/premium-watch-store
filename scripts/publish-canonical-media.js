import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const baseImg = path.join(publicDir, 'images', 'watches');
const baseVid = path.join(publicDir, 'videos', 'watches');
const baseMod = path.join(publicDir, 'models', 'watches');
const productsDir = path.join(publicDir, 'products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

const products = [
  { id: 'p001', slug: 'meridian-classic-gold', name: 'Meridian Classic Gold' },
  { id: 'p002', slug: 'titanova-chronograph-black', name: 'Titanova Chronograph Black' },
  { id: 'p003', slug: 'titanova-heritage-steel', name: 'Titanova Heritage Steel' },
  { id: 'p004', slug: 'titanova-royal-automatic', name: 'Titanova Royal Automatic' },
  { id: 'p005', slug: 'titanova-elegance-gold', name: 'Titanova Elegance Gold' },
  { id: 'p006', slug: 'titanova-pearl-silver', name: 'Titanova Pearl Silver' },
  { id: 'p007', slug: 'titanova-rose-classic', name: 'Titanova Rose Classic' },
  { id: 'p008', slug: 'titanova-luxe-black', name: 'Titanova Luxe Black' },
  { id: 'p009', slug: 'titanova-smart-x1', name: 'Titanova Smart X1' },
  { id: 'p010', slug: 'titanova-smart-pro', name: 'Titanova Smart Pro' },
  { id: 'p011', slug: 'titanova-connect', name: 'Titanova Connect' },
  { id: 'p012', slug: 'titanova-elite-smart', name: 'Titanova Elite Smart' },
  { id: 'p013', slug: 'vanguard-diver-200', name: 'Vanguard Diver 200' },
  { id: 'p014', slug: 'grid-urban-steel', name: 'Grid Urban Steel' },
  { id: 'p015', slug: 'terra-forest-automatic', name: 'Terra Forest Automatic' },
  { id: 'p016', slug: 'noir-chronograph-gold', name: 'Noir Chronograph Gold' },
  { id: 'p017', slug: 'helix-sport-automatic', name: 'Helix Sport Automatic' },
  { id: 'p018', slug: 'aurelia-pearl-quartz', name: 'Aurelia Pearl Quartz' },
  { id: 'p019', slug: 'marquise-gold-bangle', name: 'Marquise Gold Bangle' },
  { id: 'p020', slug: 'epoch-gmt-dual-time', name: 'Epoch GMT Dual Time' },
  { id: 'p021', slug: 'atlas-titanium-chrono', name: 'Atlas Titanium Chrono' },
  { id: 'p022', slug: 'purity-minimal-pure', name: 'Purity Minimal Pure' }
];

function hashFile(p) {
  return fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : null;
}

const seenHashes = new Map();
const publishedRegistry = {};

products.forEach(p => {
  const pDir = path.join(productsDir, p.id);
  if (!fs.existsSync(pDir)) {
    fs.mkdirSync(pDir, { recursive: true });
  }

  publishedRegistry[p.id] = {};

  // Images
  ['front', 'back', 'side', 'top'].forEach(angle => {
    const srcFile = path.join(baseImg, p.slug, `${angle}.jpg`);
    const h = hashFile(srcFile);
    if (!h) {
      console.log(`[${p.id}] ${angle}: missing file`);
    } else if (seenHashes.has(h)) {
      console.log(`[${p.id}] ${angle}: duplicate of ${seenHashes.get(h)} -> leaving null`);
    } else {
      seenHashes.set(h, `${p.id}.${angle}`);
      const destJpg = path.join(pDir, `${angle}.jpg`);
      const destWebp = path.join(pDir, `${angle}.webp`);
      fs.copyFileSync(srcFile, destJpg);
      fs.copyFileSync(srcFile, destWebp);
      publishedRegistry[p.id][angle] = true;
      console.log(`[${p.id}] ${angle}: published (${angle}.jpg)`);
    }
  });

  // Video
  const srcVid = path.join(baseVid, p.slug, 'making.mp4');
  const vh = hashFile(srcVid);
  if (!vh) {
    console.log(`[${p.id}] video: none -> leaving null`);
  } else if (seenHashes.has(vh)) {
    console.log(`[${p.id}] video: duplicate of ${seenHashes.get(vh)} -> leaving null`);
  } else {
    seenHashes.set(vh, `${p.id}.assemblyVideo`);
    const destVid = path.join(pDir, 'assembly.mp4');
    fs.copyFileSync(srcVid, destVid);
    publishedRegistry[p.id].assemblyVideo = true;
    console.log(`[${p.id}] video: published (assembly.mp4)`);
  }

  // 3D Model (p006)
  if (p.id === 'p006') {
    const srcMod = path.join(baseMod, 'p006_titanova_assembly.glb');
    if (fs.existsSync(srcMod)) {
      const destMod = path.join(pDir, 'model.glb');
      fs.copyFileSync(srcMod, destMod);
      publishedRegistry[p.id].model3d = true;
      console.log(`[${p.id}] model3d: published (model.glb)`);
    }
  }
});

console.log('\nGenerated Published Registry:');
console.log(JSON.stringify(publishedRegistry, null, 2));

// Write JSON manifest to products directory
fs.writeFileSync(
  path.join(productsDir, 'published-manifest.json'),
  JSON.stringify(publishedRegistry, null, 2),
  'utf8'
);

console.log('\nCanonical media successfully populated under public/products/!');
