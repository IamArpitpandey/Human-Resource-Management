const { ZodError } = require('zod');
const { ApiError } = require('../utils/ApiError');

function validate(schema) {
  return (req, _res, next) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(ApiError.badRequest(message));
      }
      next(err);
    }
  };
}

module.exports = { validate };
