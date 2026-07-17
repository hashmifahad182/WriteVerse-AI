const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/env');

/**
 * Centralized error handler. Every thrown ApiError (or unexpected error)
 * ends up here via asyncHandler's next(err) forwarding. This is the ONLY
 * place that formats error responses, so the shape is always consistent.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const isOperational = err.isOperational || false;

  if (!isOperational) {
    // Unexpected/programming errors get full stack logging
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Something went wrong. Please try again later.',
    ...(err.details ? { details: err.details } : {}),
    ...(NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
