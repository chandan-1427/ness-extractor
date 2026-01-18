export interface Filters {
  type?: 'debit' | 'credit';
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Optional: for future-proofing
}