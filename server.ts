import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './backend/src/app.js';
import { connectDB } from './backend/src/config/db.js';
import { seedDatabase } from './backend/src/seed/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  // 1. Connect to MongoDB database
  await connectDB();

  // 2. Ensure initial seed data exists
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Database seeding error on boot:', err);
  }

  // 3. Create Express app with all REST routes & middleware
  const app = createApp();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite dev middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 AgriConnect Full-Stack Platform running on http://localhost:${PORT}`);
    console.log(`🌱 Health check:  http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend:      http://localhost:${PORT}\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already occupied by another process.`);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('   To find and stop the other process, run:');
      console.error(`\n   netstat -ano | findstr :${PORT}`);
      console.error('   Then:  Stop-Process -Id <PID> -Force\n');
      console.error('   Or kill ALL stray node processes at once:');
      console.error('   Get-Process node | Stop-Process -Force\n');
      console.error('   Then restart:  npm run dev');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(1);
    } else {
      console.error('Server listening error:', err);
      process.exit(1);
    }
  });
}

startServer();
