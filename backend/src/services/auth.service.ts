import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { RefreshToken } from '../models/refresh-token.model.js';
import { generateRandomToken, hashToken } from '../utils/crypto.js';
import { signAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';

export async function registerUser(email: string, username: string, password: string) {
  // Check both fields to provide a clear error message
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    // 409 Conflict is the standard for duplicate resources
    throw new AppError('Email or username is already taken', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    username,
    passwordHash,
  });

  return user;
}

export async function loginUser(
  email: string, 
  password: string, 
  meta: { ip?: string; userAgent?: string }
) {
  const user = await User.findOne({ email }).select('+passwordHash');
  
  // Use a generic 401 Unauthorized for security (don't hint if the email exists)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    ipAddress: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  });

  return { accessToken, refreshToken };
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError('Refresh token is required for logout', 400);
  }

  const tokenHash = hashToken(refreshToken);

  // Find and update the token. 
  // We check for 'revokedAt: null' to ensure we aren't revoking an already dead session.
  const result = await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    { revokedAt: new Date() }
  );

  if (!result) {
    // If no token was found, it was either already revoked, expired, or never existed.
    // 404 is technically correct, but some prefer 204 for idempotency.
    throw new AppError('Token is invalid or already revoked', 404);
  }
}
