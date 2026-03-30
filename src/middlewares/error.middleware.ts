import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'An unexpected error occurred');

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status,
    message,
  });
};
