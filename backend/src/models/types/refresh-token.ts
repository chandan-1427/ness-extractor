import { Document, Types } from 'mongoose';

export interface IRefreshToken {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date | null;
  replacedByTokenHash?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}

// Use this for backend logic where you need Mongoose methods (like .save())
export type IRefreshTokenDocument = IRefreshToken & Document;