import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import products from '../data/products.js';
import { mediaPathFor } from '../data/productMedia.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../../public');
const assets = ['front', 'back', 'side', 'top', 'assemblyVideo', 'model3d'];

function fileDigest(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

/** Publishing guard: non-null assets must be canonical, present, and unique. */
export function validateAllProductMedia(productList = products) {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  const urlOwners = new Map();
  const fileOwners = new Map();
  const report = productList.map((product) => {
    const item = { id: product.id, name: product.name, status: 'coming-soon', assets: {} };
    if (!/^p\d{3}$/.test(product.id) || ids.has(product.id)) errors.push(`[INVALID PRODUCT ID] '${product.id}' must be unique and match p###.`);
    ids.add(product.id);
    if (!product.media || product.media.productId !== product.id) {
      errors.push(`[OWNERSHIP ERROR] '${product.name}' media does not belong to '${product.id}'.`);
      item.status = 'invalid';
      return item;
    }
    let count = 0;
    for (const asset of assets) {
      const src = product.media[asset];
      item.assets[asset] = { path: src, exists: false };
      if (!src) continue;
      count += 1;
      const expected = mediaPathFor(product.id, asset);
      if (src !== expected) {
        errors.push(`[CROSS-PRODUCT ERROR] ${product.id}.${asset} must be '${expected}', received '${src}'.`);
        continue;
      }
      if (urlOwners.has(src)) errors.push(`[DUPLICATE URL] '${src}' is assigned to ${urlOwners.get(src)} and ${product.id}.`);
      urlOwners.set(src, product.id);
      const diskPath = path.resolve(publicDir, src.slice(1));
      if (!diskPath.startsWith(`${publicDir}${path.sep}`) || !fs.existsSync(diskPath)) {
        errors.push(`[FILE NOT FOUND] ${product.id}.${asset}: ${diskPath}`);
        continue;
      }
      item.assets[asset].exists = true;
      const digest = fileDigest(diskPath);
      if (fileOwners.has(digest)) errors.push(`[DUPLICATE FILE] ${product.id}.${asset} duplicates ${fileOwners.get(digest)}.`);
      fileOwners.set(digest, `${product.id}.${asset}`);
    }
    item.status = count === 0 ? 'coming-soon' : count === assets.length ? 'complete' : 'partial';
    return item;
  });
  return { valid: errors.length === 0, totalProducts: productList.length, errors, warnings, report };
}
