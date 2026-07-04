const { ApiError } = require('../utils/ApiError');

function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    if (!err.isOperational) console.error('INTERNAL ERROR:', err);
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate value violates a unique constraint' });
  }

  console.error('UNEXPECTED ERROR:', err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
}

module.exports = { notFoundHandler, errorHandler };
