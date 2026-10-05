import express from 'express';
import products from '../data/products.js';
import { validateAllProductMedia } from '../utils/mediaValidator.js';

const router = express.Router();

// GET /api/products/validate-media - Audit and validate catalog media integrity
router.get('/validate-media', (_req, res) => {
  const auditResult = validateAllProductMedia();
  return res.json(auditResult);
});

// GET /api/products - List all watches with optional category/search filters
router.get('/', (req, res) => {
  const { category, gender, search, limit } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender) {
    result = result.filter(p => p.gender === gender || p.gender === 'unisex');
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  return res.json({ products: result, total: result.length });
});

// GET /api/products/:id - Get single watch by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: `Timepiece with ID '${id}' not found.` });
  }

  return res.json({ product });
});

export default router;
