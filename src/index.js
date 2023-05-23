import serverConfig from './config/server.config.js';
import mongoose from 'mongoose';
import container from './container.js';
import logger from './logger/index.logger.js';

// Instanciates the server app object
const app = container.resolve('App');

// Connects to the DB
mongoose.set('strictQuery', false);
mongoose.connect(serverConfig.MONGO_URI, (err) => {
  if (err) {
    logger.error('Error:', err);
  } else {
    logger.info('✅ Conection to DB established');
    // Starts the server
    return app.start();
  }
});
