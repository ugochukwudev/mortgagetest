import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  if ('name' in err && err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation error',
      details: (err as any).errors,
    });
    return;
  }

  logger.error('Error:', { error: err, stack: err.stack });

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

