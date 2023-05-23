// Error map used in error handler middleware
const errorMap = {
  BAD_REQUEST: { message: 'Bad request', statusCode: 400 },
  INVALID_CREDENTIALS: { message: 'Invalid credentials', statusCode: 401 },
  UNAUTHORIZED: { message: 'Unauthorized', statusCode: 403 },
  FORBIDDEN: { message: 'Forbidden', statusCode: 403 },
  NOT_FOUND: { message: 'Resource not found', statusCode: 404 },
  CONFLICT: { message: 'Conflict on resource', statusCode: 409 },
  VALIDATION_ERROR: { message: 'Validation error', statusCode: 422 },
  SERVER_ERROR: { message: 'Internal server error', statusCode: 500 },
};

export default errorMap;
