const {
  createLogger,
  format,
  transports,
} = require('winston');
const path = require('path');

const LOGGING_LEVEL = 'info';
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
      level: LOGGING_LEVEL,
      filename: 'rider-api.log',
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
        ),
      ),
    }),
  ],
});

module.exports = logger;
