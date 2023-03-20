import serverConfig from './config/server.config.js';
import mongoose from 'mongoose';
import container from './container.js';

const app = container.resolve('App');

mongoose.set('strictQuery', false);

mongoose.connect(serverConfig.MONGO_URI, (err) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('✅ Conection to DB established');
        return app.start();
    }
});
