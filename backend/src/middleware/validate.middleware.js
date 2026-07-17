const ApiError = require('../utils/apiError');

/**
 * Generic validation middleware factory. Takes a Zod schema and validates
 * req.body (or req.query/params if specified), attaching parsed+typed
 * data back onto the request. Controllers never need to re-validate.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const details = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }

  req[source] = result.data;
  next();
};

module.exports = validate;
