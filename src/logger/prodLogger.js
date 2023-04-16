import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json } = format;

const productionLogger = () => {
  return createLogger({
    level: 'info',
    format: combine(json(), timestamp()),
    transports: [
      new transports.Console({}),
      new transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });
};

export default productionLogger;
