import mongoose, { Schema, Document } from 'mongoose';

export interface IStatement extends Document {
  userId: mongoose.Types.ObjectId;

  amount: number;
  balance?: number;
  currency: string;
  type: 'debit' | 'credit';

  date: Date;
  description: string;

  rawText: string;
  createdAt: Date;
}

const StatementSchema = new Schema<IStatement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balance: {
      type: Number,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    type: {
      type: String,
      enum: ['debit', 'credit'],
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// Common queries
StatementSchema.index({ userId: 1, date: -1 });
StatementSchema.index({ userId: 1, createdAt: -1, _id: -1 });
StatementSchema.index({ userId: 1, type: 1 });
StatementSchema.index({ userId: 1, date: -1 });

export const Statement = mongoose.model<IStatement>(
  'Statement',
  StatementSchema
);
