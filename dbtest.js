import mongoose from 'mongoose';
import serverConfig from './src/config/server.config.js';

// This is a localdatabase connection initiator for testing purposes
export default async function dbtest() {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(serverConfig.MONGO_URI);
    console.log('✅ Conection to DB established');
  } catch {
    throw new Error('❌ Connection to DB failed', error.message);
  }
  1;
}
