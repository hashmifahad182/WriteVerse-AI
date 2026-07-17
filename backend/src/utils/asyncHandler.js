/**
 * Wraps an async controller/middleware so rejected promises are
 * forwarded to next(err) automatically instead of requiring a
 * try/catch block in every single controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
