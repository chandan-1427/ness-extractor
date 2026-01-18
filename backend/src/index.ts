import { app } from './app.js';
import { env } from './config/index.js';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function startServer() {
  try {
    // 1. Initialize Database
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // 3. Setup Signal Handlers
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      if (server) {
        server.close(async () => {
          console.log('🛑 HTTP server closed.');
          try {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed.');
            process.exit(0);
          } catch (err) {
            console.error('Error during DB closure:', err);
            process.exit(1);
          }
        });
      } else {
        process.exit(0);
      }

      // Force exit after 10s if graceful shutdown hangs
      setTimeout(() => {
        console.error('Forcefully shutting down after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('💥 Failed to start server during boot:', error);
    process.exit(1);
  }
}

/* -------------------- UNCAUGHT ERROR HANDLING -------------------- */

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err.name, ':', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(reason);
  // In production, you might want to shutdown gracefully here too
  process.exit(1);
});

startServer();