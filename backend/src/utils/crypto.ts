import crypto from 'crypto';

export const hashToken = (token: string) => {
  if (!token) {
    throw new Error('HashToken: No token provided');
  }
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateRandomToken = () =>
  crypto.randomBytes(40).toString('hex');
