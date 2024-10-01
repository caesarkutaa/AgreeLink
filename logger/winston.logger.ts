import { createLogger, format, transports, LoggerOptions } from 'winston';

const { combine, timestamp, printf, errors, json } = format;

// Custom log display format
const customFormat = printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
  file: {
    level: 'error',
    filename: 'logs/error.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  combinedFile: {
    level: 'info',
    filename: 'logs/combined.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: 'silly',
    handleExceptions: true,
  },
};

// Development environment logger
const devLogger: LoggerOptions = {
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
};

// Production environment logger
const prodLogger: LoggerOptions = {
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json(),
  ),
  transports: [
    new transports.File(options.file),
    new transports.File(options.combinedFile),
  ],
  exitOnError: false,
};

// Export log instance based on the current environment
export const instance = createLogger(
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger,
);
