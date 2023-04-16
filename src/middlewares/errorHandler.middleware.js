import errorMap from '../utils/errorMap.js';
import CustomError from '../utils/CustomError.js';

export default function errorHandler(err, req, res, next) {
  // Check if the error is thrown as an operational error
  if (err instanceof CustomError) {
    // If it is, then it destructures from errorMap and returns the statusCode and message but if it is not then it returns 500 and 'Internal server error' as default
    const { statusCode, message } = errorMap[err.message] || {
      statusCode: 500,
      message: 'Internal server error',
    };
    // Sends response
    res.status(statusCode).json({
      error: message,
      cause: err.cause,
      stack: err.stack,
    });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// TODO: implement logs for errors
