import mongoose from 'mongoose';
import { env } from './index.js';

export async function connectDB() {
  // 1. Setup listeners for the connection lifecycle
  mongoose.connection.on('connected', () => {
    console.log('📦 Database connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  // 2. Perform the initial connection
  // Mongoose 6+ doesn't need useNewUrlParser or useUnifiedTopology
  await mongoose.connect(env.DATABASE_URL);
}