import express from 'express';
import cors from 'cors';
import { isUsingMockDb } from './config/db.js';
import { getMailConfig, testEmailDelivery } from './services/emailService.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mask email for public health responses (e.g., "ka***@gmail.com")
function maskEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return 'NOT_CONFIGURED';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
}

// Health Check with Email Diagnostics
const handleHealth = (_req, res) => {
  const mailConfig = getMailConfig();
  res.json({
    status: 'ok',
    service: 'TITANOVA Luxury Horology API',
    database: isUsingMockDb() ? 'resilient-local-fallback' : 'mongodb-connected',
    emailConfigured: mailConfig.isConfigured,
    emailAccount: maskEmail(mailConfig.mailUser),
    adminEmail: maskEmail(mailConfig.adminEmail),
    platform: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
    time: new Date().toISOString(),
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Test Email Endpoint (GET or POST)
const handleTestEmail = async (req, res) => {
  try {
    const to = req.query.to || req.body?.to;
    const result = await testEmailDelivery(to);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

app.get('/api/health/test-email', handleTestEmail);
app.post('/api/health/test-email', handleTestEmail);
app.get('/health/test-email', handleTestEmail);
app.post('/health/test-email', handleTestEmail);

// API Routes (Mounted both with and without /api prefix for bulletproof Vercel rewriting)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

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
