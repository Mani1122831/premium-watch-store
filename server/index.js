import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectToDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Start Listening and Connect to DB
const server = app.listen(PORT, () => {
  console.log(`[TITANOVA Server] Concierge, Auth & Orders API running at http://localhost:${PORT}`);
});

connectToDatabase().catch(err => {
  console.warn('[TITANOVA Server] Database initialization note:', err.message);
});

export default server;
