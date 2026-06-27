import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AppError, ValidationError } from '../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
  });
}
