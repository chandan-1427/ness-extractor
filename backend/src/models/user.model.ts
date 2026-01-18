import mongoose, { Schema, Query } from 'mongoose';
import type { IUser } from './types/user.js'; // Adjust path as needed

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* -------------------- INDEXES -------------------- */
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ deletedAt: 1 });
UserSchema.index({ createdAt: -1 });

/* -------------------- QUERY HELPERS -------------------- */

UserSchema.pre(/^find/, function (this: Query<any, IUser>, next) {
  this.where({ deletedAt: null });
  next;
});

export const User = mongoose.model<IUser>('User', UserSchema);