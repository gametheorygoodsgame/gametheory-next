import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

// Create a base logger
const logger = pino({
  level: isProduction ? 'info' : 'debug', // Adjust log level as needed
});

export { logger };
