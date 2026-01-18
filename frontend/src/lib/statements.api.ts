const API_BASE = 'http://localhost:5000';

export async function fetchStatements({
  token,
  cursor,
  limit,
  type,
  fromDate,
  toDate,
  minAmount,
  maxAmount,
}: {
  token: string;
  cursor?: string | null;
  limit: number;
  type?: 'debit' | 'credit';
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}) {
  const params = new URLSearchParams();

  if (cursor) params.append('cursor', cursor);
  if (type) params.append('type', type);
  if (fromDate) params.append('fromDate', fromDate.toISOString());
  if (toDate) params.append('toDate', toDate.toISOString());
  if (minAmount) params.append('minAmount', String(minAmount));
  if (maxAmount) params.append('maxAmount', String(maxAmount));
  params.append('limit', String(limit));

  const res = await fetch(`${API_BASE}/secure/statements/fetch?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch statements');
  }

  return res.json();
}

export async function createStatement({
  token,
  text,
}: {
  token: string;
  text: string;
}) {
  const res = await fetch(`${API_BASE}/secure/statements/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Extraction failed');
  }

  return res.json();
}
