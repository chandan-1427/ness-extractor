export type ExtractedStatement = {
  amount: number;
  balance?: number;
  currency: string; // "INR" | ...
  type: "debit" | "credit";
  date: Date;
  description: string;

  // Optional enriched info (safe for production pipelines)
  referenceId?: string;
  rawText?: string;
  confidence?: number; // 0..1
};

type ExtractOptions = {
  strict?: boolean; // if true: throw when amount is missing
  defaultCurrency?: string; // INR by default
  includeRawText?: boolean;
};

const DEFAULT_OPTIONS: Required<ExtractOptions> = {
  strict: true,
  defaultCurrency: "INR",
  includeRawText: false,
};

function safeParseMoney(raw: string): number | null {
  // Handles: "1,234.50" "1234" "1,234" "1234.5"
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;

  // prevent "1.2.3" style weirdness
  const parts = cleaned.split(".");
  if (parts.length > 2) return null;

  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function isLikelyNoiseNumberContext(text: string, index: number): boolean {
  // Prevent capturing OTP / Ref / TxnId / Card number etc.
  // We look around the matched number area (small window).
  const start = Math.max(0, index - 18);
  const end = Math.min(text.length, index + 18);
  const window = text.slice(start, end).toLowerCase();

  const noiseHints = [
    "otp",
    "ref",
    "rrn",
    "txn",
    "txnid",
    "transaction id",
    "utr",
    "upi ref",
    "id:",
    "a/c",
    "ac:",
    "card",
    "ending",
    "mob",
    "mobile",
    "ph",
    "phone",
    "cust",
    "customer",
  ];

  return noiseHints.some((h) => window.includes(h));
}

function detectTypeWithScoring(lower: string): { type: "debit" | "credit"; confidence: number } {
  let debitScore = 0;
  let creditScore = 0;

  const debitWords = [
    "debited",
    "debit",
    "dr",
    "spent",
    "paid",
    "withdrawn",
    "purchase",
    "sent",
    "transfer to",
    "upi/pay",
    "imps",
    "neft",
    "rtgs",
    "bill",
    "charged",
    "fee",
  ];

  const creditWords = [
    "credited",
    "credit",
    "cr",
    "received",
    "refund",
    "reversal",
    "cashback",
    "salary",
    "interest",
    "cash deposit",
    "deposit",
    "received from",
    "transfer from",
  ];

  // special negatives / fail statuses
  const failWords = ["failed", "declined", "rejected", "unsuccessful", "reversed"];

  // Weighted scoring
  for (const w of debitWords) if (lower.includes(w)) debitScore += 2;
  for (const w of creditWords) if (lower.includes(w)) creditScore += 2;

  // Strong indicators
  if (/\bdr\b/.test(lower)) debitScore += 2;
  if (/\bcr\b/.test(lower)) creditScore += 2;

  // If explicitly says refund/reversal, prefer credit even if "debited" appears in history
  if (lower.includes("refund") || lower.includes("reversal")) creditScore += 4;

  // If failed transaction, we reduce confidence but still attempt a best guess
  const isFailed = failWords.some((w) => lower.includes(w));
  if (isFailed) {
    debitScore *= 0.7;
    creditScore *= 0.7;
  }

  const total = debitScore + creditScore;
  if (total === 0) {
    return { type: "debit", confidence: 0.35 }; // default guess (most alerts are debit)
  }

  const type = debitScore >= creditScore ? "debit" : "credit";
  const confidence = Math.min(0.95, Math.max(0.4, Math.abs(debitScore - creditScore) / total + 0.35));

  return { type, confidence };
}

function parseDateFromText(text: string): Date | null {
  // Supported:
  // 1) dd/mm/yyyy or dd-mm-yyyy (assume dd/mm for India)
  // 2) yyyy-mm-dd
  // 3) dd Mon yyyy (18 Jan 2026)
  // 4) dd/mm/yy or dd-mm-yy

  // yyyy-mm-dd
  const iso = text.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]) - 1;
    const d = Number(iso[3]);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  // dd/mm/yyyy or dd-mm-yyyy or dd/mm/yy
  const dmy = text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b/);
  if (dmy) {
    const d = Number(dmy[1]);
    const m = Number(dmy[2]) - 1;
    let y = Number(dmy[3]);
    if (y < 100) y = 2000 + y; // 24 -> 2024
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  // "18 Jan 2026" / "18 January 2026"
  const monthName = text.match(
    /\b(\d{1,2})\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{4})\b/i
  );

  if (monthName) {
    const d = Number(monthName[1]);
    const monRaw = monthName[2]!.toLowerCase();
    const y = Number(monthName[3]);

    const map: Record<string, number> = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    };

    const m = map[monRaw];
    if (m === undefined) return null;
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  return null;
}

function extractBalance(text: string): number | null {
  // Balance variants: "Bal", "Balance", "Avl bal", "Available balance", "A/c bal", etc.
  const patterns: RegExp[] = [
    /(available\s*balance|avl\s*bal|avl\.?\s*bal|balance|bal|a\/c\s*bal|ac\s*bal|closing\s*balance)\s*[:\-]?\s*(?:inr|rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(available\s*balance|avl\s*bal|balance)\s*(?:is)?\s*(?:inr|rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[2]) {
      const val = safeParseMoney(m[2]);
      if (typeof val === "number") return val;
    }
  }

  return null;
}

function extractAmount(text: string): { amount: number | null; currency: string } {
  // Handle:
  // ₹499, INR 499, Rs.499, 499 INR, Amount: 499, Amt Rs 499/-
  // Avoid capturing balance value by preferring "amount" keywords first.

  const defaultCurrency = "INR";

  const priorityPatterns: { re: RegExp; currencyGroup?: number; amountGroup: number }[] = [
    // "Amount: INR 499" / "Amt Rs. 499"
    { re: /\b(?:amount|amt)\s*[:\-]?\s*(₹|inr|rs\.?)\s*([\d,]+(?:\.\d{1,2})?)/i, currencyGroup: 1, amountGroup: 2 },
    // "Amount: 499 INR"
    { re: /\b(?:amount|amt)\s*[:\-]?\s*([\d,]+(?:\.\d{1,2})?)\s*(inr|rs\.?|₹)\b/i, currencyGroup: 2, amountGroup: 1 },

    // Standard: "INR 499" / "Rs. 499" / "₹ 499"
    { re: /\b(₹|inr|rs\.?)\s*([\d,]+(?:\.\d{1,2})?)(?:\/-)?\b/i, currencyGroup: 1, amountGroup: 2 },

    // Reverse: "499 INR"
    { re: /\b([\d,]+(?:\.\d{1,2})?)\s*(₹|inr|rs\.?)\b/i, currencyGroup: 2, amountGroup: 1 },
  ];

  for (const p of priorityPatterns) {
    // Access the 're' property inside the object
    const m = text.match(p.re); 
    
    if (!m) continue;

    // TypeScript might still complain here if m[p.amountGroup] could be undefined
    const rawAmount = m[p.amountGroup];
    
    // Fix for the 'string | undefined' error:
    // Ensure rawAmount is a string before passing to safeParseMoney
    if (rawAmount === undefined) continue;

    const rawCurrency = p.currencyGroup ? m[p.currencyGroup] : defaultCurrency;

    const amountIndex = m.index ?? 0;
    if (isLikelyNoiseNumberContext(text, amountIndex)) continue;

    const parsed = safeParseMoney(rawAmount);

    if (typeof parsed === "number") {
      const currency =
        rawCurrency?.toLowerCase().includes("₹") || rawCurrency?.toLowerCase().includes("rs") || rawCurrency?.toLowerCase().includes("inr")
          ? "INR"
          : defaultCurrency;

      return { amount: parsed, currency };
    }
  }

  return { amount: null, currency: defaultCurrency };
}

function extractReferenceId(text: string): string | null {
  const patterns = [
    /\b(?:utr|rrn|ref(?:erence)?\s*no|txn(?:\s*id)?|transaction\s*id)\s*[:\-]?\s*([a-z0-9\-]{6,})\b/i,
    /\b(?:upi\s*ref)\s*[:\-]?\s*([a-z0-9]{6,})\b/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function extractStatement(text: string, options?: ExtractOptions): ExtractedStatement {
  const opts = { ...DEFAULT_OPTIONS, ...(options ?? {}) };

  if (!text || text.trim().length === 0) {
    if (opts.strict) throw new Error("Invalid input: empty text");
    return {
      amount: 0,
      currency: opts.defaultCurrency,
      type: "debit",
      date: new Date(),
      description: "Unknown transaction",
      confidence: 0.0,
      ...(opts.includeRawText ? { rawText: text } : {}),
    };
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();

  // 1) Determine type (scored)
  const typeResult = detectTypeWithScoring(lower);

  // 2) Extract Amount (mandatory in strict mode)
  const { amount, currency } = extractAmount(normalized);

  if (amount === null) {
    if (opts.strict) {
      throw new Error(`Unable to extract amount from: "${normalized}"`);
    }
  }

  // 3) Extract Balance (optional)
  const balance = extractBalance(normalized);

  // 4) Extract Date (fallback = now)
  const parsedDate = parseDateFromText(normalized);
  const date = parsedDate ?? new Date();

  // 5) Description heuristics (keep it safe, avoid hallucinating merchant names)
  const description =
    typeResult.type === "debit"
      ? "Debit transaction"
      : "Credit transaction";

  // 6) Extract Reference ID (optional)
  const referenceId = extractReferenceId(normalized);

  // 7) Build result
  const result: ExtractedStatement = {
    amount: amount ?? 0,
    currency: currency ?? opts.defaultCurrency,
    type: typeResult.type,
    date,
    description,
    confidence: typeResult.confidence,
  };

  if (typeof balance === "number" && !Number.isNaN(balance)) {
    result.balance = balance;
  }

  if (referenceId) {
    result.referenceId = referenceId;
  }

  if (opts.includeRawText) {
    result.rawText = normalized;
  }

  return result;
}
