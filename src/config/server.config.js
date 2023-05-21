import dotenv from 'dotenv';
dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 3000,
  MONGO_URI:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  APP_ID: process.env.APP_ID,
  NODE_ENV: process.env.NODE_ENV || 'development',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export default serverConfig;
