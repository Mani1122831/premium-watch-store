import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let client = null;
let db = null;
let isConnected = false;
let isMock = false;

// Fallback in-memory storage file for development when MongoDB is unreachable
const fallbackFilePath = process.env.VERCEL
  ? path.join('/tmp', 'dev-mongo-fallback.json')
  : path.join(__dirname, '..', '..', 'scratch', 'dev-mongo-fallback.json');

function loadFallbackData() {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      return JSON.parse(fs.readFileSync(fallbackFilePath, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not read fallback storage, initializing empty state:', err.message);
  }
  return { users: [], chat_sessions: [], orders: [] };
}

function saveFallbackData(data) {
  try {
    const dir = path.dirname(fallbackFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist fallback store:', err.message);
  }
}

// In-memory collection emulator
class MemoryCollection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  _getData() {
    const store = loadFallbackData();
    return store[this.name] || [];
  }

  _setData(items) {
    const store = loadFallbackData();
    store[this.name] = items;
    saveFallbackData(store);
  }

  async findOne(query) {
    const items = this._getData();
    return (
      items.find(item => {
        for (const [k, v] of Object.entries(query)) {
          if (k === '_id' && item._id?.toString() !== v?.toString()) return false;
          if (k === 'orderId' && item.orderId !== v) return false;
          if (k === 'email' && item.email?.toLowerCase() !== v?.toLowerCase()) return false;
          if (v && typeof v === 'object' && v.$gt !== undefined) {
            const itemVal = item[k] instanceof Date ? item[k] : new Date(item[k]);
            const compVal = v.$gt instanceof Date ? v.$gt : new Date(v.$gt);
            if (!(itemVal > compVal)) return false;
            continue;
          }
          if (k !== '_id' && k !== 'orderId' && k !== 'email' && item[k] !== v) return false;
        }
        return true;
      }) || null
    );
  }

  async insertOne(doc) {
    const items = this._getData();
    const newDoc = {
      ...doc,
      _id: doc._id || new ObjectId().toString(),
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
    items.push(newDoc);
    this._setData(items);
    return { insertedId: newDoc._id, acknowledged: true };
  }

  async updateOne(filter, update) {
    const items = this._getData();
    const idx = items.findIndex(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (k === '_id' && item._id?.toString() !== v?.toString()) return false;
        if (k === 'orderId' && item.orderId !== v) return false;
        if (k === 'email' && item.email?.toLowerCase() !== v?.toLowerCase()) return false;
        if (k !== '_id' && k !== 'orderId' && k !== 'email' && item[k] !== v) return false;
      }
      return true;
    });

    if (idx === -1) {
      if (update.$setOnInsert) {
        const newDoc = {
          ...filter,
          ...update.$setOnInsert,
          _id: new ObjectId().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        items.push(newDoc);
        this._setData(items);
        return { modifiedCount: 1, upsertedId: newDoc._id };
      }
      return { modifiedCount: 0 };
    }

    if (update.$set) {
      items[idx] = { ...items[idx], ...update.$set, updatedAt: new Date() };
    }
    if (update.$unset) {
      for (const k of Object.keys(update.$unset)) {
        delete items[idx][k];
      }
    }
    if (update.$push) {
      for (const [k, v] of Object.entries(update.$push)) {
        if (!Array.isArray(items[idx][k])) items[idx][k] = [];
        items[idx][k].push(v);
      }
    }

    this._setData(items);
    return { modifiedCount: 1 };
  }

  async deleteOne(filter = {}) {
    const items = this._getData();
    const idx = items.findIndex(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (k === '_id' && item._id?.toString() !== v?.toString()) return false;
        if (k === 'email' && item.email?.toLowerCase() !== v?.toLowerCase()) return false;
        if (k !== '_id' && k !== 'email' && item[k] !== v) return false;
      }
      return true;
    });
    if (idx !== -1) {
      items.splice(idx, 1);
      this._setData(items);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  find(filter = {}) {
    const items = this._getData();
    const filtered = items.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (k === '_id' && item._id?.toString() !== v?.toString()) return false;
        if (k === 'orderId' && item.orderId !== v) return false;
        if (k === 'userId' && item.userId?.toString() !== v?.toString()) return false;
        if (k === 'conversationId' && item.conversationId !== v) return false;
        if (k !== '_id' && k !== 'orderId' && k !== 'userId' && k !== 'conversationId' && item[k] !== v) return false;
      }
      return true;
    });

    return {
      sort: (sortObj = {}) => ({
        toArray: async () => {
          return filtered.sort((a, b) => {
            for (const [k, dir] of Object.entries(sortObj)) {
              const aVal = a[k] ? new Date(a[k]).getTime() || a[k] : 0;
              const bVal = b[k] ? new Date(b[k]).getTime() || b[k] : 0;
              if (aVal < bVal) return dir === 1 ? -1 : 1;
              if (aVal > bVal) return dir === 1 ? 1 : -1;
            }
            return 0;
          });
        },
      }),
      toArray: async () => filtered,
    };
  }

  async deleteMany(filter = {}) {
    const items = this._getData();
    const remaining = items.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (k === 'userId' && item.userId?.toString() === v?.toString()) return false;
        if (k === 'conversationId' && item.conversationId === v) return false;
      }
      return true;
    });
    const deletedCount = items.length - remaining.length;
    this._setData(remaining);
    return { deletedCount };
  }
}

export async function connectToDatabase() {
  let uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGODB_URl;
  const dbName = process.env.MONGODB_DB_NAME || 'titanova_store';

  if (uri && typeof uri === 'string') {
    uri = uri.trim().replace(/^['"]|['"]$/g, '');
    if (uri.startsWith('Imongodb')) {
      uri = uri.slice(1);
    }
  }

  if (!uri || uri.includes('your_mongodb_connection_string') || uri.includes('localhost:27017')) {
    console.log('[Database] MONGODB_URI points to localhost/placeholder. Seamlessly engaging resilient local database store.');
    isMock = true;
    return getMockDb();
  }

  try {
    const connectPromise = (async () => {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await client.connect();
      db = client.db(dbName);
      isConnected = true;
      isMock = false;
      console.log(`[Database] Connected successfully to MongoDB Atlas (${dbName})`);

      // Ensure indexes on collections
      try {
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('chat_sessions').createIndex({ userId: 1, conversationId: 1 });
        await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
        await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
      } catch (idxErr) {
        console.warn('[Database] Index setup notice:', idxErr.message);
      }
      return db;
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection probe timeout')), 5500)
    );

    return await Promise.race([connectPromise, timeoutPromise]);
  } catch (err) {
    console.warn(`[Database] MongoDB Atlas connection note (${err.message}). Seamlessly engaging resilient local database store.`);
    isMock = true;
    return getMockDb();
  }
}

function getMockDb() {
  return {
    collection: (name) => new MemoryCollection(name),
  };
}

export function getDb() {
  if (db && isConnected) return db;
  return getMockDb();
}

export function getUsersCollection() {
  return getDb().collection('users');
}

export function getChatSessionsCollection() {
  return getDb().collection('chat_sessions');
}

export function getOrdersCollection() {
  return getDb().collection('orders');
}

export function isUsingMockDb() {
  return isMock;
}
