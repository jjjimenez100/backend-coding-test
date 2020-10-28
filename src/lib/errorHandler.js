const logger = require('./logger');

// Express needs the final parameter next, or it passes next as the third
// parameter
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  logger.error(`Encountered error. ${error}`);

  return response.status(500).send({
    error_code: 'SERVER_ERROR',
    message: 'Unknown error',
  });
};

module.exports = {
  errorHandler,
};
