const winston = require('winston');

const logger = winston.createLogger({
  level: 'error', // Only log errors
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { API: 'E-Commerce' },
  transports: [
    // File Transport for Errors
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Handle uncaught exceptions & promise rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: 'exceptions.log' })
);
process.on('unhandledRejection', (reason) => {
  throw reason;
});

module.exports = logger;
