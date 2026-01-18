import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Token is required'),
});