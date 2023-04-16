import serverConfig from './config/server.config.js';
import mongoose from 'mongoose';
import container from './container.js';
import logger from './logger/index.logger.js';

const app = container.resolve('App');

mongoose.set('strictQuery', false);

mongoose.connect(serverConfig.MONGO_URI, (err) => {
  if (err) {
    logger.error('Error:', err);
  } else {
    logger.info('✅ Conection to DB established');
    return app.start();
  }
});

// TODO: ADD MEANINGFUL COMMENTS ALL ON EVERY FILE WHERE NEEDED
