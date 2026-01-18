import type { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import type { AuthenticatedRequest } from './types/auth.js';
import { AppError } from '../utils/appError.js';

export function authenticateUser(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const parts = authHeader.split(' ');
  const token = parts[1];

  // Add a check to ensure token is not undefined/empty
  if (!token) {
  return next(new AppError('Unauthorized: Token missing', 401));
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
    };

    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}
