import app from '../server/app.js';
import { connectToDatabase } from '../server/config/db.js';

let dbInitPromise = null;

export default async function handler(req, res) {
  if (!dbInitPromise) {
    dbInitPromise = connectToDatabase().catch(err => {
      console.warn('[Vercel Serverless] DB connection note:', err.message);
    });
  }
  await dbInitPromise;
  return app(req, res);
}
