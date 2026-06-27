import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  userId: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: 604800 }); // 7 days
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: 2592000 }); // 30 days
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
}
