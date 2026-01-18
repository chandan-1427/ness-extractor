import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any, // Use any here because it could be AppError, Mongoose Error, or native Error
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // 1. Set Defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // 2. Log error for the developer (Only log 500s or unexpected errors in production)
  if (statusCode === 500) {
    console.error('💥 SYSTEM ERROR:', err);
  }

  // 3. Send Response
  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
    message: statusCode === 500 && process.env.NODE_ENV !== 'development' 
      ? 'Something went very wrong' 
      : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}