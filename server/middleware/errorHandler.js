const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (err.response && err.response.data) {
    // Handle Moco API specific errors
    res.status(err.response.status).json({
      message: err.response.data.message || 'An error occurred with the Moco API',
      errors: err.response.data.errors
    });
  } else {
    res.status(err.status || 500).json({
      message: err.message || 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};

module.exports = errorHandler;
