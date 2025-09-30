import winston from 'winston';
import { CONFIG } from '../utils/constant-value';

const { NODE_ENV } = CONFIG;

interface LogMeta {
  message?: string;
  error?: string;
  stack?: string;
  statusCode?: number;
  url?: string;
  method?: string;
  ip?: string;
  service?: string;
  name?: string;
}

interface Info extends LogMeta {
  timestamp?: string;
  level?: string;
}

class LoggerService {
  private static instance: LoggerService;
  private logger!: winston.Logger;

  constructor() {
    if (LoggerService.instance) {
      return LoggerService.instance;
    }

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({
        format: () =>
          new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.printf((info: unknown) => {
        const {
          timestamp,
          level,
          message,
          error,
          stack,
          statusCode,
          url,
          method,
          ip,
          service,
          name,
        } = info as Info;

        let output = ``;
        if (timestamp) output += `\n  Timestamp: ${timestamp}`;
        if (level) output += `\n  Level: ${level}`;
        if (message) output += `\n  Message: ${message}`;
        if (error) output += `\n  Error: ${error}`;
        if (name) output += `\n  Name: ${name}`;
        if (service) output += `\n  Service: ${service}`;
        if (statusCode) output += `\n  Status: ${statusCode}`;
        if (url) output += `\n  URL: ${url}`;
        if (method) output += `\n  Method: ${method}`;
        if (ip) output += `\n  IP: ${ip}`;
        if (stack) output += `\n  Stack: ${stack}`;

        return output;
      })
    );

    this.logger = winston.createLogger({
      level: NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
      ],
    });

    LoggerService.instance = this;
  }

  error(message: string, meta: LogMeta = {}): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: LogMeta = {}): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta: LogMeta = {}): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta: LogMeta = {}): void {
    this.logger.debug(message, meta);
  }

  getLoggerInstance(): winston.Logger {
    return this.logger;
  }
}

// Freeze and export the singleton interface
const loggerInstance = Object.freeze(new LoggerService());

export default loggerInstance;
