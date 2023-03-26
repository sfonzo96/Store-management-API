export default class CustomError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause || 'Internal server error';
        Error.captureStackTrace(this, this.constructor);
    }
}
