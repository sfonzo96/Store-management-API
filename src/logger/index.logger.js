import serverConfig from '../config/server.config';
import devLogger from './devLogger.js';
import productionLogger from './productionLogger.js';

let logger = null;

if (serverConfig.NODE_ENV === 'development') {
    logger = devLogger();
}

if (serverConfig.NODE_ENV === 'production') {
    logger = productionLogger();
}

export default logger;
