import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { verifyAccessToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token' });
  }
}
