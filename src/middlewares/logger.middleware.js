import logger from '../logger/index.logger.js';

export default function loggerMiddleware(req, res, next) {
  logger.info(
    `${new Date().toLocaleString()} - Method: ${req.method} URL: ${req.url}`
  );
  next();
}
