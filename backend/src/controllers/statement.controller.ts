import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/types/auth.js';
import { extractStatement } from '../services/statement-extract.service.js';
import { Statement } from '../models/statement.model.js';
import { getUserStatementsCursor } from '../services/statement-cursor.service.js';
import type { Filters } from '../types/statement.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export async function createStatement(
  req: AuthenticatedRequest,
  res: Response
) {
  const { text } = req.body;

  const extracted = extractStatement(text);

  const statement = await Statement.create({
    userId: req.user!.id,
    ...extracted,
    rawText: text,
  });

  res.status(201).json(statement);
}

export const listStatements = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const {
    cursor,
    limit = '10',
    type,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
  } = req.query;

  // Production Safety: Prevent massive limit requests
  const parsedLimit = Math.min(Number(limit), 50);

  // 1. Initialize an empty filter object
  const filters: Filters = {};

  // 2. Conditionally add properties to satisfy exactOptionalPropertyTypes
  if (type === 'debit' || type === 'credit') {
    filters.type = type;
  }

  if (fromDate) {
    const date = new Date(fromDate as string);
    if (!isNaN(date.getTime())) filters.fromDate = date;
  }

  if (toDate) {
    const date = new Date(toDate as string);
    if (!isNaN(date.getTime())) filters.toDate = date;
  }

  if (minAmount) {
    const val = Number(minAmount);
    if (!isNaN(val)) filters.minAmount = val;
  }

  if (maxAmount) {
    const val = Number(maxAmount);
    if (!isNaN(val)) filters.maxAmount = val;
  }

  // 3. Pass to service
  // Ensure userId is present (guaranteed by auth middleware)
  if (!req.user?.id) {
    throw new AppError('User authentication failed', 401);
  }

  const result = await getUserStatementsCursor(
    req.user.id,
    parsedLimit,
    cursor as string | undefined,
    filters
  );

  res.status(200).json({
    status: 'success',
    ...result
  });
});
