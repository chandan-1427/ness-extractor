import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export function signAccessToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string };
}
