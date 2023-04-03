import dotenv from 'dotenv';
dotenv.config();

const serverConfig = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    APP_ID: process.env.APP_ID,
    NODE_ENV: process.env.NODE_ENV || 'development',
};

export default serverConfig;
