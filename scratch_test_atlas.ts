import { connectDB, closeDB } from './backend/src/config/db.js';
import { User } from './backend/src/models/index.js';

async function testAtlas() {
  console.log('Testing Atlas connection from .env...');
  console.log('MONGO_URI from process.env:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'NOT SET');
  
  try {
    await connectDB();
    console.log('Connected! Testing user count in database...');
    const count = await User.countDocuments();
    console.log('User count in Atlas database:', count);
    await closeDB();
  } catch (err: any) {
    console.error('Connection test failed with error:', err.message);
  }
}

testAtlas();
