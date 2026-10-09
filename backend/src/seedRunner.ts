import { connectDB, closeDB } from './config/db.js';
import { seedDatabase } from './seed/index.js';

const run = async () => {
  await connectDB();
  await seedDatabase();
  await closeDB();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed run error:', err);
  process.exit(1);
});
