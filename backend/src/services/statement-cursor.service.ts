import { Statement } from '../models/statement.model.js';
import { decodeCursor, encodeCursor } from '../utils/cursor.js';

type Filters = {
  type?: 'debit' | 'credit';
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
};

export async function getUserStatementsCursor(
  userId: string,
  limit = 10,
  cursor?: string,
  filters: Filters = {}
) {
  // Use a Record type instead of 'any' for better type safety
  const query: Record<string, any> = { userId };

  /* ---------- Filters ---------- */
  if (filters.type) query.type = filters.type;

  if (filters.fromDate || filters.toDate) {
    query.date = {};
    if (filters.fromDate) query.date.$gte = filters.fromDate;
    if (filters.toDate) query.date.$lte = filters.toDate;
  }

  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};
    if (filters.minAmount) query.amount.$gte = filters.minAmount;
    if (filters.maxAmount) query.amount.$lte = filters.maxAmount;
  }

  /* ---------- Cursor Logic ---------- */
  if (cursor) {
    const { createdAt, id } = decodeCursor(cursor);

    // Using $or ensures we don't skip records with the exact same timestamp
    query.$or = [
      { createdAt: { $lt: createdAt } },
      {
        createdAt,
        _id: { $lt: id },
      },
    ];
  }

  // Fetch limit + 1 to determine if there is a next page
  const results = await Statement.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = results.length > limit;
  const data = hasNextPage ? results.slice(0, limit) : results;

  /* ---------- Cursor Generation (Fixing the Error) ---------- */
  let nextCursor: string | null = null;

  if (hasNextPage && data.length > 0) {
    const lastItem = data[data.length - 1];
    
    // Ensure the lastItem actually exists before accessing properties
    if (lastItem) {
      nextCursor = encodeCursor(
        lastItem.createdAt,
        lastItem._id.toString()
      );
    }
  }

  return {
    data,
    nextCursor,
  };
}
