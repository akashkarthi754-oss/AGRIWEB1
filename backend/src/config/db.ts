import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();

    if (mongoUri && mongoUri.length > 0) {
      const isAtlas = mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb.net');
      console.log(`Connecting to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}...`);

      try {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 8000,
          connectTimeoutMS: 10000,
        });
        if (isAtlas) {
          console.log('🍃 Connected successfully to MongoDB Atlas cloud database');
        } else {
          console.log('🍃 Connected successfully to MongoDB database');
        }
        return;
      } catch (atlasErr: any) {
        console.error('\n❌ Could NOT connect to MongoDB Atlas.');

        if (
          atlasErr?.message?.toLowerCase().includes('whitelist') ||
          atlasErr?.message?.toLowerCase().includes('ip') ||
          atlasErr?.reason?.type === 'ReplicaSetNoPrimary'
        ) {
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('🔒 CAUSE: Your current IP address is NOT whitelisted on Atlas.');
          console.error('');
          console.error('   HOW TO FIX (takes ~30 seconds):');
          console.error('   1. Go to https://cloud.mongodb.com');
          console.error('   2. Open your project → Security → Network Access');
          console.error('   3. Click "Add IP Address"');
          console.error('   4. Enter your current IP: check https://api.ipify.org');
          console.error('      OR click "Allow Access from Anywhere" (0.0.0.0/0)');
          console.error('      for unrestricted access during development.');
          console.error('   5. Click Confirm → wait ~30s for it to activate.');
          console.error('   6. Restart the server with:  npm run dev');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } else {
          console.error('Error details:', atlasErr.message);
        }

        console.warn('⚠️  Falling back to in-memory MongoDB so the server can start...');
        console.warn('   Data will NOT be persisted until Atlas is reachable.\n');
      }
    } else {
      console.warn('⚠️ No MONGO_URI or MONGODB_URI found in .env.');
      console.warn('   Starting with in-memory MongoDB (data is not persisted).');
      console.warn('   Set MONGO_URI in your .env file to persist data.\n');
    }

    // In-memory fallback so the server always starts
    mongoServer = await MongoMemoryServer.create({
      instance: { dbName: 'agriconnect' },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('🍃 Running on in-memory MongoDB (fallback). Data resets on restart.\n');
  } catch (error) {
    console.error('❌ Fatal MongoDB error — could not start any database:', error);
    throw error;
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
};
