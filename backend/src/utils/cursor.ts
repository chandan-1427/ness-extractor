/**
 * Encodes a date and ID into a base64 cursor for pagination.
 */
export function encodeCursor(date: Date, id: string): string {
  const timestamp = date.toISOString();
  return Buffer.from(`${timestamp}|${id}`).toString('base64');
}

/**
 * Decodes a base64 cursor into its constituent parts.
 * Resolved "No overload matches this call" for production use.
 */
export function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    const [dateStr, id] = decoded.split('|');

    // 1. Explicit existence check
    // This removes 'undefined' from the type possibility for the Date constructor
    if (!dateStr || !id) {
      throw new Error('Invalid cursor format: missing components');
    }

    // 2. Safely handle the Date conversion
    const createdAt = new Date(dateStr);

    // 3. Validation for "Invalid Date"
    if (isNaN(createdAt.getTime())) {
      throw new Error('Invalid date in cursor');
    }

    return {
      createdAt,
      id,
    };
  } catch (error) {
    // Standard production fallback: return the start of time or now to prevent app crash
    console.error('Cursor decode error:', error);
    return {
      createdAt: new Date(0), // Unix epoch as fallback
      id: '',
    };
  }
}