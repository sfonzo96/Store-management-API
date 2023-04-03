import logger from '../utils/logge.js';

export default function loggerMiddleware(req, res, next) {
    logger.info(
        `${new Date().toLocalString()} - Method: ${req.method} URL: ${req.url}`
    );
    next();
}
