const {
  createLogger,
  format,
  transports,
} = require('winston');
const path = require('path');

const LOGGING_LEVEL = 'error';
const logger = createLogger({
  level: LOGGING_LEVEL,
  format: format.combine(
      format.label({
        label: path.basename(process.mainModule.filename),
      }),
      format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss',
      }),
  ),
  transports: [
    new transports.File({
      filename: 'rider-api.log',
      handleExceptions: true,
      format: format.combine(
          format.colorize(),
          format.printf(
              (info) => `${info.timestamp} ${LOGGING_LEVEL} [${info.label}]: ${info.message}`,
          ),
      ),
    })
  ],
});

module.exports = logger;
