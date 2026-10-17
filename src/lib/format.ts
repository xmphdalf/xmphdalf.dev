const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

/** "Jul 2026" from a stored date, else the bare year, else nothing. */
export function formatMonthOrYear(date?: string | null, year?: number | null): string | null {
  if (date) {
    const parsed = new Date(date);
    if (isValidDate(parsed)) return monthYear.format(parsed);
  }
  if (typeof year === "number" && Number.isFinite(year)) return String(year);
  return null;
}

type Span = {
  startDate?: string | null;
  startYear?: number | null;
  endDate?: string | null;
  endYear?: number | null;
  current?: boolean | null;
};

/** Separator and wording used for every date range on the site. */
export const RANGE_SEPARATOR = " – ";
export const ONGOING = "Present";

/** Joins two ends of a range: "2023 – Jul 2026", "2021 – Present". */
export function formatRange(start: string | null, end: string | null): string | null {
  if (start && end) return start === end ? start : `${start}${RANGE_SEPARATOR}${end}`;
  return start ?? (end && end !== ONGOING ? end : null);
}

/** "2023 – Jul 2026", "Jul 2026 – Present", or null when nothing is known. */
export function formatSpan(span: Span): string | null {
  const start = formatMonthOrYear(span.startDate, span.startYear);
  const end = span.current ? ONGOING : formatMonthOrYear(span.endDate, span.endYear);
  return formatRange(start, end);
}

/**
 * Tidies a free-text range typed in the admin, such as "2022-2023" or
 * "2026 — now", into the same style: "2022 – 2023", "2026 – Present".
 */
export function normalizeRange(text?: string | null): string | null {
  const value = text?.trim();
  if (!value) return null;
  return value
    .split(/\s*[–—-]\s*|\s+to\s+/i)
    .map((part) => (/^(present|now|current)$/i.test(part.trim()) ? ONGOING : part.trim()))
    .filter(Boolean)
    .join(RANGE_SEPARATOR);
}

/** Earliest known year of a span, used to sort or summarise. */
export function startYearOf(span: Span): number | null {
  if (span.startDate) {
    const parsed = new Date(span.startDate);
    if (isValidDate(parsed)) return parsed.getUTCFullYear();
  }
  return typeof span.startYear === "number" ? span.startYear : null;
}

/** Latest known end year of a span. */
export function endYearOf(span: Span): number | null {
  if (span.endDate) {
    const parsed = new Date(span.endDate);
    if (isValidDate(parsed)) return parsed.getUTCFullYear();
  }
  return typeof span.endYear === "number" ? span.endYear : null;
}

/** "github.com/name" from "https://github.com/name/". */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** Lowercase, hyphenated, for the header path, e.g. "mihir-lathiya". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");
}

/** Bio text split on blank lines. */
export function paragraphs(text?: string | null): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** First paragraph trimmed to a meta description length. */
export function summary(text: string | null | undefined, max = 300): string | undefined {
  const first = paragraphs(text)[0];
  if (!first) return undefined;
  if (first.length <= max) return first;
  const cut = first.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
