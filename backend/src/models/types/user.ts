import { Document, Types } from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Use this type when you specifically need the Mongoose Document methods (like .save())
export type IUserDocument = IUser & Document & {
    _id: Types.ObjectId;
};