import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

async function testMongo() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing MongoDB connection with URI:', uri ? uri.replace(/:([^:@]{3})[^:@]*@/, ':***@') : 'NONE');

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    const start = Date.now();
    await client.connect();
    console.log(`Connected to MongoDB in ${Date.now() - start}ms!`);
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases available:', dbs.databases.map(d => d.name));
    await client.close();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

testMongo();
