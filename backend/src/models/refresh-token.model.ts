import mongoose, { Schema } from 'mongoose';
import type { IRefreshToken } from './types/refresh-token.js';

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL mechanism
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    replacedByTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    userAgent: {
      type: String,
    },

    ipAddress: {
      type: String,
    },
  },
  {
    // Only createdAt is needed for tokens
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

/* -------- Indexes for scale -------- */

// Efficiently fetch a user's active sessions (newest first)
RefreshTokenSchema.index({ userId: 1, createdAt: -1 });

// Fast lookup for token verification
RefreshTokenSchema.index({ tokenHash: 1 });

export const RefreshToken = mongoose.model<IRefreshToken>(
  'RefreshToken',
  RefreshTokenSchema
);