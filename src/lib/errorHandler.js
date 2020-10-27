const logger = require('./logger');

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
