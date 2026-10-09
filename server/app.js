import express from 'express';
import cors from 'cors';
import { isUsingMockDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'TITANOVA Luxury Horology API',
    database: isUsingMockDb() ? 'resilient-local-fallback' : 'mongodb-connected',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// 404 Handler for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `Endpoint ${req.originalUrl} not found.` });
  }
  next();
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({ error: 'An unexpected error occurred on the TITANOVA server.' });
});

export default app;
