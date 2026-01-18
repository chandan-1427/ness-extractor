import type { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser, logoutUser } from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;
  const user = await registerUser(email, username, password);

  res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const tokens = await loginUser(email, password, {
    ip: req.ip!,
    userAgent: req.headers['user-agent']!,
  });

  res.json(tokens);
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      // 400 Bad Request if the token is missing
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    await logoutUser(refreshToken);
    res.status(200).json({
      message: 'Successfully logged out'
    });
  } catch (error) {
    next(error); // Pass errors to your global error handler
  }
}
