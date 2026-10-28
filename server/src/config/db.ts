import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Node.js / Windows SRV lookup issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback if custom servers cannot be set
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
