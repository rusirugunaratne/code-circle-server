import { pinoHttp } from 'pino-http';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const loggerMiddleware = pinoHttp({
  logger,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        // Exclude large or sensitive headers
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
        },
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}: ${err.message}`;
  },
  // Redact sensitive information
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'req.body.password', 'res.headers["set-cookie"]'],
    remove: true,
  },
});
